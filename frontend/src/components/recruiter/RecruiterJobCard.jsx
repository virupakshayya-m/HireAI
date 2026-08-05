import { Link } from "react-router-dom";
import { MapPin, Briefcase, Users } from "lucide-react";

function RecruiterJobCard({ job, onDelete }) {
  return (
    <div className="card p-5 hover:-translate-y-1 hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col h-full">
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
      <div className="pt-4 mt-auto border-t border-slate-100 flex flex-wrap gap-2">
        <Link
          to={`/recruiter/jobs/${job._id}/applicants`}
          className="w-full btn-primary py-2 text-sm"
        >
          View Applicants
        </Link>

        <Link
          to={`/recruiter/jobs/${job._id}/edit`}
          className="flex-1 btn-secondary py-2 min-w-[100px] text-sm"
        >
          Edit
        </Link>

        <button
          onClick={() => onDelete(job)}
          className="flex-1 min-w-[70px] bg-white border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm text-center"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default RecruiterJobCard;
