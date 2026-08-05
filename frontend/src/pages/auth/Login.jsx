import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { getOnboardingRedirectPath, isCandidateProfileComplete } from "@/utils/onboarding";
import { loginUser } from "@/services/authService";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

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
      const response = await loginUser(formData);
      setUser(response.user);
      
      const redirectPath = getOnboardingRedirectPath(response.user);

      if (redirectPath) {
        toast.success("Welcome! Let's get you set up.");
        navigate(redirectPath, { replace: true });
      } else {
        toast.success("Welcome back!");
        
        if (response.user.role === "candidate" && !isCandidateProfileComplete(response.user)) {
          toast("Complete your profile and upload your resume before applying for jobs.", {
            icon: "ℹ️",
            duration: 6000,
          });
        }
        
        navigate(response.user.role === "recruiter" ? "/recruiter/dashboard" : "/jobs", { replace: true });
      }
    } catch (error) {
      toast.error(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center w-full min-h-[calc(100vh-13rem)] py-4">
        <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
          
          {/* Left Side: Branding / Marketing */}
        <div className="hidden md:flex md:w-1/2 bg-blue-600 p-12 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6">Unlock Your Career Potential</h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              HireAI uses advanced generative AI to match your unique skills with the perfect opportunities. Sign in to continue your journey.
            </p>
          </div>
          
          <div className="relative z-10 mt-12">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold text-blue-600">
                AI
              </div>
              <div>
                <p className="text-white font-medium">Smart Matching</p>
                <p className="text-blue-200 text-sm">Powered by Google Gemini</p>
              </div>
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-1/2 -right-24 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500">
              Please sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="input bg-slate-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 mt-4 text-lg shadow-md shadow-blue-500/20"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>

            <div className="mt-8 text-center border-t border-slate-100 pt-6">
              <p className="text-slate-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Create one now
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

export default Login;
