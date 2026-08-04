import { Link } from "react-router-dom";
import { MapPin, Briefcase, Users } from "lucide-react";

const RecruiterJobCard = ({ job }) => {
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

      <div className="mt-6">
        <Link
          to={`/recruiter/jobs/${job._id}/applicants`}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
        >
          View Applicants
        </Link>
      </div>
    </div>
  );
};

export default RecruiterJobCard;
