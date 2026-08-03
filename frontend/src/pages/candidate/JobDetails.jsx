import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getJobById, applyForJob } from "../../services/jobService";
import toast from "react-hot-toast";

const JobDetails = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [applying, setApplying] = useState(false);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getJobById(id);

      setJob(data.job);
    } catch (error) {
      setError(error.message || "Failed to load job");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return (
      <div>
        <h2>{error}</h2>
        <Link to="/jobs">← Back to Jobs</Link>
      </div>
    );
  }

  const handleApply = async () => {
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
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{job.title}</h1>

      <div className="mt-2 text-gray-600">
        {job.company.name} • {job.location}
      </div>

      <div className="mt-2 flex gap-4">
        <span>{job.employmentType}</span>
        <span>{job.experienceLevel}</span>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Description</h2>

        <p className="mt-2">{job.description}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Company</h2>

        <div className="mt-2">{job.company.name}</div>

        <div>{job.company.location}</div>
      </div>

      <button
        onClick={handleApply}
        disabled={applying}
        className="mt-8 rounded bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
      >
        {applying ? "Applying..." : "Apply Now"}
      </button>
    </div>
  );
};

export default JobDetails;
