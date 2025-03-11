import classNames from "classnames/bind";

import styles from "./Timeline.module.scss";
import Button from "./Button";

const cx = classNames.bind(styles);

const activities = [
  {
    year: 2024,
    month: "March",
    day: 9,
    event: "Working at 'Wissenschaft-Inc' as a junior software engineer",
  },
  {
    year: 2023,
    month: "November",
    day: 9,
    event: "Worked at 'Brandbuilder Nepal' as an Intern",
  },
  {
    year: 2022,
    month: "December",
    day: 9,
    event: "Worked at 'Pagevamp Nepal' as an Intern",
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
        <Button className={"rounded"}>View More</Button>
      </div>
    </section>
  );
}

export default Timeline;
