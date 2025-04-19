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
              I'm a Software Engineer with experience in architecting web applications and distributed systems, based in <strong>Kathmandu, Nepal</strong>.            </p>
            <p>
              I work remotely as a software engineer.
            </p>
            <div className={cx("links")}>
              <p>You can email me on: <a href="mailto:tsabudh@gmail.om"><strong>tsabudh@gmail.com</strong></a></p>
              <p>You can also reach out on:</p>
              <div className={cx("social-links")}>
                <a
                  href="https://www.linkedin.com/in/tsabudh/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/linkedin.svg"
                    alt="LinkedIn"
                    height={"20px"}
                    width={"20px"}
                  />
                </a>
              </div>
            </div>
            <div className="">
              <p>You can also <a href="https://drive.google.com/drive/folders/1zcsdqVT6uzs8NA7oFs3Z_OHkE048Ka9Z?usp=drive_link" target="_blank"> <u>view my cv.</u></a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeSectionAbout;
