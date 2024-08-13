import React, { useRef } from "react";
import classNames from "classnames/bind";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MdMyLocation } from "react-icons/md";

import styles from "./HomeSectionHero.module.scss";

import LogoNepalFlagOutline from "./Logo/LogoNepalFlagOutline";
import Magneto from "./Magneto";
import IconGraduationCap from "./Icons/IconGraduationCap";

const cx = classNames.bind(styles);

function HomeSectionHero() {
  const addressContentRef = useRef<HTMLDivElement>(null);

  let anchorFlagToAddress: EventListener;
  let resetFlagToAddress: EventListener;

  let designationContentOnHover: EventListener;
  let designationContentOnLeave: EventListener;

  useGSAP(
    () => {
      const tl1 = gsap.timeline({ paused: true });
      const tl2 = gsap.timeline({ paused: true });

      const addressContent: HTMLDivElement | null = addressContentRef.current;
      const designationContent: HTMLDivElement | null = document.querySelector(
        `.${cx("designation-content")}`
      );

      const flag = document.querySelector("#logoNepalFlagOutline");
      const graduationCap = document.querySelector("#iconGraduationCap");

      const paths: NodeListOf<SVGPathElement> = flag?.querySelectorAll(
        "path#moon, path#sun"
      ) as NodeListOf<SVGPathElement>;

      const capPaths: NodeListOf<SVGPathElement> =
        graduationCap?.querySelectorAll("path") as NodeListOf<SVGPathElement>;

      if (capPaths) {
        capPaths.forEach((path, index) => {
          const length = Math.ceil(path.getTotalLength());

          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });

          tl2.to(
            graduationCap,
            {
              rotate: 10,
              duration: 0.8,
              delay: 0.5,
            },
            0
          );

          tl2.fromTo(
            path,
            {
              strokeDashoffset: length,
            },
            {
              strokeDashoffset: 0,
              duration: 1,
              ease: "power2.inOut",
              overwrite: true,
            },
            index * 0.05
          );
        });
      }

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
          const flagBox = flag.getBoundingClientRect();

          const xAddress = addressBoundBox.x;
          const yAddress = addressBoundBox.y;

          const xOffSet = (event.clientX - xAddress - flagBox.width) * 0.6;
          const yOffSet = (event.clientY - yAddress - flagBox.height) * 0.5;

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

      designationContentOnHover = () => {
        tl2.play();
      };
      designationContentOnLeave = () => {
        tl2.reverse();
      };

      if (addressContent) {
        addressContent.addEventListener("mousemove", anchorFlagToAddress);
        addressContent.addEventListener("mouseleave", resetFlagToAddress);
      }
      if (designationContent) {
        designationContent.addEventListener(
          "mouseover",
          designationContentOnHover
        );
        designationContent.addEventListener(
          "mouseleave",
          designationContentOnLeave
        );
      }

      return () => {
        addressContent?.removeEventListener("mousemove", anchorFlagToAddress);
        addressContent?.removeEventListener("mouseleave", resetFlagToAddress);

        designationContent?.removeEventListener(
          "mouseover",
          designationContentOnHover
        );
        designationContent?.removeEventListener(
          "mouseleave",
          designationContentOnLeave
        );
      };
    },
    { dependencies: [] }
  );
  return (
    <section className={cx("section-hero")}>
      <div className={cx("image-background")}></div>
      <div className={cx("content")}>
        <div className={cx("designation")}>
          <div className={cx("designation-content")}>
            <IconGraduationCap />
            <p>
              <span>Software engineer</span>
            </p>
          </div>
        </div>
        <div className={cx("address")}>
          <div className={cx("address-content")} ref={addressContentRef}>
            <div className={cx("address-detail")}>
              <Magneto>
                <div className={cx("paragraph")}>
                  <div className={cx("kathmandu")}>
                    <MdMyLocation /> &nbsp;
                    <span>Kathmandu,&ensp;</span>
                  </div>
                  <span>Nepal</span>
                </div>
              </Magneto>
              <LogoNepalFlagOutline className={cx("flag")} />
            </div>
          </div>
        </div>
        <div className={cx("name")}>
          <p>SABUDH BAHADUR THAPA</p>
        </div>
      </div>
    </section>
  );
}

export default HomeSectionHero;
