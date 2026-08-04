import { Link } from "react-router-dom";
import { MapPin, Briefcase, Users } from "lucide-react";

function RecruiterJobCard({ job, onDelete }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">
      {/* Job Title */}

      <h2 className="text-xl font-semibold">{job.title}</h2>

      {/* Meta Information */}

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          {job.location}
        </div>

        <div className="flex items-center gap-2">
          <Briefcase size={16} />
          {job.employmentType}
        </div>
      </div>

      {/* Salary */}

      <p className="mt-4 font-medium text-blue-600">{job.salary}</p>

      {/* Applicant Count */}

      <div className="mt-5 flex items-center gap-2 text-gray-700">
        <Users size={18} />

        <span>
          {job.applicantCount} Applicant{job.applicantCount !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Actions */}

      <div className="mt-6 flex gap-3">
        <Link
          to={`/recruiter/jobs/${job._id}/applicants`}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white transition hover:bg-blue-700"
        >
          View Applicants
        </Link>

        <Link
          to={`/recruiter/jobs/${job._id}/edit`}
          className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Edit
        </Link>

        <button
          onClick={() => onDelete(job)}
          className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default RecruiterJobCard;
