import { Link } from "react-router-dom";
import { MapPin, Briefcase, Users } from "lucide-react";

function RecruiterJobCard({ job, onDelete }) {
  return (
    <div className="card p-6 hover:-translate-y-1 hover:shadow-md hover:border-blue-200 transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h2>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
          <Users size={16} />
          <span>
            {job.applicantCount} Applicant{job.applicantCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Meta Information */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
          <MapPin className="w-4 h-4" />
          {job.location}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
          <Briefcase className="w-4 h-4" />
          {job.employmentType}
        </div>
        {job.salary && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
            {job.salary}
          </div>
        )}
      </div>

      {/* Actions */}

      <div className="pt-5 border-t border-slate-100 flex gap-3">
        <Link
          to={`/recruiter/jobs/${job._id}/applicants`}
          className="flex-1 btn-primary py-2.5"
        >
          View Applicants
        </Link>

        <Link
          to={`/recruiter/jobs/${job._id}/edit`}
          className="btn-secondary py-2.5"
        >
          Edit
        </Link>

        <button
          onClick={() => onDelete(job)}
          className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default RecruiterJobCard;
