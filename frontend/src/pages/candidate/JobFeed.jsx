import { useCallback, useEffect, useState } from "react";
import { getAllJobs } from "@/services/jobService";
import JobFilters from "@/components/jobs/JobFilters";
import JobCard from "@/components/jobs/JobCard";
import Pagination from "@/components/common/Pagination";
import toast from "react-hot-toast";

const initialFilters = {
  keyword: "",
  location: "",
  employmentType: "",
  experienceLevel: "",
};

const JobFeed = () => {
  const [filters, setFilters] = useState(initialFilters);

  const [appliedFilters, setAppliedFilters] = useState({
    ...initialFilters,
    page: 1,
    limit: 2,
  });

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getAllJobs(appliedFilters);

      setJobs(data.jobs);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(error.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    fetchJobs();
  }, [appliedFilters]);

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

  if (loading) {
    return <div className="py-20 text-center">Loading jobs...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <JobFilters
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {jobs.length === 0 ? (
        <div className="rounded-xl border bg-white py-16 text-center shadow-sm">
          <h2 className="text-xl font-semibold">No Jobs Found</h2>

          <p className="mt-2 text-gray-500">
            Try changing your search filters.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}

      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default JobFeed;
