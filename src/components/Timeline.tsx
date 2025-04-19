import classNames from "classnames/bind";

import styles from "./Timeline.module.scss";

const cx = classNames.bind(styles);

const activities = [
  {
    year: 2025,
    month: "April",
    day: 9,
    event: "Software Engineer at 'Wissenschaft-Inc'",
  },
  {
    year: 2024,
    month: "March",
    day: 9,
    event: "Junior Software Engineer at 'Wissenschaft-Inc'",
  },
  {
    year: 2023,
    month: "November",
    day: 9,
    event: "Internship at 'Brandbuilder Nepal' ",
  },
  {
    year: 2022,
    month: "December",
    day: 9,
    event: "Internship at 'Pagevamp Nepal'",
  },
  {
    year: 2022,
    month: "May",
    day: 9,
    event: "Graduated with computer engineer's degree",
  },
  {
    year: 1997,
    month: "November",
    day: 14,
    event: "Born",
  },
];

function Timeline() {
  return (
    <section className={cx("timeline")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <div className={cx("line")}></div>
          {activities.map((activity, index) => {
            return (
              <div key={index + activity.day} className={cx("activity")}>
                <div className={cx("mark")}></div>
                <div key={index + activity.day} className={cx("description")}>
                  <div className={cx("date")}>{activity.year}</div>

                  <p className={cx("event")}>{activity.event}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={cx("footer")}>
        {/* <Button className={"rounded"}>View More</Button> */}
      </div>
    </section>
  );
}

export default Timeline;
