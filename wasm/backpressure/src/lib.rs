#[derive(Clone, Copy)]
struct Config {
    request_rate: f64,
    gateway_cpu: f64,
    sequencer_cpu: f64,
    command_cpu: f64,
    persistence_cpu: f64,
    indexer_cpu: f64,
    command_machines: f64,
    persistence_machines: f64,
    indexer_machines: f64,
    queue_capacity: f64,
    transient_failure_rate: f64,
    poison_failure_rate: f64,
    retry_cost: f64,
    jitter: f64,
}

#[derive(Clone, Copy)]
struct State {
    tick: u64,
    command_queue: f64,
    persistence_queue: f64,
    indexer_queue: f64,
    retry_queue: f64,
    dlq_queue: f64,
    accepted: f64,
    rejected: f64,
    dropped: f64,
    completed: f64,
    indexed: f64,
    transient_failed: f64,
    poison_failed: f64,
    dlq_replayed: f64,
    memory_pressure: f64,
    command_lag_ms: f64,
    persistence_lag_ms: f64,
    indexer_lag_ms: f64,
    status_code: f64,
}

const DEFAULT_CONFIG: Config = Config {
    request_rate: 120.0,
    gateway_cpu: 1.0,
    sequencer_cpu: 1.0,
    command_cpu: 1.0,
    persistence_cpu: 1.0,
    indexer_cpu: 1.0,
    command_machines: 2.0,
    persistence_machines: 2.0,
    indexer_machines: 2.0,
    queue_capacity: 900.0,
    transient_failure_rate: 0.04,
    poison_failure_rate: 0.01,
    retry_cost: 1.4,
    jitter: 0.2,
};

static mut CONFIG: Config = DEFAULT_CONFIG;
static mut STATE: State = empty_state();

const fn empty_state() -> State {
    State {
        tick: 0,
        command_queue: 0.0,
        persistence_queue: 0.0,
        indexer_queue: 0.0,
        retry_queue: 0.0,
        dlq_queue: 0.0,
        accepted: 0.0,
        rejected: 0.0,
        dropped: 0.0,
        completed: 0.0,
        indexed: 0.0,
        transient_failed: 0.0,
        poison_failed: 0.0,
        dlq_replayed: 0.0,
        memory_pressure: 0.0,
        command_lag_ms: 0.0,
        persistence_lag_ms: 0.0,
        indexer_lag_ms: 0.0,
        status_code: 0.0,
    }
}

fn clamp(value: f64, min: f64, max: f64) -> f64 {
    if value < min {
        min
    } else if value > max {
        max
    } else {
        value
    }
}

fn enqueue(current: f64, incoming: f64, capacity: f64) -> (f64, f64) {
    let next = current + incoming;
    if next > capacity {
        (capacity, next - capacity)
    } else {
        (next, 0.0)
    }
}

fn drain(current: f64, capacity: f64) -> (f64, f64) {
    let drained = current.min(capacity);
    (current - drained, drained)
}

#[no_mangle]
pub extern "C" fn sim_reset() {
    unsafe {
        CONFIG = DEFAULT_CONFIG;
        STATE = empty_state();
    }
}

#[no_mangle]
pub extern "C" fn sim_configure(
    request_rate: f64,
    gateway_cpu: f64,
    sequencer_cpu: f64,
    command_cpu: f64,
    persistence_cpu: f64,
    indexer_cpu: f64,
    command_machines: f64,
    persistence_machines: f64,
    indexer_machines: f64,
    queue_capacity: f64,
    transient_failure_rate: f64,
    poison_failure_rate: f64,
    retry_cost: f64,
    jitter: f64,
) {
    unsafe {
        CONFIG = Config {
            request_rate: clamp(request_rate, 0.0, 1000.0),
            gateway_cpu: clamp(gateway_cpu, 0.1, 3.0),
            sequencer_cpu: clamp(sequencer_cpu, 0.1, 3.0),
            command_cpu: clamp(command_cpu, 0.1, 3.0),
            persistence_cpu: clamp(persistence_cpu, 0.1, 3.0),
            indexer_cpu: clamp(indexer_cpu, 0.1, 3.0),
            command_machines: clamp(command_machines.round(), 1.0, 8.0),
            persistence_machines: clamp(persistence_machines.round(), 1.0, 8.0),
            indexer_machines: clamp(indexer_machines.round(), 1.0, 8.0),
            queue_capacity: clamp(queue_capacity, 50.0, 5000.0),
            transient_failure_rate: clamp(transient_failure_rate, 0.0, 0.5),
            poison_failure_rate: clamp(poison_failure_rate, 0.0, 0.35),
            retry_cost: clamp(retry_cost, 1.0, 5.0),
            jitter: clamp(jitter, 0.0, 1.0),
        };
    }
}

