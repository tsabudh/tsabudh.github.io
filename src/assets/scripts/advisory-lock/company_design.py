"""Test the per-company transaction lock. Synthetic data; creates and drops two tables, cd_source and cd_target.
Rebuild = delete the company's rows, 'compute' for a while, insert them again, all in one transaction."""
import os, threading, time
import psycopg2

DSN = os.environ.get("DSN", "postgresql+psycopg2://user:pass@localhost:5432/postgres").replace("+psycopg2", "")
ROWS = 250  # rows per company

def conn(iso="READ COMMITTED", autocommit=False):
    c = psycopg2.connect(DSN); c.set_session(isolation_level=iso, autocommit=autocommit); return c

adm = conn(autocommit=True).cursor()

def reset(companies=("A", "B")):
    adm.execute("drop table if exists cd_source, cd_target")
    adm.execute("create table cd_source (company text, n int, value bigint)")
    adm.execute("create table cd_target (company text, n int, value bigint)")
    for co in companies:
        adm.execute("insert into cd_source select %s, g, g * 100 from generate_series(1, %s) g", (co, ROWS))
    adm.execute("insert into cd_target select * from cd_source")

def rows(co):
    adm.execute("select count(*) from cd_target where company = %s", (co,)); return adm.fetchone()[0]

def rebuild(co, iso, lock, out, name, work_s=1.0, pids=None):
    c = conn(iso); cur = c.cursor()
    try:
        if pids is not None:
            cur.execute("select pg_backend_pid()"); pids.append(cur.fetchone()[0])
        t0 = time.monotonic()
        if lock:   # waits here if another run is rebuilding this company
            cur.execute("select pg_advisory_xact_lock(hashtextextended(%s, 0))", ("rebuild:company:" + co,))
        waited = time.monotonic() - t0
        cur.execute("delete from cd_target where company = %s", (co,)); deleted = cur.rowcount
        cur.execute("select pg_sleep(%s)", (work_s,))
        cur.execute("insert into cd_target select * from cd_source where company = %s", (co,))
        c.commit(); out.append((name, f"committed, waited {waited:.1f}s, deleted {deleted}"))
    except Exception as e:
        out.append((name, type(e).__name__))
    finally:
        try: c.close()
        except Exception: pass

def two_runs(co, iso, lock):
    out = []
    ts = [threading.Thread(target=rebuild, args=(co, iso, lock, out, n)) for n in "12"]
    ts[0].start(); time.sleep(0.3); ts[1].start(); [t.join() for t in ts]
    return sorted(out), rows(co)

print(f"expected rows per company: {ROWS}\n")
for title, iso, lock, new in [
    ("no lock, READ COMMITTED",               "READ COMMITTED",  False, False),
    ("xact lock, READ COMMITTED",             "READ COMMITTED",  True,  False),
    ("xact lock, REPEATABLE READ",            "REPEATABLE READ", True,  False),
    ("no lock, REPEATABLE READ",              "REPEATABLE READ", False, False),
    ("no lock, SERIALIZABLE",                 "SERIALIZABLE",    False, False),
    ("no lock, READ COMMITTED, new company",  "READ COMMITTED",  False, True),
    ("no lock, REPEATABLE READ, new company", "REPEATABLE READ", False, True),
    ("no lock, SERIALIZABLE, new company",    "SERIALIZABLE",    False, True),
    ("xact lock, READ COMMITTED, new company","READ COMMITTED",  True,  True),
]:
    reset()
    if new: adm.execute("delete from cd_target where company = 'A'")   # the company has no rows yet
    res, n = two_runs("A", iso, lock)
    print(f"{title}:\n  run1: {res[0][1]}\n  run2: {res[1][1]}\n  rows afterwards: {n}")

print("\nkill the holder after its delete, before its commit; a second run waits; an observer counts rows every 20 ms")
reset(); out, pids, seen, stop = [], [], set(), threading.Event()
def observer():
    c = conn(autocommit=True).cursor()
    while not stop.is_set():
        c.execute("select count(*) from cd_target where company = 'A'"); seen.add(c.fetchone()[0]); time.sleep(0.02)
obs = threading.Thread(target=observer); obs.start()
holder = threading.Thread(target=rebuild, args=("A", "READ COMMITTED", True, out, "holder", 5, pids)); holder.start(); time.sleep(0.6)
waiter = threading.Thread(target=rebuild, args=("A", "READ COMMITTED", True, out, "waiter", 0.5)); waiter.start(); time.sleep(0.6)
adm.execute("select pg_terminate_backend(%s)", (pids[0],))
holder.join(); waiter.join(); stop.set(); obs.join()
for name, res in sorted(out): print(f"  {name}: {res}")
print(f"  row counts the observer ever saw: {sorted(seen)}; final rows: {rows('A')}")

print("\nthe idle-in-transaction timeout (1 s) ends a run that sits idle 3 s inside its company transaction")
reset(); c = conn(); cur = c.cursor(); cur.execute("set idle_in_transaction_session_timeout = '1s'")
cur.execute("select pg_advisory_xact_lock(hashtextextended('rebuild:company:A', 0))"); cur.execute("delete from cd_target where company = 'A'")
time.sleep(3)   # client-side work between statements, longer than the timeout
try: cur.execute("insert into cd_target select * from cd_source where company = 'A'"); c.commit(); print("  committed")
except Exception as e: print(f"  run fails with {type(e).__name__}; rows afterwards: {rows('A')}")
out = []; rebuild("A", "READ COMMITTED", True, out, "next run", 0.1); print(f"  next run: {out[0][1]}; rows afterwards: {rows('A')}")
adm.execute("drop table cd_source, cd_target")
