import React, { FC } from "react";

import Navbar from "../components/Navbar.tsx";
import HomeSectionWorks from "../components/HomeSectionWorks.tsx";
import HomeSectionHero from "../components/HomeSectionHero.tsx";

const HomePage: FC = function HomePage() {
  return (
    <React.Fragment>
      <HomeSectionHero />
      <HomeSectionWorks />
    </React.Fragment>
  );
};

export default HomePage;
