import classNames from "classnames/bind";

import styles from "./HomeSectionContact.module.scss";
import ContactForm from "./ContactForm";

const cx = classNames.bind(styles);

function HomeSectionContact() {
  return (
    <section className={cx("section-contact")}>
      <h2 className={cx("h2")}>Reach out.</h2>

      <div className="flex">
        <ContactForm />
      </div>
    </section>
  );
}

export default HomeSectionContact;
