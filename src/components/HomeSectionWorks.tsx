import React, { useEffect, useRef } from "react";
import classNames from "classnames/bind";

import styles from "./HomeSectionWorks.module.scss";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
const cx = classNames.bind(styles);

function HomeSectionWorks() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get the SVG element
    const svgElement: SVGElement = document
      .getElementById(cx("cursor"))
      ?.cloneNode(true) as SVGElement;

    svgElement?.setAttribute("fill", "#ffffff");
    svgElement?.setAttribute("opacity", "0.8");

    console.log(svgElement?.getAttribute("fill"));

    console.log(svgElement);
    // Serialize the SVG to a string
    const svgString = new XMLSerializer().serializeToString(svgElement);

    // Encode the SVG string as a data URL
    const encodedSvg = encodeURIComponent(svgString);
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;

    // Apply the cursor
    const trackContainer: HTMLElement = document.querySelector(
      `.${cx("track-container")}`
    ) as HTMLElement;

    trackContainer.style.cursor = `url('${dataUrl}'), auto`;
  }, []);

  useGSAP(
    () => {
      const track = trackRef.current;
      const tl1 = gsap.timeline({ paused: true });
      

      const animateElements = (
        track: HTMLDivElement,
        nextPercentage: number
      ) => {
        console.log(nextPercentage);
        // Animate the track element

        gsap.to(track, {
          transform: `translate(${nextPercentage}%, -50%)`,
          duration: 0, // Duration in seconds (1200ms)
          ease: "ease", // Optional: Add easing for smoother animation
          onComplete: () => {
            // Optional: Callback after animation completes
            console.log("Track animation complete");
          },
          overwrite: true,
        });

        // Animate each image element inside the track
        const images = track.getElementsByClassName(cx("image"));
        gsap.to(images, {
          objectPosition: `${100 + Number(nextPercentage)}% center`,
          duration: 0, // Duration in seconds (1200ms)
          ease: "linear", // Optional: Add easing for smoother animation
          onComplete: () => {
            // Optional: Callback after animation completes
            console.log("Image animation complete");
          },
          overwrite: true,
        });

        tl1.play();
      };

      if (!track) return;

      const handleOnDown = (e: MouseEvent | Touch) =>
        (track.dataset.mouseDownAt = String(e.clientX));

      const handleOnUp = () => {
        track.dataset.mouseDownAt = "0";
        track.dataset.prevPercentage = track.dataset.percentage;
      };

      const handleOnMove = (e: MouseEvent | Touch) => {
        if (track.dataset.mouseDownAt === "0") return;

        const mouseDelta =
            parseFloat(track.dataset.mouseDownAt as string) - e.clientX,
          maxDelta = window.innerWidth / 2;

        const percentage = (mouseDelta / maxDelta) * -100,
          nextPercentageUnconstrained = (
            parseFloat(track.dataset.prevPercentage as string) + percentage
          ).toFixed(2),
          nextPercentage = Math.max(
            Math.min(Number(nextPercentageUnconstrained), 0),
            -100
          ).toFixed(2);

        console.log(nextPercentage);
        track.dataset.percentage = nextPercentage;

        animateElements(track, Number(nextPercentage));
      };

      track.addEventListener("mousedown", (e) => handleOnDown(e));
      track.addEventListener("touchstart", (e) => handleOnDown(e.touches[0]));
      track.addEventListener("mouseup", handleOnUp);
      track.addEventListener("touchend", handleOnUp);
      track.addEventListener("mousemove", (e) => handleOnMove(e));
      track.addEventListener("touchmove", (e) => handleOnMove(e.touches[0]));
    },
    { dependencies: [] }
  );

  return (
    <section className={cx("section-works")}>
      <svg
        id={cx("cursor")}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="#93c"
        opacity="0.6"
        stroke="none"
      >
        <circle cx="16" cy="16" r="16" strokeWidth={0} />
      </svg>
      <div className={cx("track-container")}>
        <div
          id={cx("image-track")}
          ref={trackRef}
          data-mouse-down-at="0"
          data-prev-percentage="0"
        >
          <img
            className={cx("image")}
            src="https://images.unsplash.com/photo-1524781289445-ddf8f5695861?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            draggable="false"
          />
          <img
            className={cx("image")}
            src="https://images.unsplash.com/photo-1610194352361-4c81a6a8967e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80"
            draggable="false"
          />
          <img
            className={cx("image")}
            src="https://images.unsplash.com/photo-1618202133208-2907bebba9e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            draggable="false"
          />
          <img
            className={cx("image")}
            src="https://images.unsplash.com/photo-1495805442109-bf1cf975750b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            draggable="false"
          />
          <img
            className={cx("image")}
            src="https://images.unsplash.com/photo-1548021682-1720ed403a5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            draggable="false"
          />
          <img
            className={cx("image")}
            src="https://images.unsplash.com/photo-1496753480864-3e588e0269b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2134&q=80"
            draggable="false"
          />
          <img
            className={cx("image")}
            src="https://images.unsplash.com/photo-1613346945084-35cccc812dd5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1759&q=80"
            draggable="false"
          />
          <img
            className={cx("image")}
            src="https://images.unsplash.com/photo-1516681100942-77d8e7f9dd97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            draggable="false"
          />
        </div>
      </div>
    </section>
  );
}

export default HomeSectionWorks;
