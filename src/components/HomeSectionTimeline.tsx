import React from "react";
import classNames from "classnames/bind";
import styles from "./HomeSectionTimeline.module.scss";
import Timeline from "./Timeline";

const cx = classNames.bind(styles);

function HomeSectionTimeline() {
  return (
    <section className={cx("section-timeline")}>
      <header>
        <h2 className={cx("h2")}>Timeline</h2>
      </header>
      <main>
        <Timeline />
      </main>

      <footer></footer>
    </section>
  );
}

export default HomeSectionTimeline;
