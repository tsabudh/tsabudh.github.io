import classNames from "classnames/bind";

import styles from "./HomeSectionAbout.module.scss";

const cx = classNames.bind(styles);

function HomeSectionAbout() {
  return (
    <section className={cx("section-about")}>
      <h2 className={cx("h2")}>About me</h2>
      <div className={cx("content")}>
        <div className={cx("text")}>
          <p className={cx("nepali")}>सबुध बहादुर थापा</p>
          <div className={cx("description")}>
            <p>
              Hi! I am <span>Sabudh Bahadur Thapa.</span>
              I’m a Software Engineer specializing in building scalable web
              applications and architecting distributed systems. Based in
              <strong> Kathmandu, Nepal</strong>, I have hands-on experience in
              designing end-to-end solutions with a focus on performance,
              security, and maintainability.
            </p>

            <p>
              I work remotely as a software engineer, contributing to
              cross-functional teams by developing backend services, RESTful
              APIs, and cloud-native solutions, as well as optimizing modern
              frontend applications for seamless user experiences.
            </p>

            <p>
              My technical expertise includes working with technologies like
              <strong>
                &nbsp;JavaScript (ES6+), TypeScript, React, Node.js, and Express
              </strong>
              &nbsp; on the frontend and backend. I also have professional
              experience in
              <strong>
                &nbsp; microservices architecture, message-driven systems
                (Kafka), containerization (Docker, Kubernetes), and cloud
                platforms (AWS, Vercel)
              </strong>
              .
            </p>

            <p>
              I am proficient in designing relational and non-relational
              database schemas (MySQL, PostgreSQL, MongoDB) and implementing
              caching and performance optimization strategies to support
              high-throughput applications.
            </p>

            <p>
              Beyond coding, I have a strong understanding of{" "}
              <strong>
                CI/CD pipelines, DevOps practices, and distributed system
                patterns
              </strong>
              . I enjoy solving complex problems, mentoring junior developers,
              and contributing to long-term technical strategies.
            </p>
            <div className={cx("links")}>
              <p>
                You can email me on:{" "}
                <a href="mailto:tsabudh@gmail.om">
                  <strong>tsabudh@gmail.com</strong>
                </a>
              </p>
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
                    height={"20"}
                    width={"20"}
                  />
                </a>
              </div>
            </div>
            <div className="">
              <p>
                You can also{" "}
                <a
                  href="https://drive.google.com/drive/folders/1zcsdqVT6uzs8NA7oFs3Z_OHkE048Ka9Z?usp=drive_link"
                  target="_blank"
                >
                  {" "}
                  <u>view my cv.</u>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeSectionAbout;
