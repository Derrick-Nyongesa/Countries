import "./App.css";
import Home from "./comopents/Home";
import Country from "./comopents/Country";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/country/:name" element={<Country />} />
      </Routes>
    </Router>
  );
}

export default App;
