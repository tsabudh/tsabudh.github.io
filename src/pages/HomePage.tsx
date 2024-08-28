import React, { FC } from "react";

import HomeSectionWorks from "../components/HomeSectionWorks.tsx";
import HomeSectionHero from "../components/HomeSectionHero.tsx";
import HomeSectionAbout from "../components/HomeSectionAbout.tsx";
import HomeSectionTimeline from "../components/HomeSectionTimeline.tsx";

const HomePage: FC = function HomePage() {
  return (
    <React.Fragment>
      <HomeSectionHero />
      <HomeSectionWorks />
      <HomeSectionAbout />
      <HomeSectionTimeline />
    </React.Fragment>
  );
};

export default HomePage;
