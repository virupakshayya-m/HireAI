import { Link } from "react-router-dom";
import { Search, Sparkles, Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-neutral-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-center py-16">
        <div className="absolute inset-0 bg-primary-600/5 -skew-y-6 transform origin-top-left -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-900 tracking-tight mb-8">
            The intelligent way to <br className="hidden md:block" />
            <span className="text-primary-600">land your dream job.</span>
          </h1>
          
          <p className="mt-4 text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            HireAI uses advanced machine learning to match top talent with the perfect roles. Stop endlessly scrolling and let our AI do the heavy lifting.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user?.role === "candidate" ? (
              <Link to="/jobs" className="btn-primary text-lg py-4 px-8 shadow-lg shadow-blue-500/30">
                Browse Jobs
              </Link>
            ) : user?.role === "recruiter" ? (
              <Link to="/recruiter/dashboard" className="btn-primary text-lg py-4 px-8 shadow-lg shadow-blue-500/30">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/jobs" className="btn-primary text-lg py-4 px-8 shadow-lg shadow-blue-500/30">
                  Find Jobs Now
                </Link>
                <Link to="/login" className="btn-secondary text-lg py-4 px-8 shadow-sm">
                  Post a Job
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Why choose HireAI?</h2>
            <p className="text-neutral-600 text-lg">Our platform bridges the gap between exceptional companies and world-class candidates using state of the art AI.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">AI-Powered Matching</h3>
              <p className="text-neutral-600 leading-relaxed">
                Our Gemini-powered engine reads your resume and matches you with roles where you have the highest probability of success.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Smart Insights</h3>
              <p className="text-neutral-600 leading-relaxed">
                Recruiters get instant AI summaries of how well candidates fit their requirements, saving countless hours of manual screening.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Premium Companies</h3>
              <p className="text-neutral-600 leading-relaxed">
                Access exclusive opportunities from top-tier startups and Fortune 500 companies looking to hire world-class talent fast.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="py-24 bg-neutral-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">Ready to accelerate your hiring?</h2>
          <p className="text-neutral-400 text-lg mb-10">Join thousands of candidates and recruiters already using HireAI.</p>
          {!user && (
             <Link to="/register" className="btn-primary bg-white text-neutral-900 hover:bg-neutral-100 hover:text-primary-600 text-lg py-4 px-10">
               Get Started for Free
             </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
