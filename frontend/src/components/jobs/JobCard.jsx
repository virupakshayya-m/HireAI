import { Link } from "react-router-dom";
import { MapPin, Briefcase, Clock, ChevronRight } from "lucide-react";

const JobCard = ({ job }) => {
  return (
    <Link
      to={`/jobs/${job._id}`}
      className="block card p-5 hover:-translate-y-1 hover:shadow-md hover:border-primary-200 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {job.company.logo ? (
            <img
              src={job.company.logo}
              alt={job.company.name}
              className="h-14 w-14 rounded-lg object-cover border border-neutral-100 shadow-sm"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary-50 text-xl font-bold text-primary-600 border border-primary-100 shadow-sm">
              {job.company.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
              {job.title}
            </h2>
            <p className="text-neutral-500 font-medium mt-1">
              {job.company.name}
            </p>
          </div>
        </div>
        
        <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-neutral-50 group-hover:bg-primary-50 transition-colors">
          <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors" />
        </div>
      </div>

      {job.description && (
        <p className="mt-4 text-sm text-neutral-600 line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium">
          <MapPin className="w-4 h-4" />
          {job.location}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
          <Briefcase className="w-3.5 h-3.5" />
          {job.employmentType}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
          <Clock className="w-3.5 h-3.5" />
          {job.experienceLevel}
        </div>
      </div>
      
      {job.salary && (
        <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-neutral-500 text-sm font-medium">Salary</span>
          <span className="font-bold text-neutral-900">₹{job.salary.toLocaleString()}</span>
        </div>
      )}
    </Link>
  );
};

export default JobCard;