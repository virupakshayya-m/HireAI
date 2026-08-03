import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <Link
      to={`/jobs/${job._id}`}
      className="block rounded-lg border p-5 hover:shadow-lg transition"
    >
      <div className="flex items-center gap-4">
        {job.company.logo ? (
          <img
            src={job.company.logo}
            alt={job.company.name}
            className="h-12 w-12 rounded object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-200 text-lg font-semibold">
            {job.company.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold">
            {job.title}
          </h2>

          <p className="text-gray-600">
            {job.company.name}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
        <span>{job.location}</span>
        <span>•</span>
        <span>{job.employmentType}</span>
        <span>•</span>
        <span>{job.experienceLevel}</span>
      </div>

      <div className="mt-4">
        <span className="text-blue-600 font-medium">
          View Details →
        </span>
      </div>
    </Link>
  );
};

export default JobCard;