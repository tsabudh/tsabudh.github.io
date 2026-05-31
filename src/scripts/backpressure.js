import { newInstance } from "@jsplumb/browser-ui";

const wasmUrl = new URL("../assets/wasm/backpressure_sim.wasm", import.meta.url);

const controlDefs = [
  ["requestRate", "Request rate", 0, 600, 120, 10, "/s"],
  ["gatewayCpu", "Gateway CPU", 0.2, 3, 1, 0.1, "x"],
  ["sequencerCpu", "Sequencer CPU", 0.2, 3, 1, 0.1, "x"],
  ["commandCpu", "Command CPU", 0.2, 3, 1, 0.1, "x"],
  ["persistenceCpu", "Persistence CPU", 0.2, 3, 1, 0.1, "x"],
  ["indexerCpu", "Indexer CPU", 0.2, 3, 1, 0.1, "x"],
  ["commandMachines", "Command machines", 1, 8, 2, 1, "x"],
  ["persistenceMachines", "Persistence machines", 1, 8, 2, 1, "x"],
  ["indexerMachines", "Indexer machines", 1, 8, 2, 1, "x"],
  ["queueCapacity", "Kafka queue capacity", 50, 5000, 900, 50, ""],
  ["transientFailureRate", "Fail once", 0, 0.5, 0.04, 0.01, ""],
  ["poisonFailureRate", "Fail forever", 0, 0.35, 0.01, 0.01, ""],
  ["retryCost", "Retry cost", 1, 5, 1.4, 0.1, "x"],
  ["jitter", "Jitter", 0, 1, 0.2, 0.05, ""],
];

const values = Object.fromEntries(controlDefs.map(([key, , , , value]) => [key, value]));
let wasm;
let animationFrame;
let lastFrame = performance.now();
let burstUntil = 0;
let resizeListenerAttached = false;
let connectorInstance;
const connections = new Map();
const connectionDefs = [
  ["ingress", "clients", "gateway", ["Right", "Left"]],
  ["sequence", "gateway", "sequencer", ["Right", "Left"]],
  ["request", "gateway", "appointment", ["Bottom", "Top"]],
  ["command", "appointment", "command", ["Right", "Left"]],
  ["commandKafka", "command", "command-kafka", ["Bottom", "Top"]],
  ["queryKafka", "command-kafka", "query-kafka", ["Left", "Right"]],
  ["persistence", "command-kafka", "persistence", ["Right", "Left"]],
  ["postgres", "persistence", "postgres", ["Right", "Left"]],
  ["indexer", "query-kafka", "indexer", ["Bottom", "Top"]],
  ["dlq", "command-kafka", "dlq", ["Bottom", "Top"]],
];

function number(value, digits = 0) {
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
  });
}

function valueLabel(value, unit) {
  if (unit === "" && value <= 1) {
    return `${Math.round(value * 100)}%`;
  }

  return `${number(value, value % 1 === 0 ? 0 : 1)}${unit}`;
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  }
}

function ratioColor(value) {
  if (value > 0.85) return "rgb(220, 38, 38)";
  if (value > 0.55) return "rgb(245, 158, 11)";
  return "rgb(34, 197, 94)";
}

function pressureLevel(value) {
  if (value > 0.85) return "hot";
  if (value > 0.55) return "warm";
  return "normal";
}

function setNodePressure(node, value) {
  const element = document.querySelector(`[data-node="${node}"]`);
  if (!element) return;
  const bounded = Math.min(value, 1);
  element.dataset.pressure = pressureLevel(bounded);
  element.style.setProperty("--fill", `${Math.round(bounded * 100)}%`);
  element.style.setProperty("--queue-color", ratioColor(bounded));
}

function setConnection(id, pressure, flow = 1) {
  const connection = connections.get(id);
  if (!connection) return;
  const bounded = Math.min(Math.max(pressure, 0), 1);
  const color = ratioColor(bounded);
  const enabled = flow > 0.1;
  const opacity = enabled ? 0.55 + bounded * 0.32 : 0.16;
  const width = enabled ? 2 + Math.min(flow / 140, 2) : 1.5;

  connection.setPaintStyle({
    stroke: color,
    strokeWidth: width,
    outlineStroke: "rgba(248, 250, 252, 0.92)",
    outlineWidth: 3,
    opacity,
  });
}

