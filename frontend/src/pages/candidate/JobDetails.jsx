import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getJobById, applyForJob } from "../../services/jobService";
import toast from "react-hot-toast";
import { ArrowLeft, MapPin, Briefcase, Clock, Building2, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isCandidateProfileComplete } from "@/utils/onboarding";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [applying, setApplying] = useState(false);

  const fetchJob = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getJobById(id);

      setJob(data.job);
    } catch (error) {
      setError(error.message || "Failed to load job");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="animate-pulse bg-slate-200 h-8 w-32 rounded"></div>
        <div className="card p-8 animate-pulse h-48 bg-slate-100"></div>
        <div className="card p-8 animate-pulse h-96 bg-slate-100"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center py-20">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">!</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Job</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <Link to="/jobs" className="btn-secondary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
        </Link>
      </div>
    );
  }

  const handleApply = async () => {
    if (!user) {
      toast("Please log in to apply for this job.", { icon: "👋" });
      return navigate("/login");
    }

    if (user.role === "candidate" && !isCandidateProfileComplete(user)) {
      toast.error("Please upload your resume before applying.");
      return navigate("/candidate/profile");
    }

    try {
      setApplying(true);

      const data = await applyForJob(id);
      toast.success(data.message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to apply";
      toast.error(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/jobs" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to all jobs
      </Link>

      <div className="card p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-6">
            {job.company.logo ? (
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="w-20 h-20 rounded-xl object-cover border border-slate-100 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl font-bold border border-blue-100 shadow-sm">
                {job.company.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-600 font-medium">
                <span className="text-blue-600">{job.company.name}</span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                {job.salary && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-slate-900">${job.salary.toLocaleString()}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:shrink-0">
            {user?.role !== "recruiter" && (
              <button
                onClick={handleApply}
                disabled={applying}
                className="btn-primary py-3 px-8 text-lg shadow-md shadow-blue-500/20"
              >
                {applying ? "Applying..." : "Apply Now"}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:flex md:flex-row gap-4 mt-8 pt-8 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Employment Type</p>
              <p className="font-semibold text-slate-900">{job.employmentType}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:ml-8">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Experience</p>
              <p className="font-semibold text-slate-900">{job.experienceLevel}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">About the role</h2>
            <div className="prose prose-slate max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{job.description}</p>
            </div>
          </div>
          
          {job.requirements && job.requirements.length > 0 && (
            <div className="card p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Requirements</h2>
              <ul className="space-y-3">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                    <span className="text-slate-700 leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-400" />
              About the company
            </h2>
            <div className="flex items-center gap-4 mb-6">
              {job.company.logo ? (
                <img src={job.company.logo} alt={job.company.name} className="w-16 h-16 rounded object-cover border border-slate-100" />
              ) : (
                <div className="w-16 h-16 rounded bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-400">
                  {job.company.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="font-bold text-slate-900">{job.company.name}</h3>
                <p className="text-sm text-slate-500">{job.company.location}</p>
              </div>
            </div>
            {job.company.website && (
              <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 font-medium hover:underline">
                Visit Website <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