#[no_mangle]
pub extern "C" fn sim_process_dlq(max_events: f64) -> f64 {
    unsafe {
        let replay_count = STATE.dlq_queue.min(clamp(max_events, 1.0, 500.0));
        STATE.dlq_queue -= replay_count;
        let (next_command_queue, overflow) =
            enqueue(STATE.command_queue, replay_count, CONFIG.queue_capacity);
        STATE.command_queue = next_command_queue;
        STATE.dropped += overflow;
        STATE.dlq_replayed += replay_count;
        replay_count
    }
}

#[no_mangle]
pub extern "C" fn sim_tick(dt_ms: f64) {
    unsafe {
        let dt = clamp(dt_ms / 1000.0, 0.016, 1.0);
        let c = CONFIG;
        STATE.tick += 1;

        let wave = ((STATE.tick % 17) as f64 - 8.0) / 8.0;
        let jitter_factor = 1.0 + c.jitter * wave * 0.22;

        let gateway_capacity = 180.0 * c.gateway_cpu * dt;
        let sequencer_capacity = 210.0 * c.sequencer_cpu * dt;
        let incoming = c.request_rate * dt;
        let accepted = incoming.min(gateway_capacity).min(sequencer_capacity);
        let rejected = (incoming - accepted).max(0.0);

        let (command_queue, command_overflow) =
            enqueue(STATE.command_queue, accepted, c.queue_capacity);
        STATE.command_queue = command_queue;

        let command_capacity = 52.0 * c.command_cpu * c.command_machines * jitter_factor * dt;
        let retry_capacity_penalty =
            1.0 + (STATE.retry_queue / (c.queue_capacity * 0.5)).min(1.0) * c.retry_cost;
        let (command_after, command_processed) =
            drain(STATE.command_queue, command_capacity / retry_capacity_penalty);
        STATE.command_queue = command_after;

        let poison_failed = command_processed * c.poison_failure_rate;
        let transient_failed = command_processed * c.transient_failure_rate;
        let succeeded = (command_processed - poison_failed - transient_failed).max(0.0);

        let (retry_queue, retry_overflow) = enqueue(
            STATE.retry_queue,
            transient_failed * c.retry_cost,
            c.queue_capacity * 0.5,
        );
        STATE.retry_queue = retry_queue;

        let (dlq_queue, dlq_overflow) =
            enqueue(STATE.dlq_queue, poison_failed, c.queue_capacity * 0.5);
        STATE.dlq_queue = dlq_queue;

        let retry_release = STATE
            .retry_queue
            .min(command_capacity * 0.2 * (1.0 - c.jitter * 0.35));
        STATE.retry_queue -= retry_release;
        let (command_queue_after_retry, retry_drop) =
            enqueue(STATE.command_queue, retry_release, c.queue_capacity);
        STATE.command_queue = command_queue_after_retry;

        let (persistence_queue, persistence_overflow) =
            enqueue(STATE.persistence_queue, succeeded, c.queue_capacity);
        STATE.persistence_queue = persistence_queue;

        let (indexer_queue, indexer_overflow) =
            enqueue(STATE.indexer_queue, succeeded, c.queue_capacity);
        STATE.indexer_queue = indexer_queue;

        let persistence_capacity =
            44.0 * c.persistence_cpu * c.persistence_machines * jitter_factor * dt;
        let (persistence_after, persisted) = drain(STATE.persistence_queue, persistence_capacity);
        STATE.persistence_queue = persistence_after;

        let indexer_capacity = 36.0 * c.indexer_cpu * c.indexer_machines * jitter_factor * dt;
        let (indexer_after, indexed) = drain(STATE.indexer_queue, indexer_capacity);
        STATE.indexer_queue = indexer_after;

        let total_queued = STATE.command_queue
            + STATE.persistence_queue
            + STATE.indexer_queue
            + STATE.retry_queue
            + STATE.dlq_queue;
        let total_capacity = c.queue_capacity * 4.0;
        STATE.memory_pressure = clamp(total_queued / total_capacity, 0.0, 1.0);
        STATE.command_lag_ms = (STATE.command_queue / (command_capacity.max(1.0) / dt)) * 1000.0;
        STATE.persistence_lag_ms =
            (STATE.persistence_queue / (persistence_capacity.max(1.0) / dt)) * 1000.0;
        STATE.indexer_lag_ms = (STATE.indexer_queue / (indexer_capacity.max(1.0) / dt)) * 1000.0;

        STATE.accepted += accepted;
        STATE.rejected += rejected;
        STATE.dropped += command_overflow
            + retry_overflow
            + retry_drop
            + dlq_overflow
            + persistence_overflow
            + indexer_overflow;
        STATE.completed += persisted;
        STATE.indexed += indexed;
        STATE.transient_failed += transient_failed;
        STATE.poison_failed += poison_failed;

        STATE.status_code = if STATE.dropped > 0.0 && STATE.memory_pressure > 0.9 {
            5.0
        } else if STATE.dlq_queue > c.queue_capacity * 0.2 {
            4.0
        } else if STATE.retry_queue > c.queue_capacity * 0.35 {
            3.0
        } else if STATE.indexer_lag_ms > 5000.0 || STATE.persistence_lag_ms > 5000.0 {
            2.0
        } else if STATE.memory_pressure > 0.55 {
            1.0
        } else {
            0.0
        };
    }
}

