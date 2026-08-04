import { Routes, Route, Link } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import JobFeed from "@/pages/candidate/JobFeed";
import JobDetails from "@/pages/candidate/JobDetails";
import RecruiterDashboard from "@/pages/recruiter/RecruiterDashboard";
import PostJob from "@/pages/recruiter/PostJob";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { useAuth } from "@/context/AuthContext";
import EditJob from "./pages/recruiter/EditJob";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-slate-500 font-medium">
            Loading application...
          </p>
        </div>
      </div>
    );
  }

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
          <Route path="/recruiter/jobs/:id/edit" element={<EditJob />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
