import React, { useEffect, useRef } from "react";
import classNames from "classnames/bind";
import { works } from "../assets/data/works.json";
import styles from "./HomeSectionWorks.module.scss";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import useCursor from "../hooks/useCursor";
gsap.registerPlugin(ScrollTrigger);
const cx = classNames.bind(styles);

function HomeSectionWorks() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { changeCursorContent } = useCursor();
  useGSAP(
    () => {
      const track = trackRef.current;

      if (!track) return;

      // Initialize the timeline and ScrollTrigger
      const tl1 = gsap.timeline({
        
        paused: true,
      });

      const animateElements = (
        track: HTMLDivElement,
        nextPercentage: number
      ) => {
        // Animate the track element
        gsap.to(track, {
          xPercent: nextPercentage,
          duration: 0,
          ease: "ease",
          overwrite: true,
        });

        // Animate each image element inside the track
        // const images = track.querySelectorAll(".image");
        gsap.to(`.${cx("image")}`, {
          objectPosition: `${100 + Number(nextPercentage)}% center`,
          duration: 0,
          ease: "linear",
          overwrite: true,
        });

        tl1.play();
      };

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
          maxDelta = 1600; // Number of items times two

        const percentage = (mouseDelta / maxDelta) * -100,
          nextPercentageUnconstrained = (
            parseFloat(track.dataset.prevPercentage as string) + percentage
          ).toFixed(2),
          nextPercentage = Math.max(
            Math.min(Number(nextPercentageUnconstrained), 0),
            -100
          ).toFixed(2);

        track.dataset.percentage = nextPercentage;

        animateElements(track, Number(nextPercentage));
      };

      const displayCursor = () => {
        // changeCursorContent(" &#8592;drag&#8594;");
        changeCursorContent("drag");
        gsap.to("#cursor", {
          scale: 1.5,

          // translate: "-50% -50%",
          duration: 0.3,
          // overwrite: true,
          ease: "power2.easeOut",
        });
      };

      const hideCursor = () => {
        changeCursorContent("");
        gsap.to("#cursor", {
          scale: 0,
          duration: 0.3,
          ease: "power2.easeOut",
        });
      };
      // Add event listeners for dragging functionality
      track.addEventListener("mousedown", (e) => handleOnDown(e));
      track.addEventListener("touchstart", (e) => handleOnDown(e.touches[0]));
      track.addEventListener("mouseup", handleOnUp);
      track.addEventListener("touchend", handleOnUp);
      track.addEventListener("mousemove", (e) => handleOnMove(e));
      track.addEventListener("touchmove", (e) => handleOnMove(e.touches[0]));
      track.addEventListener("mouseenter", () => displayCursor());
      track.addEventListener("mouseleave", () => hideCursor());

      // Cleanup event listeners on component unmount
      return () => {
        track.removeEventListener("mousedown", (e) => handleOnDown(e));
        track.removeEventListener("touchstart", (e) =>
          handleOnDown(e.touches[0])
        );
        track.removeEventListener("mouseup", handleOnUp);
        track.removeEventListener("touchend", handleOnUp);
        track.removeEventListener("mousemove", (e) => handleOnMove(e));
        track.removeEventListener("touchmove", (e) =>
          handleOnMove(e.touches[0])
        );
      };
    },
    { dependencies: [] }
  );

  return (
    <section className={cx("section-works")}>
      <div className={cx("track-container")}>
        <div
          id={cx("image-track")}
          ref={trackRef}
          data-mouse-down-at="0"
          data-prev-percentage="0"
        >
          {works.map((work, index) => {
            return (
              <TrackItem
                src={work.src}
                key={work.name + index}
                title={work.name}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HomeSectionWorks;

const TrackItem = ({ src, title }: { src: string; title: string }) => {
  return (
    <div className={cx("track-item")}>
      <h2 className={cx("title")}>{title}</h2>
      <img className={cx("image")} src={src} draggable="false" />
    </div>
  );
};