#[no_mangle]
pub extern "C" fn sim_command_queue() -> f64 {
    unsafe { STATE.command_queue }
}

#[no_mangle]
pub extern "C" fn sim_persistence_queue() -> f64 {
    unsafe { STATE.persistence_queue }
}

#[no_mangle]
pub extern "C" fn sim_indexer_queue() -> f64 {
    unsafe { STATE.indexer_queue }
}

#[no_mangle]
pub extern "C" fn sim_retry_queue() -> f64 {
    unsafe { STATE.retry_queue }
}

#[no_mangle]
pub extern "C" fn sim_dlq_queue() -> f64 {
    unsafe { STATE.dlq_queue }
}

#[no_mangle]
pub extern "C" fn sim_memory_pressure() -> f64 {
    unsafe { STATE.memory_pressure }
}

#[no_mangle]
pub extern "C" fn sim_command_lag_ms() -> f64 {
    unsafe { STATE.command_lag_ms }
}

#[no_mangle]
pub extern "C" fn sim_persistence_lag_ms() -> f64 {
    unsafe { STATE.persistence_lag_ms }
}

#[no_mangle]
pub extern "C" fn sim_indexer_lag_ms() -> f64 {
    unsafe { STATE.indexer_lag_ms }
}

#[no_mangle]
pub extern "C" fn sim_accepted_total() -> f64 {
    unsafe { STATE.accepted }
}

#[no_mangle]
pub extern "C" fn sim_rejected_total() -> f64 {
    unsafe { STATE.rejected }
}

#[no_mangle]
pub extern "C" fn sim_dropped_total() -> f64 {
    unsafe { STATE.dropped }
}

#[no_mangle]
pub extern "C" fn sim_completed_total() -> f64 {
    unsafe { STATE.completed }
}

#[no_mangle]
pub extern "C" fn sim_indexed_total() -> f64 {
    unsafe { STATE.indexed }
}

#[no_mangle]
pub extern "C" fn sim_transient_failed_total() -> f64 {
    unsafe { STATE.transient_failed }
}

#[no_mangle]
pub extern "C" fn sim_poison_failed_total() -> f64 {
    unsafe { STATE.poison_failed }
}

#[no_mangle]
pub extern "C" fn sim_dlq_replayed_total() -> f64 {
    unsafe { STATE.dlq_replayed }
}

#[no_mangle]
pub extern "C" fn sim_status_code() -> f64 {
    unsafe { STATE.status_code }
}
