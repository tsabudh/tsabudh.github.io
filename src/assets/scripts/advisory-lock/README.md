# Scripts for "Your Postgres Lock Has a Hidden Expiry Date"

Each script reproduces a result from the post on your own Postgres. The `expected/` folder holds the output I got
from each one, so you can compare.

**Use a throwaway database.** The scripts open many sessions and end some on purpose with `pg_terminate_backend`,
and two of them create and drop tables.

## Run it

1. Start a throwaway Postgres (`max_connections` of at least 200 is needed by `timing_sim.py`):

   ```
   docker run --rm -d --name lockdemo -e POSTGRES_PASSWORD=pw -p 55433:5432 postgres:18 -c max_connections=200   # was 18.6 when tested
   ```

2. Install the dependencies:

   ```
   python -m venv .venv && . .venv/bin/activate && pip install "sqlalchemy==2.0.51" psycopg2-binary
   ```

3. Point the scripts at it:

   ```
   export DSN="postgresql+psycopg2://postgres:pw@localhost:55433/postgres"
   ```

4. Run a script and compare it with its saved output, for example:

   ```
   python reproduce_cases.py | diff - expected/reproduce_cases.txt && echo identical
   ```

5. Clean up: `docker stop lockdemo`.

Tested with Python 3.13, SQLAlchemy 2.0.51 and psycopg2 2.9.13 on Postgres 18.6.

## The scripts

| Script | What it shows | Runtime | Writes data? | Saved output |
| --- | --- | --- | --- | --- |
| `reproduce_cases.py` | Cases A to E: a session advisory lock on a default connection, on AUTOCOMMIT, with a commit after acquiring, with a commit then one more query, and on AUTOCOMMIT under `idle_session_timeout` (PostgreSQL 14+). | about 30 s | No. Advisory locks only. | `expected/reproduce_cases.txt`, identical every run |
| `timing_sim.py` | When a second run gets a lock held by a long run: 10-second timeout, 5-second cron grid or random events, 20 trials each. | about 30 s | No. Advisory locks only. | `expected/timing_sim.txt`. Default: 20 of 20 overlap, none before 10 s. AUTOCOMMIT: 0 of 20. |
| `calibrate.py` | The detector check: kills a holder's session at 2.00 s and times when a second session gets the lock. | about 11 s | No. Advisory locks only. | `expected/calibrate.txt` |
| `company_design.py` | The lock inside the transaction: 500 rows against 250, the isolation levels, the kill test, the idle-timeout test. | about 25 s | Creates and drops `cd_source` and `cd_target`. | `expected/company_design.txt`, apart from the waits |
| `company_perf.py` | The cost of one commit per company on 6,000 synthetic companies, and SERIALIZABLE with retry against the lock. | about 1 minute | Creates and drops `pf_source` and `pf_target` (about 1.3 million rows). | `expected/company_perf.txt`. Seconds move, the shape does not. |

If your database already has tables with those names, change the names first. The scripts drop them.
Timings move a little from run to run and between machines. The shape does not.
