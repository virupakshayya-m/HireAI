import { Routes, Route, Link } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import JobFeed from "@/pages/candidate/JobFeed";
import JobDetails from "@/pages/candidate/JobDetails";
import RecruiterDashboard from "@/pages/recruiter/RecruiterDashboard";
import PostJob from "@/pages/recruiter/PostJob";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function App() {
  return (
    <>
      <nav className="space-x-4 bg-black text-white">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/jobs" element={<JobFeed />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
          <Route path="/recruiter/jobs/new" element={<PostJob />} />
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
