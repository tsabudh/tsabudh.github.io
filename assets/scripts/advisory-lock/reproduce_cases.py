"""Session advisory lock vs idle_in_transaction_session_timeout (cases A to D) and idle_session_timeout (case E).
Takes locks only, writes no data. Case E needs PostgreSQL 14 or later."""
import os, time
from sqlalchemy import create_engine, text

DSN = os.environ.get("DSN", "postgresql+psycopg2://user:pass@localhost:5432/postgres")
TIMEOUT = "3s"

def state(eng, pid):
    with eng.connect() as m:
        return m.execute(text("select state from pg_stat_activity where pid = :p"), {"p": pid}).scalar()

def other_gets_lock(eng, key):
    with eng.connect() as c:
        got = c.execute(text("select pg_try_advisory_lock(hashtextextended(:k, 0))"), {"k": key}).scalar()
        if got:
            c.execute(text("select pg_advisory_unlock(hashtextextended(:k, 0))"), {"k": key})
        return got

def case(name, key, autocommit=False, commit=False, extra_query=False, idle_session=False):
    holder_eng = create_engine(DSN)
    other_eng = create_engine(DSN, isolation_level="AUTOCOMMIT")
    conn = holder_eng.connect()
    if autocommit:
        conn = conn.execution_options(isolation_level="AUTOCOMMIT")
    conn.execute(text(f"set idle_in_transaction_session_timeout = '{TIMEOUT}'"))
    if idle_session:
        conn.execute(text(f"set idle_session_timeout = '{TIMEOUT}'"))
    got = conn.execute(text("select pg_try_advisory_lock(hashtextextended(:k, 0))"), {"k": key}).scalar()
    pid = conn.execute(text("select pg_backend_pid()")).scalar()
    if commit:
        conn.commit()
    if extra_query:
        conn.execute(text("select 1"))  # e.g. a later "is my lock still held?" check
    print(f"{name}\n  acquired: {got}, holder state: {state(other_eng, pid)}")
    time.sleep(1); print(f"  t=1s other process gets lock: {other_gets_lock(other_eng, key)}")
    time.sleep(4); print(f"  t=5s other process gets lock: {other_gets_lock(other_eng, key)}")
    try:
        conn.execute(text("select pg_advisory_unlock(hashtextextended(:k, 0))"), {"k": key})
        print("  holder: alive")
    except Exception as e:
        print(f"  holder's next query fails: {type(e).__name__}")
    conn.invalidate()  # end the session; close() would only return it to the pool
    holder_eng.dispose(); other_eng.dispose()

case("A. default (autobegin)", "repro:a")
case("B. AUTOCOMMIT", "repro:b", autocommit=True)
case("C. commit right after acquire", "repro:c", commit=True)
case("D. commit, then one more query", "repro:d", commit=True, extra_query=True)
case("E. AUTOCOMMIT, with idle_session_timeout", "repro:e", autocommit=True, idle_session=True)