function mountConnections() {
  const graph = document.querySelector(".bp-graph");
  if (!graph) return;

  if (connectorInstance) {
    connectorInstance.destroy();
    connections.clear();
  }

  connectorInstance = newInstance({
    container: graph,
    endpoint: "Blank",
    connector: {
      type: "Flowchart",
      options: {
        cornerRadius: 4,
        gap: 12,
        stub: 18,
      },
    },
    connectionsDetachable: false,
  });

  for (const element of graph.querySelectorAll("[data-node]")) {
    connectorInstance.manage(element);
  }

  for (const [id, from, to, anchors, curved] of connectionDefs) {
    const source = graph.querySelector(`[data-node="${from}"]`);
    const target = graph.querySelector(`[data-node="${to}"]`);
    if (!source || !target) continue;

    const connection = connectorInstance.connect({
      source,
      target,
      anchors,
      detachable: false,
      endpoint: "Blank",
      connector: curved
        ? { type: "Bezier", options: { curviness: 45 } }
        : { type: "Flowchart", options: { cornerRadius: 4, gap: 12, stub: 18 } },
      paintStyle: {
        stroke: "rgb(203, 213, 225)",
        strokeWidth: 2,
        outlineStroke: "rgba(248, 250, 252, 0.9)",
        outlineWidth: 3,
      },
      overlays: [
        {
          type: "Arrow",
          options: {
            location: 1,
            width: 8,
            length: 8,
            foldback: 0.72,
          },
        },
      ],
    });

    connections.set(id, connection);
  }

  connectorInstance.repaintEverything();
}

function configureWasm(effectiveRequestRate = values.requestRate) {
  wasm.sim_configure(
    effectiveRequestRate,
    values.gatewayCpu,
    values.sequencerCpu,
    values.commandCpu,
    values.persistenceCpu,
    values.indexerCpu,
    values.commandMachines,
    values.persistenceMachines,
    values.indexerMachines,
    values.queueCapacity,
    values.transientFailureRate,
    values.poisonFailureRate,
    values.retryCost,
    values.jitter
  );
}

function statusText(code) {
  switch (Math.round(code)) {
    case 1:
      return "Kafka is absorbing the burst";
    case 2:
      return "Read model is falling behind";
    case 3:
      return "Retry pressure is eating capacity";
    case 4:
      return "Poison events are parked in DLQ";
    case 5:
      return "Backpressure failed; work is dropping";
    default:
      return "System is stable";
  }
}

function explanation(code, metrics) {
  switch (Math.round(code)) {
    case 1:
      return `Ingress is above steady-state capacity, but bounded queues are still absorbing the burst. Command lag is ${number(metrics.commandLagMs)}ms.`;
    case 2:
      return `Consumers cannot keep up with event propagation. Persistence lag is ${number(metrics.persistenceLagMs)}ms and index freshness lag is ${number(metrics.indexerLagMs)}ms.`;
    case 3:
      return `Transient failures are retrying and competing with fresh work. Retry queue depth is ${number(metrics.retryQueue)}.`;
    case 4:
      return `Poison events are failing forever and have been isolated in DLQ. DLQ depth is ${number(metrics.dlqQueue)}; replay only helps after the poison cause is fixed.`;
    case 5:
      return `Queue capacity is exhausted. The simulator has dropped ${number(metrics.dropped)} events after bounded buffers filled.`;
    default:
      return "Producer rate, queue capacity, and consumer throughput are balanced. Events flow from request to command write and query index without unbounded lag.";
  }
}

function readMetrics() {
  return {
    commandQueue: wasm.sim_command_queue(),
    persistenceQueue: wasm.sim_persistence_queue(),
    indexerQueue: wasm.sim_indexer_queue(),
    retryQueue: wasm.sim_retry_queue(),
    dlqQueue: wasm.sim_dlq_queue(),
    memory: wasm.sim_memory_pressure(),
    commandLagMs: wasm.sim_command_lag_ms(),
    persistenceLagMs: wasm.sim_persistence_lag_ms(),
    indexerLagMs: wasm.sim_indexer_lag_ms(),
    accepted: wasm.sim_accepted_total(),
    rejected: wasm.sim_rejected_total(),
    dropped: wasm.sim_dropped_total(),
    completed: wasm.sim_completed_total(),
    indexed: wasm.sim_indexed_total(),
    transientFailed: wasm.sim_transient_failed_total(),
    poisonFailed: wasm.sim_poison_failed_total(),
    dlqReplayed: wasm.sim_dlq_replayed_total(),
    status: wasm.sim_status_code(),
  };
}

