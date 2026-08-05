import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import { USER_ROLES } from "@/utils/constants";
import { registerUser } from "@/services/authService";

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState(USER_ROLES.CANDIDATE);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Strip out confirmPassword since the backend schema is strict
      const dataToSend = { ...formData };
      delete dataToSend.confirmPassword;
      await registerUser({ ...dataToSend, role });
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center w-full min-h-[calc(100vh-13rem)] py-4">
        <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
          
          {/* Left Side: Branding / Marketing */}
        <div className="hidden md:flex md:w-5/12 bg-blue-600 p-12 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 mt-10">
            <h2 className="text-3xl font-bold text-white mb-6">Join the Future of Hiring</h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-8">
              Whether you're looking for your dream job or searching for the perfect candidate, our AI-powered platform makes the connection effortless.
            </p>
            
            <div className="space-y-6 mt-12">
              <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">✓</div>
                <span className="font-medium text-lg">Smart AI Matching</span>
              </div>
              <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">✓</div>
                <span className="font-medium text-lg">Automated Screening</span>
              </div>
              <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">✓</div>
                <span className="font-medium text-lg">Data-driven Insights</span>
              </div>
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-1/2 -right-24 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-14 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
            <p className="text-slate-500">
              Join HireAI today. It takes less than a minute.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                  className="input bg-slate-50"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  className="input bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Role
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("candidate")}
                  className={`cursor-pointer rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    role === "candidate"
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                  }`}
                >
                  <h3 className="font-semibold">👤 Candidate</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Looking for job opportunities
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("recruiter")}
                  className={`cursor-pointer rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    role === "recruiter"
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                  }`}
                >
                  <h3 className="font-semibold">🏢 Recruiter</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Hiring talented candidates
                  </p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  autoComplete="new-password"
                  className="input bg-slate-50"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                  autoComplete="new-password"
                  className="input bg-slate-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 mt-6 text-lg shadow-md shadow-blue-500/20"
            >
              {isLoading? "Creating Account...": "Create Account"}
            </button>

            <div className="mt-8 text-center border-t border-slate-100 pt-6">
              <p className="text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Sign in instead
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default Register;
