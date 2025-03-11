import classNames from "classnames/bind";
import { works } from "../assets/data/works.json";
import styles from "./HomeSectionWorks.module.scss";
import Card1 from "./Card1";
const cx = classNames.bind(styles);

function HomeSectionWorks() {
  return (
    <section className={cx("section-works")}>
      <header>
        <h2 className={cx("h2")}>Works</h2>
      </header>
      <div className={cx("container")}>
        {works.map((item, index) => {
          return (
            <div key={item.name + index} className={cx("item-wrapper")}>
              <Card1 title={item.name} imageSrc={item.src} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default HomeSectionWorks;
