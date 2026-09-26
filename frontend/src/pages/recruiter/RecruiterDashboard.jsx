import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { getMyJobs, deleteJob } from "@/services/jobService";
import JobFilters from "@/components/jobs/JobFilters";
import Pagination from "@/components/common/Pagination";
import RecruiterJobCard from "@/components/recruiter/RecruiterJobCard";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { useAuth } from "@/context/AuthContext";
import { isRecruiterProfileComplete } from "@/utils/onboarding";

const RecruiterDashboard = () => {
  const initialFilters = {
    keyword: "",
    location: "",
    employmentType: "",
    experienceLevel: "",
  };

  const { user } = useAuth();
  const isProfileComplete = isRecruiterProfileComplete(user);

  const [filters, setFilters] = useState(initialFilters);

  const [appliedFilters, setAppliedFilters] = useState({
    ...initialFilters,
    page: 1,
    limit: 10,
  });

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDeleteClick = (job) => {
    setSelectedJob(job);

    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);

      const data = await deleteJob(selectedJob._id);

      toast.success(data.message);

      setJobs((prev) => prev.filter((job) => job._id !== selectedJob._id));

      setIsDeleteOpen(false);

      setSelectedJob(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete job");
    } finally {
      setDeleting(false);
    }
  };

  const handlePostJobClick = () => {
    if (!isProfileComplete) {
      toast("Please complete your company profile first to start posting jobs.", {
        icon: "🏢",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="h-8 bg-neutral-200 rounded w-64 animate-pulse mb-3"></div>
            <div className="h-4 bg-neutral-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="h-12 bg-neutral-200 rounded-lg w-36 animate-pulse"></div>
        </div>
        <div className="mb-6 card p-5 animate-pulse h-24 bg-neutral-100"></div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card p-6 h-48 animate-pulse bg-neutral-100"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Banner for Soft Gating */}
      {!isProfileComplete && (
        <div className="mb-6 bg-warning-50 border border-warning-200 text-warning-800 px-4 py-3 rounded-lg flex items-center justify-between">
          <p className="text-sm font-medium">
            Welcome to HireAI! Please complete your company profile to start posting jobs.
          </p>
          <Link
            to="/recruiter/company"
            className="text-sm font-bold underline hover:text-warning-900 whitespace-nowrap ml-4"
          >
            Setup Company &rarr;
          </Link>
        </div>
      )}

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>

          <p className="mt-2 text-neutral-500">
            Manage your job postings and applicants.
          </p>
        </div>

        <Link
          to={isProfileComplete ? "/recruiter/jobs/new" : "/recruiter/company"}
          onClick={handlePostJobClick}
          className="btn-primary"
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
        <div className="card py-16 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-bold text-neutral-900 mb-2">No Jobs Posted</h2>
          <p className="text-neutral-500 mb-6 max-w-md mx-auto">
            You haven't posted any jobs yet. Create your first job posting and start hiring today.
          </p>
          <Link
            to={isProfileComplete ? "/recruiter/jobs/new" : "/recruiter/company"}
            onClick={handlePostJobClick}
            className="btn-primary"
          >
            Post Your First Job
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {jobs.map((job) => (
              <RecruiterJobCard key={job._id} job={job} onDelete={handleDeleteClick} />
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

      <ConfirmationModal
        isOpen={isDeleteOpen}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
        confirmText="Delete"
        loadingText="Deleting Job..."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          setSelectedJob(null);
        }}
      />
    </div>
  );
};

export default RecruiterDashboard;