function render(effectiveRequestRate = values.requestRate) {
  connectorInstance?.repaintEverything();
  const metrics = readMetrics();
  const capacity = values.queueCapacity;
  const gatewayPressure = effectiveRequestRate / (180 * values.gatewayCpu);
  const sequencerPressure = effectiveRequestRate / (210 * values.sequencerCpu);
  const commandPressure = metrics.commandQueue / capacity;
  const persistencePressure = metrics.persistenceQueue / capacity;
  const indexerPressure = metrics.indexerQueue / capacity;
  const dlqPressure = metrics.dlqQueue / (capacity * 0.5);

  setText("bp-ingress-rate", `${number(effectiveRequestRate)}/s`);
  setText("bp-gateway-pressure", `${Math.round(Math.min(gatewayPressure, 1.5) * 100)}%`);
  setText("bp-sequencer-rate", `${number(Math.min(effectiveRequestRate, 210 * values.sequencerCpu))}/s`);
  setText("bp-command-machines", `${values.commandMachines}x`);
  setText("bp-command-queue", number(metrics.commandQueue));
  setText("bp-indexer-queue", number(metrics.indexerQueue));
  setText("bp-dlq-queue", number(metrics.dlqQueue));
  setText("bp-persistence-lag", `${number(metrics.persistenceLagMs)}ms`);
  setText("bp-indexer-lag", `${number(metrics.indexerLagMs)}ms`);
  setText("bp-completed", number(metrics.completed));
  setText("bp-accepted", number(metrics.accepted));
  setText("bp-rejected", number(metrics.rejected));
  setText("bp-dropped", number(metrics.dropped));
  setText("bp-retry-queue", number(metrics.retryQueue));
  setText("bp-dlq-replayed", number(metrics.dlqReplayed));
  setText("bp-memory", `${Math.round(metrics.memory * 100)}%`);
  setText("bp-indexed", number(metrics.indexed));
  setText("bp-transient-failed", number(metrics.transientFailed));
  setText("bp-poison-failed", number(metrics.poisonFailed));
  setText("bp-status", statusText(metrics.status));
  setText("bp-explanation", explanation(metrics.status, metrics));

  setNodePressure("gateway", gatewayPressure);
  setNodePressure("sequencer", sequencerPressure);
  setNodePressure("command", commandPressure);
  setNodePressure("command-kafka", commandPressure);
  setNodePressure("query-kafka", indexerPressure);
  setNodePressure("persistence", persistencePressure);
  setNodePressure("indexer", indexerPressure);
  setNodePressure("dlq", dlqPressure);
  setNodePressure("postgres", metrics.persistenceLagMs / 5000);

  setConnection("ingress", gatewayPressure, effectiveRequestRate / 4);
  setConnection("sequence", sequencerPressure, effectiveRequestRate / 5);
  setConnection("request", commandPressure, effectiveRequestRate / 7);
  setConnection("command", commandPressure, Math.max(20, effectiveRequestRate / 8));
  setConnection("commandKafka", commandPressure, Math.max(20, metrics.commandQueue / 10));
  setConnection("persistence", persistencePressure, Math.max(20, metrics.persistenceQueue / 10));
  setConnection("queryKafka", indexerPressure, Math.max(20, metrics.indexerQueue / 10));
  setConnection("indexer", indexerPressure, Math.max(20, metrics.indexerQueue / 10));
  setConnection("postgres", metrics.persistenceLagMs / 5000, Math.max(20, metrics.completed / 120));
  setConnection("dlq", dlqPressure, Math.max(20, metrics.dlqQueue / 4));
}

function animate(now) {
  const dt = Math.min(now - lastFrame, 250);
  lastFrame = now;
  const effectiveRequestRate = now < burstUntil ? values.requestRate * 2.4 : values.requestRate;
  configureWasm(effectiveRequestRate);
  wasm.sim_tick(dt);
  render(effectiveRequestRate);
  animationFrame = requestAnimationFrame(animate);
}

function mountControls() {
  const container = document.getElementById("bp-controls");
  if (!container) return;

  container.innerHTML = controlDefs
    .map(
      ([key, label, min, max, value, step, unit]) => `
        <div class="bp-control">
          <label for="bp-${key}">
            <span>${label}</span>
            <output id="bp-${key}-value">${valueLabel(value, unit)}</output>
          </label>
          <input id="bp-${key}" type="range" min="${min}" max="${max}" value="${value}" step="${step}" data-key="${key}" data-unit="${unit}">
        </div>
      `
    )
    .join("");

  container.addEventListener("input", (event) => {
    if (!(event.target instanceof HTMLInputElement)) return;
    const key = event.target.dataset.key;
    const unit = event.target.dataset.unit || "";
    values[key] = Number(event.target.value);
    setText(`bp-${key}-value`, valueLabel(values[key], unit));
  });

  document.getElementById("bp-reset")?.addEventListener("click", () => {
    for (const [key, , , , value] of controlDefs) {
      values[key] = value;
      const input = document.getElementById(`bp-${key}`);
      if (input instanceof HTMLInputElement) {
        input.value = String(value);
        setText(`bp-${key}-value`, valueLabel(value, input.dataset.unit || ""));
      }
    }

    burstUntil = 0;
    wasm.sim_reset();
    configureWasm();
  });

  document.getElementById("bp-process-dlq")?.addEventListener("click", () => {
    wasm.sim_process_dlq(100);
    render();
  });

  document.getElementById("bp-burst")?.addEventListener("click", () => {
    burstUntil = performance.now() + 10000;
  });
}

export async function initBackpressurePlayground() {
  if (!document.getElementById("bp-controls")) return;

  const response = await fetch(wasmUrl);
  const bytes = await response.arrayBuffer();
  const instance = await WebAssembly.instantiate(bytes, {});
  wasm = instance.instance.exports;

  mountControls();
  wasm.sim_reset();
  configureWasm();
  mountConnections();
  if (!resizeListenerAttached) {
    window.addEventListener("resize", () => connectorInstance?.repaintEverything());
    resizeListenerAttached = true;
  }
  lastFrame = performance.now();
  cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(animate);
}
