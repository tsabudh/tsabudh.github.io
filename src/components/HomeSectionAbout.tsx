import React from "react";

import classNames from "classnames/bind";

import styles from "./HomeSectionAbout.module.scss";

const cx = classNames.bind(styles);

function HomeSectionAbout() {
  return (
    <section className={cx("section-about")}>
      <div className={cx("content")}>
        <div className={cx("image")}>
          <figure>
            <img
              src="/images/sabudh_front.jpg"
              alt="About Sabudh Bahadur Thapa"
            />
          </figure>
        </div>
        <div className={cx("text")}>
          <p className={cx("nepali")}>सबुध बहादुर थापा</p>
          <div className={cx("description")}>
            <p>
              Hi! I am <span>Sabudh Bahadur Thapa. </span>
              I'm a software engineer with experience in web and machine
              learning technologies. I am based in Kathmandu, Nepal.
            </p>
            <p>
              I work remotely as a freelance engineer and solution architect.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeSectionAbout;
