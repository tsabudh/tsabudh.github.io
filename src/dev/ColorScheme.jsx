import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";

import styles from "./ColorScheme.module.scss";

const cx = classNames.bind(styles);

export default function ColorScheme() {
  const [theme, setTheme] = useState("auto");

  useEffect(() => {
    const doc = document.firstElementChild;
    doc.setAttribute("color-scheme", theme);
  }, [theme]);

  return (
    <div className={cx("container")}>
      <header>
        <h3>Scheme</h3>
        <form id="theme-switcher">
          <div>
            <input
              type="radio"
              id="auto"
              name="theme"
              value="auto"
              checked={theme === "auto"}
              onChange={() => setTheme("auto")}
            />
            <label htmlFor="auto">Auto</label>
          </div>
          <div>
            <input
              type="radio"
              id="light"
              name="theme"
              value="light"
              checked={theme === "light"}
              onChange={() => setTheme("light")}
            />
            <label htmlFor="light">Light</label>
          </div>
          <div>
            <input
              type="radio"
              id="dark"
              name="theme"
              value="dark"
              checked={theme === "dark"}
              onChange={() => setTheme("dark")}
            />
            <label htmlFor="dark">Dark</label>
          </div>
          <div>
            <input
              type="radio"
              id="dim"
              name="theme"
              value="dim"
              checked={theme === "dim"}
              onChange={() => setTheme("dim")}
            />
            <label htmlFor="dim">Dim</label>
          </div>
        </form>
      </header>

      <main>
        <section>
          <div className={cx("surface-samples")}>
            <div className={cx("surface1", "rad-shadow")}>1</div>
            <div className={cx("surface2", "rad-shadow")}>2</div>
            <div className={cx("surface3", "rad-shadow")}>3</div>
            <div className={cx("surface4", "rad-shadow")}>4</div>
          </div>
        </section>

        <section>
          <div className={cx("text-samples")}>
            <h1 className={cx("text1")}>
              <span className={cx("swatch", "brand", "rad-shadow")}></span>
              Brand
            </h1>
            <h1 className={cx("text1")}>
              <span className={cx("swatch", "text1", "rad-shadow")}></span>
              Text Color 1
            </h1>
            <h1 className={cx("text2")}>
              <span className={cx("swatch", "text2", " rad-shadow")}></span>
              Text Color 2
            </h1>
            <br />
            <p className={cx("text1")}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p className={cx("text2")}>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
