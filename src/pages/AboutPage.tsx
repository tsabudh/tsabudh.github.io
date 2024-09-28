import React, { FC } from "react";

import Navbar from "../components/Navbar.tsx";
import AboutSectionHero from "../components/AboutSectionHero.tsx";

const AboutPage: FC = function AboutPage() {
  return (
    <React.Fragment>
      <AboutSectionHero />
    </React.Fragment>
  );
};

export default AboutPage;
