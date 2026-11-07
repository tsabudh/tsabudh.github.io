"""Cost of the per-company transaction lock at 6,000 companies, SERIALIZABLE false conflicts for adjacent and spread-out
company ids, and SERIALIZABLE+retry vs the lock under contention.
Synthetic data; creates and drops pf_source and pf_target (about 1.3M rows each)."""
import os, threading, time
import psycopg2

DSN = os.environ.get("DSN", "postgresql+psycopg2://user:pass@localhost:5432/postgres").replace("+psycopg2", "")
N, ROWS = 6000, 220
def conn(iso="READ COMMITTED", ac=False):
    c = psycopg2.connect(DSN); c.set_session(isolation_level=iso, autocommit=ac); return c
adm = conn(ac=True).cursor()
adm.execute("drop table if exists pf_source, pf_target")
adm.execute("create table pf_source (company text, n int, value bigint)")
adm.execute("insert into pf_source select 'C' || lpad(c::text, 5, '0'), g, g * 100 from generate_series(1, %s) c, generate_series(1, %s) g", (N, ROWS))
adm.execute("create index on pf_source (company)"); adm.execute("create table pf_target (like pf_source)")
cos = [f"C{c:05d}" for c in range(1, N + 1)]

def reset(index=True):
    adm.execute("drop table if exists pf_target"); adm.execute("create table pf_target (like pf_source)")
    adm.execute("insert into pf_target select * from pf_source")
    if index: adm.execute("create index on pf_target (company)")
    adm.execute("vacuum analyze pf_target")

def rebuild_one(cur, co, lock, work_s=0):
    if lock: cur.execute("select pg_advisory_xact_lock(hashtextextended(%s, 0))", ("rebuild:company:" + co,))
    cur.execute("delete from pf_target where company = %s", (co,))
    if work_s: cur.execute("select pg_sleep(%s)", (work_s,))
    cur.execute("insert into pf_target select * from pf_source where company = %s", (co,))

print(f"A. {N} companies, {N * ROWS:,} rows: delete + insert each company")
def run(name, per_txn, lock, workers=1):
    reset()
    def work(mine):
        c = conn(); cur = c.cursor(); mine = sorted(mine)
        for i in range(0, len(mine), per_txn):
            for co in mine[i:i + per_txn]: rebuild_one(cur, co, lock)
            c.commit()
        c.close()
    t0 = time.monotonic(); ts = [threading.Thread(target=work, args=(cos[w::workers],)) for w in range(workers)]
    [t.start() for t in ts]; [t.join() for t in ts]
    adm.execute("select count(*) from pf_target"); assert adm.fetchone()[0] == N * ROWS
    print(f"   {name:58s} {time.monotonic() - t0:5.1f}s")
run("one transaction for all companies, no lock", N, False)
run("one transaction per company, no lock", 1, False)
run("one transaction per company + xact lock", 1, True)
run("50 companies per transaction + xact locks, sorted", 50, True)
run("one transaction per company + xact lock, 4 workers", 1, True, 4)
run("one transaction per company + xact lock, 8 workers", 1, True, 8)

print("\nB. 8 concurrent SERIALIZABLE rebuilds of 8 DIFFERENT companies, no lock (every failure is a false conflict)")
adjacent = cos[:8]
spread = [cos[i * (N // 8)] for i in range(8)]  # ids spread across the table, so they do not share index pages
for label, index, ids in (("no index, adjacent ids", False, adjacent), ("index, adjacent ids", True, adjacent), ("index, ids spread across the table", True, spread)):
    reset(index); fails = []
    def one(co):
        c = conn("SERIALIZABLE"); cur = c.cursor()
        try: rebuild_one(cur, co, False, 0.3); c.commit()
        except psycopg2.errors.SerializationFailure: fails.append(co)
        c.close()
    ts = [threading.Thread(target=one, args=(co,)) for co in ids]; [t.start() for t in ts]; [t.join() for t in ts]
    print(f"   {label:36} failed: {len(fails)} of 8")

print("\nC. 8 workers each rebuild the same 10 companies (overlapping runs), 0.3 s of work each")
for name, iso, lock in (("SERIALIZABLE + retry, no lock", "SERIALIZABLE", False), ("READ COMMITTED + xact lock", "READ COMMITTED", True)):
    reset(); failed = []
    def worker():
        for co in cos[:10]:
            while True:
                c = conn(iso); cur = c.cursor()
                try: rebuild_one(cur, co, lock, 0.3); c.commit(); c.close(); break
                except psycopg2.errors.SerializationFailure: failed.append(co); c.close()
    t0 = time.monotonic(); ts = [threading.Thread(target=worker) for _ in range(8)]; [t.start() for t in ts]; [t.join() for t in ts]
    adm.execute("select count(*) from pf_target where company <= 'C00010'")
    print(f"   {name:32s} {time.monotonic() - t0:5.1f}s, failed attempts {len(failed):3d}, rows {adm.fetchone()[0]} (expected {10 * ROWS})")
adm.execute("drop table pf_source, pf_target")
