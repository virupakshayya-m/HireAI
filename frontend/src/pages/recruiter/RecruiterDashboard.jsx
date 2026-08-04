import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { getMyJobs } from "@/services/jobService";
import JobFilters from "@/components/jobs/JobFilters";
import Pagination from "@/components/common/Pagination";
import RecruiterJobCard from "@/components/recruiter/RecruiterJobCard";

const RecruiterDashboard = () => {
  const initialFilters = {
    keyword: "",
    location: "",
    employmentType: "",
    experienceLevel: "",
  };

  const [filters, setFilters] = useState(initialFilters);

  const [appliedFilters, setAppliedFilters] = useState({
    ...initialFilters,
    page: 1,
    limit: 2,
  });

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);

      const data = await getMyJobs(appliedFilters);

      setJobs(data.jobs);

      setPagination(data.pagination);
    } catch (error) {
      toast.error(error.message || "Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      ...filters,
      page: 1,
      limit: 2,
    });
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);

    setAppliedFilters({
      ...initialFilters,
      page: 1,
      limit: 2,
    });
  };

  const handlePageChange = (page) => {
    setAppliedFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  if (isLoading) {
    return <div className="py-20 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>

          <p className="mt-2 text-gray-500">
            Manage your job postings and applicants.
          </p>
        </div>

        <Link
          to="/recruiter/jobs/new"
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          + Post New Job
        </Link>
      </div>

      <JobFilters
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {jobs.length === 0 ? (
        <div className="mt-10 rounded-xl border bg-white py-20 text-center">
          <h2 className="text-2xl font-semibold">
            You haven't posted any jobs yet.
          </h2>

          <p className="mt-3 text-gray-500">
            Create your first job posting and start hiring.
          </p>

          <Link
            to="/recruiter/jobs/new"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Post Your First Job
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6">
            {jobs.map((job) => (
              <RecruiterJobCard key={job._id} job={job} />
            ))}
          </div>

          {pagination && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default RecruiterDashboard;
