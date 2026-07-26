import { Routes, Route, Link } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

function App() {
  return (
    <>
      <nav className="space-x-4 bg-black text-white">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
      </Routes>
    </>
  );
}

export default App;