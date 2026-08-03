import { useEffect, useState } from "react";
import { getAllJobs } from "@/services/jobService";
import JobCard from "@/components/jobs/JobCard";

const JobFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllJobs();

      setJobs(data.jobs);
      setPagination(data.pagination);
    } catch (error) {
      setError(error.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading jobs...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
};

export default JobFeed;
