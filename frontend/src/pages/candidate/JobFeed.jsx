import { useCallback, useEffect, useState } from "react";
import { getAllJobs } from "@/services/jobService";
import JobFilters from "@/components/jobs/JobFilters";
import JobCard from "@/components/jobs/JobCard";
import Pagination from "@/components/common/Pagination";
import toast from "react-hot-toast";
import { SearchX } from "lucide-react";

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
    limit: 10,
  });

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);

      const data = await getAllJobs(appliedFilters);

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
      limit: 10,
    });
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);

    setAppliedFilters({
      ...initialFilters,
      page: 1,
      limit: 10,
    });
  };

  const handlePageChange = (page) => {
    setAppliedFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 card p-6 animate-pulse bg-slate-100/50 h-48"></div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex gap-4 mb-6">
                <div className="w-14 h-14 bg-slate-200 rounded-lg"></div>
                <div className="space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-48"></div>
                  <div className="h-4 bg-slate-200 rounded w-32"></div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-8 bg-slate-200 rounded-full w-24"></div>
                <div className="h-8 bg-slate-200 rounded-full w-24"></div>
                <div className="h-8 bg-slate-200 rounded-full w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
        <div className="card py-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <SearchX className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No Jobs Found</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            We couldn't find any jobs matching your current filters. Try adjusting your search keywords or location.
          </p>
          <button onClick={handleResetFilters} className="btn-secondary mt-6">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
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
