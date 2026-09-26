import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();
  
  const isMinimal = !!user;

  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isMinimal ? 'py-6' : 'pt-16 pb-8'}`}>
        {!isMinimal && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-12">
          
          {/* Brand & Description - Takes up 2 columns on lg */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-neutral-900 tracking-tight">
              <span className="text-primary-600">Hire</span>AI
            </Link>
            <p className="text-neutral-500 leading-relaxed max-w-sm">
              The smartest recruitment platform leveraging AI to match top-tier talent with world-class companies perfectly. 
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Candidates */}
          <div>
            <h3 className="font-semibold text-neutral-900 mb-6 text-sm tracking-wider uppercase">For Candidates</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/jobs" className="text-neutral-500 hover:text-primary-600 transition-colors">Browse Jobs</Link>
              </li>
              <li>
                <Link to="/candidate/profile" className="text-neutral-500 hover:text-primary-600 transition-colors">My Profile</Link>
              </li>
              <li>
                <Link to="/candidate/applications" className="text-neutral-500 hover:text-primary-600 transition-colors">Track Applications</Link>
              </li>
              <li>
                <Link to="/register" className="text-neutral-500 hover:text-primary-600 transition-colors">Create Account</Link>
              </li>
            </ul>
          </div>

          {/* Recruiters */}
          <div>
            <h3 className="font-semibold text-neutral-900 mb-6 text-sm tracking-wider uppercase">For Recruiters</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/recruiter/dashboard" className="text-neutral-500 hover:text-primary-600 transition-colors">Recruiter Dashboard</Link>
              </li>
              <li>
                <Link to="/recruiter/jobs/new" className="text-neutral-500 hover:text-primary-600 transition-colors">Post a Job</Link>
              </li>
              <li>
                <Link to="/recruiter/company" className="text-neutral-500 hover:text-primary-600 transition-colors">Company Profile</Link>
              </li>
              <li>
                <a href="#" className="text-neutral-500 hover:text-primary-600 transition-colors">Pricing Plans</a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-neutral-900 mb-6 text-sm tracking-wider uppercase">Company</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-neutral-500 hover:text-primary-600 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-neutral-500 hover:text-primary-600 transition-colors">Contact</a>
              </li>
              <li>
                <a href="#" className="text-neutral-500 hover:text-primary-600 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-neutral-500 hover:text-primary-600 transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
        )}

        <div className={`${!isMinimal ? 'pt-8 border-t border-neutral-100' : ''} flex flex-col md:flex-row justify-center items-center gap-4`}>
          <div className="flex items-center gap-4">
            {isMinimal && (
              <span className="text-primary-600 font-bold tracking-tight">HireAI</span>
            )}
            <p className="text-sm text-neutral-500">
              &copy; {currentYear} HireAI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
