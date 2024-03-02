import "./App.scss";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/homepage/page.tsx";
import Dashboard from "./pages/dashboard/page.tsx";
import Friends from "./pages/friends/page.tsx";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" index element={<Home></Home>}></Route>
        <Route path="/dashboard" element={<Dashboard></Dashboard>} />
        <Route path="/friends" element={<Friends></Friends>} />
      </Routes>
    </div>
  );
}

export default App;
