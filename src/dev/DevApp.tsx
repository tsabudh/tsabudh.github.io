import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import ColorScheme from "./ColorScheme";

export default function DevApp() {
  console.log("devapp");
  return (
    <Routes>
      <Route path="/color-scheme" element={<ColorScheme />}></Route>;
    </Routes>
  );
}
