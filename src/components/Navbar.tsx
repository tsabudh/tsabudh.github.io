import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import gsap from "gsap";
import debounce from "lodash/debounce";

import styles from "./Navbar.module.scss";

const cx = classNames.bind(styles);

const Navbar: React.FC = function Navbar() {
  const navbarRef = useRef<HTMLDivElement>(null);
  const highlighterRef = useRef<HTMLDivElement>(null);
  const homeNavRef = useRef<HTMLAnchorElement>(null);
  const aboutNavRef = useRef<HTMLAnchorElement>(null);
  const worksNavRef = useRef<HTMLAnchorElement>(null);
  const socialNavRef = useRef<HTMLAnchorElement>(null);
  const highlightsNavRef = useRef<HTMLAnchorElement>(null);
  const timelineNavRef = useRef<HTMLAnchorElement>(null);

  const location = useLocation();
  const locationRef = useRef(location);

  // Update the ref whenever location changes
  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  const animateHighlighter = () => {
    const currentPathname = locationRef.current.pathname;
    const highlighter = highlighterRef.current;
    const tl1 = gsap.timeline();

    if (highlighter) {
      let boundingRect: DOMRect | undefined;

      switch (currentPathname) {
        case "/":
          boundingRect = homeNavRef.current?.getBoundingClientRect();
          break;
        case "/about":
          boundingRect = aboutNavRef.current?.getBoundingClientRect();
          break;
        case "/works":
          boundingRect = worksNavRef.current?.getBoundingClientRect();
          break;
        case "/social":
          boundingRect = socialNavRef.current?.getBoundingClientRect();
          break;
        case "/highlights":
          boundingRect = highlightsNavRef.current?.getBoundingClientRect();
          break;
        case "/timeline":
          boundingRect = timelineNavRef.current?.getBoundingClientRect();
          break;
        default:
          break;
      }

      if (boundingRect) {
        tl1.to(
          highlighter,
          {
            duration: 0.5,
            top: `${boundingRect.top}px`,
            left: `${boundingRect.left}px`,
            width: `${boundingRect.width}px`,
            height: `${boundingRect.height}px`,
            ease: "power2.inOut",
          },
          "tweet-3"
        );
      }
    }
  };

  useEffect(() => {
    animateHighlighter();
  }, [location]);

  useEffect(() => {
    gsap.to(`.${cx("nav-link")}.${cx("inactive")}`, {
      color: "gray",
      duration: 0,
    });

    const activeLink = document.querySelector(
      `.${cx("nav-link")}.${cx("active")}`
    );

    const navLinks = document.querySelectorAll(
      `.${cx("nav-link")}.${cx("inactive")}`
    );

    const onHover = {
      color: "#2e90fa",
      duration: 0.3,
      ease: "power2.out",
    };

    const onLeave = {
      color: "gray",
      duration: 0.3,
      ease: "power2.out",
    };

    const handleMouseEnter = (link: Element) => () => {
      gsap.to(link, onHover);
    };

    const handleMouseLeave = (link: Element) => () => {
      gsap.to(link, onLeave);
    };

    gsap.to(activeLink, {
      color: "black",
      duration: 0.5,
    });
    // Add event listeners

    gsap.utils.toArray(navLinks).forEach((navLinkGeneral) => {
      const link = navLinkGeneral as HTMLAnchorElement;
      const enterHandler = handleMouseEnter(link);
      const leaveHandler = handleMouseLeave(link);

      link.addEventListener("mouseenter", enterHandler);
      link.addEventListener("mouseleave", leaveHandler);

      // Attach handlers to the element so they can be removed later
      (link as any)._enterHandler = enterHandler;
      (link as any)._leaveHandler = leaveHandler;
    });

    // Clean up event listeners
    return () => {
      gsap.utils.toArray(navLinks).forEach((navLinkGeneral) => {
        const link = navLinkGeneral as HTMLAnchorElement;
        link.removeEventListener("mouseenter", (link as any)._enterHandler);
        link.removeEventListener("mouseleave", (link as any)._leaveHandler);
      });
    };
  }, [location.pathname]);

  const debouncedAnimateHighlighter = debounce(animateHighlighter, 300);

  useEffect(() => {
    window.addEventListener("resize", debouncedAnimateHighlighter);

    return () => {
      window.removeEventListener("resize", debouncedAnimateHighlighter);
    };
  }, []);

  return (
    <section className={cx("navbar")} ref={navbarRef}>
      <nav>
        <ul className={cx("nav-menu")}>
          <div className={cx("highlighter")} ref={highlighterRef}></div>
          <li>
            <NavLink
              to="/"
              className={({ isActive, isPending }) =>
                cx([
                  "nav-link",
                  isActive ? "active" : "inactive",
                  isPending ? "pending" : "",
                ])
              }
              ref={homeNavRef}
            >
              home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive, isPending }) =>
                cx([
                  "nav-link",
                  isActive ? "active" : "inactive",
                  isPending ? "pending" : "",
                ])
              }
              ref={aboutNavRef}
            >
              about
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/works"
              className={({ isActive, isPending }) =>
                cx(
                  "nav-link",
                  isActive ? "active" : "inactive",
                  isPending ? "pending" : ""
                )
              }
              ref={worksNavRef}
            >
              works
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/social"
              className={({ isActive, isPending }) =>
                cx(
                  "nav-link",
                  isActive ? "active" : "inactive",
                  isPending ? "pending" : ""
                )
              }
              ref={socialNavRef}
            >
              social
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/highlights"
              className={({ isActive, isPending }) =>
                cx(
                  "nav-link",
                  isActive ? "active" : "inactive",
                  isPending ? "pending" : ""
                )
              }
              ref={highlightsNavRef}
            >
              highlights
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/timeline"
              className={({ isActive, isPending }) =>
                cx(
                  "nav-link",
                  isActive ? "active" : "inactive",
                  isPending ? "pending" : ""
                )
              }
              ref={timelineNavRef}
            >
              timeline
            </NavLink>
          </li>
        </ul>
      </nav>
    </section>
  );
};

export default Navbar;
