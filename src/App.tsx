import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Observer } from "gsap/Observer";

import "./App.scss";

import HomePage from "./pages/HomePage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import { Routes, Route } from "react-router-dom";
import DevApp from "./dev/DevApp";
import Pages from "./pages/Pages.tsx";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(Observer);

function App() {
  return (
    <Routes>
      <Route path="/dev/*" element={<DevApp />}></Route>
      <Route path="/" element={<Pages />}>
        <Route path="" index element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/works" element={<HomePage />} />
        <Route path="/highlights" element={<HomePage />} />
        <Route path="/timeline" element={<HomePage />} />
        <Route path="/social" element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default App;
