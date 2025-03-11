import { Routes, Route } from "react-router-dom";
import ColorScheme from "./ColorScheme";


export default function DevApp() {
  return (
    <Routes>
      <Route path="/color-scheme" element={<ColorScheme />}></Route>;
    </Routes>
  );
}
