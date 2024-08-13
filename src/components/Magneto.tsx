import React, { HtmlHTMLAttributes, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./Magneto.module.scss";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import debounce from "lodash/debounce";

const cx = classNames.bind(styles);

function Magneto(props: HtmlHTMLAttributes<HTMLDivElement>) {
  const magnetoRef = useRef(null);
  const { height, width } = props;

  useGSAP(
    () => {
      // const magneto = document.querySelector(`.${cx("magneto")}`);
      const magneto = magnetoRef.current;
      const magnetoChild = magneto?.querySelector(`.${cx("child")}`);

      //set height width
      if (width) {
        console.log("setting width");
        gsap.set(magneto, { width: width });
      }
      if (height) gsap.set(magneto, { height: height });

      // On mouse move
      const activateMagneto = (event) => {
        const boundBox = magneto?.getBoundingClientRect();

        const strength = Math.min(magneto.offsetWidth, magneto.offsetHeight);

        if (!boundBox || !magneto || !magnetoChild) return;

        const magnetoStrength = 0.25 * strength;
        const magnetoChildStrength = 0.45 * strength;

        const newX = (
          (event.clientX - boundBox.left) / magneto.offsetWidth -
          0.5
        ).toFixed(2);
        const newY = (
          (event.clientY - boundBox.top) / magneto.offsetHeight -
          0.5
        ).toFixed(2);

        gsap.killTweensOf(magneto);
        gsap.killTweensOf(magnetoChild);

        gsap.to(magneto, {
          duration: 0.5,
          x: Number(newX) * magnetoStrength,
          y: Number(newY) * magnetoStrength,
          ease: "power4.easeOut",
        });
        gsap.to(magnetoChild, {
          duration: 0.5,
          x: Number(newX) * magnetoChildStrength,
          y: Number(newY) * magnetoChildStrength,
          ease: "power4.easeOut",
        });
      };

      // On mouse leave

      const resetMagneto = (event) => {
        console.log("resetint");
        gsap.to(magneto, {
          duration: 1,
          x: 0,
          y: 0,
          ease: "Elastic.easeOut",
        });
        gsap.to(magnetoChild, {
          duration: 1,
          x: 0,
          y: 0,
          ease: "Elastic.easeOut",
        });
      };

      // Add event listeners

      magneto.addEventListener("mousemove", activateMagneto);
      magneto.addEventListener("mouseleave", resetMagneto);

      (magneto as any)._activateMagneto = activateMagneto;
      (magneto as any)._resetMagneto = resetMagneto;

      // Clean up event listeners
      return () => {
        if (magneto) {
          magneto.removeEventListener(
            "mouseenter",
            (magneto as any)._activateMagneto
          );
          magneto.removeEventListener(
            "mouseleave",
            (magneto as any)._resetMagneto
          );
        }

        gsap.killTweensOf(magneto, magnetoChild);
      };
    },
    { dependencies: [] }
  );

  return (
    <div className={cx("magneto")} ref={magnetoRef}>
      <div className={cx("child")}>{props.children}</div>
    </div>
  );
}

export default Magneto;
