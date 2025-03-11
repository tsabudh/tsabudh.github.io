import { HtmlHTMLAttributes, useRef } from "react";

interface MagnetoProps extends HtmlHTMLAttributes<HTMLDivElement> {
  height?: number;
  width?: number;
}
import classNames from "classnames/bind";
import gsap from "gsap";
import styles from "./Magneto.module.scss";
import { useGSAP } from "@gsap/react";

function Magneto(props: MagnetoProps) {
  const cx = classNames.bind(styles);

  const magnetoRef = useRef<HTMLDivElement>(null);
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
      const activateMagneto = (event: MouseEvent): void => {
        const boundBox = magneto?.getBoundingClientRect();

        const strength = magneto
          ? Math.min(magneto.offsetWidth, magneto.offsetHeight)
          : 0;

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
        if (magnetoChild) {
          gsap.to(magnetoChild, {
            duration: 0.5,
            x: Number(newX) * magnetoChildStrength,
            y: Number(newY) * magnetoChildStrength,
            ease: "power4.easeOut",
          });
        }
      };

      // On mouse leave

      const resetMagneto = () => {
        console.log("resetint");
        gsap.to(magneto, {
          duration: 1,
          x: 0,
          y: 0,
          ease: "Elastic.easeOut",
        });
        if (magnetoChild) {
          gsap.to(magnetoChild, {
            duration: 1,
            x: 0,
            y: 0,
            ease: "Elastic.easeOut",
          });
        }
      };

      // Add event listeners

      if (magneto) {
        magneto.addEventListener("mousemove", activateMagneto);
        magneto.addEventListener("mouseleave", resetMagneto);
      }

      (
        magneto as HTMLDivElement & {
          _activateMagneto?: (event: MouseEvent) => void;
        }
      )._activateMagneto = activateMagneto;
      (
        magneto as HTMLDivElement & { _resetMagneto?: () => void }
      )._resetMagneto = resetMagneto;

      // Clean up event listeners
      return () => {
        if (magneto) {
          magneto.removeEventListener(
            "mousemove",
            (
              magneto as HTMLDivElement & {
                _activateMagneto?: (event: MouseEvent) => void;
              }
            )._activateMagneto!
          );
          magneto.removeEventListener(
            "mouseleave",
            (magneto as HTMLDivElement & { _resetMagneto?: () => void })
              ._resetMagneto!
          );
        }

        if (magneto) gsap.killTweensOf(magneto);
        if (magnetoChild) gsap.killTweensOf(magnetoChild);
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
