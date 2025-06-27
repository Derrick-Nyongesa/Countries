import "./App.css";
import Home from "./components/Home";
import Country from "./components/Country";
import Region from "./components/Region";
import SubRegion from "./components/SubRegion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/country/:name" element={<Country />} />
        <Route path="/region/:region" element={<Region />} />
        <Route path="/subregion/:subregion" element={<SubRegion />} />
      </Routes>
    </Router>
  );
}

export default App;
