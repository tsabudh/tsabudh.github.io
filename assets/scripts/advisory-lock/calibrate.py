"""Calibrate the lock-loss detector against a known fault: kill the holder's session
with pg_terminate_backend at a known time and measure when a second session gets the lock.
The holder uses AUTOCOMMIT, so the idle-in-transaction timeout plays no part. Locks only."""
import os, time
from sqlalchemy import create_engine, text

DSN = os.environ.get("DSN", "postgresql+psycopg2://user:pass@localhost:5432/postgres")
KILL_AT_S, POLL_S, RUNS = 2.0, 0.05, 5

for run in range(RUNS):
    key = f"calibrate:{run}"
    holder_eng = create_engine(DSN, isolation_level="AUTOCOMMIT")
    other_eng = create_engine(DSN, isolation_level="AUTOCOMMIT")
    holder = holder_eng.connect()
    holder.execute(text("select pg_try_advisory_lock(hashtextextended(:k, 0))"), {"k": key})
    pid = holder.execute(text("select pg_backend_pid()")).scalar()
    t0, killed, got_at = time.monotonic(), False, None
    with other_eng.connect() as c:
        while time.monotonic() - t0 < 10:
            if not killed and time.monotonic() - t0 >= KILL_AT_S:
                c.execute(text("select pg_terminate_backend(:p)"), {"p": pid}); killed = True
            if c.execute(text("select pg_try_advisory_lock(hashtextextended(:k, 0))"), {"k": key}).scalar():
                c.execute(text("select pg_advisory_unlock(hashtextextended(:k, 0))"), {"k": key})
                got_at = time.monotonic() - t0; break
            time.sleep(POLL_S)
    print(f"run {run}: killed at {KILL_AT_S:.2f}s, second session got the lock at {got_at:.3f}s")
    holder.invalidate(); holder_eng.dispose(); other_eng.dispose()
