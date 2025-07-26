import React,{ FC } from "react";

import HomeSectionWorks from "../components/HomeSectionWorks.tsx";
import HomeSectionHero from "../components/HomeSectionHero.tsx";
import HomeSectionAbout from "../components/HomeSectionAbout.tsx";
import HomeSectionTimeline from "../components/HomeSectionTimeline.tsx";
import HomeSectionContact from "../components/HomeSectionContact.tsx";

const HomePage: FC = function HomePage() {
  return (
    <React.Fragment>
      <HomeSectionHero />
      <HomeSectionAbout />
      <HomeSectionWorks />
      <HomeSectionTimeline />
      <HomeSectionContact />
    </React.Fragment>
  );
};

export default HomePage;
