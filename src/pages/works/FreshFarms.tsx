import classNames from "classnames/bind";
import styles from "./FreshFarms.module.scss";
const cx = classNames.bind(styles);
import { works } from "../../assets/data/works.json";

function FreshFarms() {
  console.log("cx(section):", cx("section"));
  const work = works[0];
  return (
    <>
      <header className={cx("header")}>
        <a href="../">Go back</a>
      </header>
      <main className={cx("main")}>
        <section className={cx("section")}>
          <h1>Freshfarms</h1>
          <h3>Fresh milk at your doorsteps.</h3>
        </section>

        <section className={cx("section", "section--why")}>
          <h2>The 'Why?'</h2>
          <p>
            Traditional dairies often rely on paper ledgers to log daily milk
            deliveries and manage payments — a method that becomes messy and
            error-prone as the customer base grows. FreshFarms was built to
            simplify this process, giving staff an easy way to log daily
            activity and giving customers transparent access to their history
            and dues.
          </p>
          <div className={cx("screenshot-container")}>
            <figure className={cx("figure")}>
              <img
                src="/images/admin_transactions_view.png"
                alt="Admin's view of transactions"
              />
              <figcaption>Admin's view of transactions</figcaption>
            </figure>
            <figure className={cx("figure")}>
              <img
                src="/images/customer_transactions_view.png"
                alt="Customer's view of transactions"
              />
              <figcaption>Customer's view of transactions</figcaption>
            </figure>
          </div>
        </section>

        <section className={cx("section")}>
          <h2>For 'Whom?'</h2>
          <p>
            FreshFarms is designed for local dairy businesses that manage
            recurring deliveries and maintain ongoing balances for customers.
            Whether you're serving 10 or 100+ families, the platform helps you
            keep everything recorded, accurate, and transparent for all parties.
          </p>
        </section>

        <section className={cx("section", "section--role")}>
          <h2>My Role</h2>
          <p>
            I was responsible for the full-stack development of FreshFarms —
            from designing the database schema and developing the frontend in
            React, to implementing backend services and authentication. I also
            collaborated with users (dairy owners and staff) to iterate on
            features that matched their real-world needs.
          </p>
        </section>

        <section className={cx("section")}>
          <h2>Tools</h2>
          <p>
            The project was built using React (with SCSS Modules for styling),
            localStorage for persistence (initial MVP), and JSON as a mock
            backend. It also used classnames and modular architecture for easier
            maintainability. Future plans include migrating to a real-time
            backend using Firebase or Supabase.
          </p>
        </section>

        <section className={cx("section", "section--features")}>
          <h2>Features</h2>
          <p>
            • Daily log of milk deliveries
            <br />
            • Automatic calculation of balances
            <br />
            • Customer-facing transaction view
            <br />
            • Admin panel for adding entries
            <br />
            • Export options (PDF for reports)
            <br />• Mobile-friendly UI for both admin and users
          </p>
        </section>

        <section className={cx("section")}>
          <h2>Architecture</h2>
          <p>
            The architecture follows a modular component structure on the
            frontend. For the MVP, it uses mock JSON data to simulate API
            behavior, but is designed to be backend-ready. The goal was to
            decouple views from data logic and prepare for easy migration to
            cloud-based storage and authentication.
          </p>
        </section>

        <section className={cx("section", "section--demo")}>
          <h2>Demo</h2>
          <p>
            Watch how a dairy staff logs today's deliveries, checks pending
            payments, and how a customer views their balance in seconds. The
            demo highlights how FreshFarms reduces manual effort while improving
            transparency between dairies and their customers.
          </p>
        </section>

        <section className={cx("section")}>
          <h2>Challenges</h2>
          <p>
            The biggest challenge was balancing simplicity with functionality.
            Staff using the app had minimal tech experience, so every
            interaction needed to be intuitive. Also, adapting the logic to
            accommodate customer-specific delivery schedules and variable
            pricing took multiple design iterations.
          </p>
        </section>

        <section className={cx("section", "section--links", "links")}>
          <div className={cx("live-link")}>
            <div className="">
              <a
                className={cx("no-bg")}
                href={work["live-link"]}
                target="_blank"
              >
                Live link
              </a>
            </div>
          </div>
          <div className={cx("wrapper")}>
            <div className="">
              <a
                className={cx("no-bg")}
                href={work["github-repo-link"]}
                target="_blank"
              >
                Github Repo
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default FreshFarms;
