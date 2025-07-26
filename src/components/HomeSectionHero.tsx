import { useRef } from "react";
import classNames from "classnames/bind";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import styles from "./HomeSectionHero.module.scss";

import LogoNepalFlagOutline from "./Logo/LogoNepalFlagOutline";
import Magneto from "./Magneto";

const cx = classNames.bind(styles);

function HomeSectionHero() {
  const addressContentRef = useRef<HTMLDivElement>(null);

  let anchorFlagToAddress: EventListener;
  let resetFlagToAddress: EventListener;

  useGSAP(
    () => {
      const tl1 = gsap.timeline({ paused: true });

      const addressContent: HTMLDivElement | null = addressContentRef.current;

      const flag = document.querySelector("#logoNepalFlagOutline");

      const paths: NodeListOf<SVGPathElement> = flag?.querySelectorAll(
        "path#moon, path#sun"
      ) as NodeListOf<SVGPathElement>;

      if (paths) {
        paths.forEach((path, index) => {
          const length = Math.ceil(path.getTotalLength());

          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });

          tl1.fromTo(
            path,
            {
              strokeDashoffset: length,
            },
            {
              strokeDashoffset: 0,
              duration: 1.5,
              ease: "power2.inOut",
            },
            index * 0.05
          );
        });
      }

      anchorFlagToAddress = (event) => {
        if (addressContent) {
          const addressBoundBox = addressContent.getBoundingClientRect();
          if (!flag) return;
          const flagBox = flag.getBoundingClientRect();

          const xAddress = addressBoundBox.x;
          const yAddress = addressBoundBox.y;

          const xOffSet = ((event as MouseEvent).clientX - xAddress - flagBox.width) * 0.6;
          const yOffSet = ((event as MouseEvent).clientY - yAddress - flagBox.height) * 0.5;

          gsap.to(flag, {
            x: xOffSet.toFixed(3),
            y: yOffSet.toFixed(3),
            // scale: 1,
            opacity: 0.8,
            duration: 1,
          });

          tl1.play();
        }
      };

      resetFlagToAddress = () => {
        gsap.to(flag, {
          x: 0,
          y: 0,
          duration: 0.5,
          // scale: 0.5,
          opacity: 0,
          ease: "Power2.easeOut",
          overwrite: true,
        });

        tl1.progress(0);
      };

      if (addressContent) {
        addressContent.addEventListener("mousemove", anchorFlagToAddress);
        addressContent.addEventListener("mouseleave", resetFlagToAddress);
      }

      return () => {
        addressContent?.removeEventListener("mousemove", anchorFlagToAddress);
        addressContent?.removeEventListener("mouseleave", resetFlagToAddress);
      };
    },
    { dependencies: [] }
  );
  return (
    <section className={cx("section-hero")}>
      <div className={cx("image-background")}></div>
      <div className={cx("content")}>
        <div className={cx("address")}>
          <div className={cx("address-content")} ref={addressContentRef}>
            <div className={cx("address-detail")}>
              <Magneto>
                <div className={cx("paragraph")}>
                  <div className={cx("designation")}>
                    <p>
                      <span>Software engineer</span>
                    </p>
                  </div>
                  <div className={cx("kathmandu")}>
                    <span> @&nbsp;Kathmandu,&ensp;</span>
                    <span>Nepal</span>
                  </div>
                </div>
              </Magneto>
              <LogoNepalFlagOutline className={cx("flag")} />
            </div>
          </div>
        </div>
        <div className={cx("name")}>
          <h1>SABUDH BAHADUR THAPA</h1>
        </div>
      </div>
    </section>
  );
}

export default HomeSectionHero;
