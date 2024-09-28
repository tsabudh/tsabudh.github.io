import React, { useEffect } from "react";
import styles from "./Cursor.module.scss";
import classNames from "classnames/bind";
import gsap from "gsap";
const cx = classNames.bind(styles);

function Cursor() {
  useEffect(() => {
    gsap.set("#cursor", {
      scale: 0    });

    window.addEventListener("mousemove", (e) => {
      gsap.to("#cursor", {
        x: e.clientX,
        y: e.clientY,
        translate: "-50% -50%",
        duration: 0,
        // overwrite: true,
        ease: "power2.inOut",
      });
    });
  }, []);
 

  return <div className={cx("cursor")} id="cursor"></div>;
}

export default Cursor;
