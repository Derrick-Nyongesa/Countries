import "./App.css";
import Home from "./comopents/Home";
import Country from "./comopents/Country";
import Region from "./comopents/Region";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/country/:name" element={<Country />} />
        <Route path="/region/:region" element={<Region />} />
      </Routes>
    </Router>
  );
}

export default App;
