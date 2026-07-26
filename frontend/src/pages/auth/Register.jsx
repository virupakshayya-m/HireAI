import { Link } from "react-router-dom";
import { useState } from "react";

import { USER_ROLES } from "@/utils/constants";
import { registerUser } from "@/services/authService";

function Register() {
  const [role, setRole] = useState(USER_ROLES.CANDIDATE);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
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

    setIsLoading(true);

    try {
      const response = await registerUser({ ...formData, role });
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">HireAI</h1>

            <h2 className="mt-2 text-xl font-semibold">Create Account</h2>

            <p className="mt-2 text-sm text-slate-500">
              Join HireAI as a candidate or recruiter
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="input"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email
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
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Role
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("candidate")}
                  className={`cursor-pointer rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    role === "candidate"
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
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
                  className={`cursor-pointer rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    role === "recruiter"
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
                  }`}
                >
                  <h3 className="font-semibold">🏢 Recruiter</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Hiring talented candidates
                  </p>
                </button>
              </div>
            </div>

            {role === "recruiter" && (
              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                  required
                  autoComplete="organization"
                  className="input"
                />
              </div>
            )}

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
                placeholder="Enter your password"
                required
                autoComplete="new-password"
                className="input"
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
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading? "Creating Account...": "Create Account"}
            </button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
