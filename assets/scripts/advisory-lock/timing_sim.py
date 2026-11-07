"""When does a second run get a lock that a long run holds? Takes advisory locks only, writes no data.

One production minute is scaled to one second: the holder's idle_in_transaction_session_timeout is 10 s.
A long run takes the lock and then sits idle on its connection, as a run does while its work happens elsewhere.
A short run tries for the same lock either on a 5-second cron grid (random phase) or on random events about once
a second. 20 trials per trigger and holder kind, all run in parallel. Set DSN to a throwaway Postgres:
the script opens about 160 connections, so max_connections must be at least 200."""
import os, random, threading, time
from sqlalchemy import create_engine, text

DSN = os.environ.get("DSN", "postgresql+psycopg2://user:pass@localhost:5432/postgres")
TIMEOUT_S, TRIALS, WINDOW_S, CRON_S, EVENT_MEAN_S = 10, 20, 30, 5.0, 1.0
results = {}  # (trigger, holder) -> list of seconds until the second run got the lock, or None

def trial(trigger, holder_kind, n):
    key = f"timing:{trigger}:{holder_kind}:{n}"
    holder_eng = create_engine(DSN)
    poll_eng = create_engine(DSN, isolation_level="AUTOCOMMIT")
    conn = holder_eng.connect()
    if holder_kind == "autocommit":
        conn = conn.execution_options(isolation_level="AUTOCOMMIT")
    conn.execute(text(f"set idle_in_transaction_session_timeout = '{TIMEOUT_S}s'"))
    conn.execute(text("select pg_try_advisory_lock(hashtextextended(:k, 0))"), {"k": key})
    t0 = time.monotonic()  # the long run now holds the lock and goes idle
    got_at = None
    with poll_eng.connect() as c:
        t = random.uniform(0, CRON_S) if trigger == "cron" else random.expovariate(1 / EVENT_MEAN_S)
        while t < WINDOW_S:
            time.sleep(max(0.0, t0 + t - time.monotonic()))
            if c.execute(text("select pg_try_advisory_lock(hashtextextended(:k, 0))"), {"k": key}).scalar():
                got_at = time.monotonic() - t0
                break
            t += CRON_S if trigger == "cron" else random.expovariate(1 / EVENT_MEAN_S)
    results[(trigger, holder_kind)].append(got_at)
    conn.invalidate(); holder_eng.dispose(); poll_eng.dispose()  # end the sessions; close() would only pool them

threads = []
for trigger in ("cron", "event"):
    for holder_kind in ("default", "autocommit"):
        results[(trigger, holder_kind)] = []
        threads += [threading.Thread(target=trial, args=(trigger, holder_kind, n)) for n in range(TRIALS)]
for th in threads: th.start()
for th in threads: th.join()

for (trigger, holder_kind), runs in results.items():
    hit = sorted(x for x in runs if x is not None)
    label = f"{trigger}/{holder_kind}:".ljust(19)
    if hit:
        near = sum(1 for x in hit if x - TIMEOUT_S < 1.0)
        print(f"{label}{len(hit)}/{TRIALS} trials overlapped; min {hit[0]:.2f}s, max {hit[-1]:.2f}s; {near} within 1s of the timeout")
    else:
        print(f"{label}{len(hit)}/{TRIALS} trials overlapped")
