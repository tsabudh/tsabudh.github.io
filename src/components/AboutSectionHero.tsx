import React, { useRef } from "react";
import classNames from "classnames/bind";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLocation } from "react-router-dom";

import styles from "./AboutSectionHero.module.scss";

import LogoDesigner from "./Logo/LogoDesigner.tsx";
import LogoDeveloper from "./Logo/LogoDeveloper.tsx";
import LogoEngineer from "./Logo/LogoEngineer.tsx";
import Button from "./Button.tsx";

const cx = classNames.bind(styles);

function AboutSectionHero() {
  const location = useLocation();

  const logosRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const logoDesigner: NodeListOf<SVGPathElement> =
        document.querySelectorAll(`#logoDesigner path`);
      const logoDeveloper: NodeListOf<SVGPathElement> =
        document.querySelectorAll(`#logoDeveloper path`);
      const logoEngineer: NodeListOf<SVGPathElement> =
        document.querySelectorAll(`#logoEngineer path`);
      const logoArtisan: NodeListOf<SVGPathElement> =
        document.querySelectorAll(`#logoArtisan path`);

      // Combine all paths into a single array
      const allPaths = [
        ...logoDesigner,
        ...logoDeveloper,
        ...logoEngineer,
        ...logoArtisan,
      ];

      // Create the timeline
      const tl1 = gsap.timeline({ paused: true });

      const logosEl = logosRef.current;

      tl1.fromTo(
        logosEl,
        {
          x: -20,
          yPercent: -50,
        },
        {
          x: 10,
          yPercent: -50,
          duration: 2,
        }
      );

      // Add animations to the timeline
      allPaths.forEach((path, index) => {
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
            duration: 2,
            ease: "power2.inOut",
          },
          index * 0.05
        );
      });

      tl1.play();
    },
    { dependencies: [location.pathname] }
  );

  return (
    <section className={cx("container")}>
      <div className={cx("row")}>
        <div className={cx("content-column")}>
          <div className={cx("greetings")}>
            <h2 className={cx("tagline")}>
              Solving
              <span className={cx("tech")}>&ensp;Business&ensp;</span>challenges
              with
              <span className={cx("business")}>&ensp;Technology</span>
            </h2>

            <p className={cx("description")}>
              Hi, I am &ensp;
              <span className={cx("name")}>
                <span className={cx("sabudh")}>Sabudh&ensp;</span>
                <span className={cx("bahadur")}>Bahadur&ensp;</span>
                <span className={cx("thapa")}>Thapa.&ensp;</span>
              </span>
              <br />I specialize in providing innovative tech solutions to
              tackle complex business problems. Let's work together to turn your
              challenges into opportunities with the power of technology.
            </p>
          </div>
          <Button className="primary rounded">Let's talk.</Button>
        </div>
        <div className={cx("image-column")}>
          <div className={cx("image-frame")}>
            <div className={cx("dot")}></div>

            <figure>
              <img src="/images/sabudh_front.jpg" alt="" />
            </figure>
            <div className={cx("logos")} ref={logosRef}>
              <LogoDesigner />
              <LogoDeveloper />
              <LogoEngineer />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSectionHero;
