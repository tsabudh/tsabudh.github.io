import classNames from "classnames/bind";
import styles from "./Card1.module.scss";

const cx = classNames.bind(styles);

interface Card1Props {
  title: string;
  imageSrc: string;
}

function Card1({ title, imageSrc }: Card1Props) {
  return (
    <div className={cx("card-1")}>
      <div className={cx("outer-layer")}>
        <div className={cx("inner-layer")}>
          <div className={cx("content")}>
            <header className={cx("header")}>
              <h2>{title}</h2>
            </header>
            <main className={cx("main")}>
              <figure>
                <img src={imageSrc} alt={title} />
              </figure>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card1;
