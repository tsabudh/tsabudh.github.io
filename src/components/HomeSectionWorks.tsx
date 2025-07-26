import classNames from "classnames/bind";
import { works } from "../assets/data/works.json";
import styles from "./HomeSectionWorks.module.scss";
import Card1 from "./Card1";
import { useEffect, useRef } from "react";
const cx = classNames.bind(styles);

function HomeSectionWorks() {
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const rectContaier = containerRef.current?.getBoundingClientRect();
      wrapperRefs.current.forEach((el, index) => {
        if (!(rectContaier && el)) return;

        const rectEl = el.getBoundingClientRect();

        if (
          rectContaier.top < 0 &&
          rectEl.top <= 10 &&
          Math.abs(rectEl.top) - rectEl.height * (index + 1) <= 0
        ) {
          // Normalize to 0–1 range
          const ratio = Math.min(
            (Math.abs(rectContaier.top) - index * rectEl.height) /
              rectEl.height,
            1
          );

          // Compute opacity (fades from 1 → 0.2)
          const opacity = 1 - ratio;

          el.style.opacity = `${opacity}`;
        } else {
          el.style.opacity = "1";
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className={cx("section-works")}>
      <header>
        <h2 className={cx("h2")}>Works</h2>
      </header>
      <div className={cx("container")} ref={containerRef}>
        {works.map((work, index) => (
          <div className={cx("work-wrapper")} key={work.name}>
            <div
              className={cx("item-wrapper")}
              ref={(el) => (wrapperRefs.current[index] = el)}
            >
              <div className={cx("card-wrapper")}>
                <Card1 title={work.name} imageSrc={work.src} />
              </div>
              <div className={cx("content")}>
                <section className={cx("description")}>
                  {work.description?.map((paragraph) => (
                    <p>{paragraph}</p>
                  ))}
                </section>

                <section className={cx("links")}>
                  <div className="">
                    {work["page-link"] ? (
                      <a
                        href={work["page-link"]}
                        className={cx("no-bg", "underlined","hidden")}
                        target="_blank"

                      >
                        Learn more
                      </a>
                    ) : null}
                  </div>
                  <div className="">
                    <a
                      className={cx("no-bg")}
                      href={work["live-link"]}
                      target="_blank"
                    >
                      Live link
                    </a>
                  </div>
                  <div className="">
                    <a
                      className={cx("no-bg")}
                      href={work["github-repo-link"]}
                      target="_blank"
                    >
                      Github Repo
                    </a>
                  </div>
                </section>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HomeSectionWorks;
