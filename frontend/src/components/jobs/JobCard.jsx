import { Link } from "react-router-dom";
import { MapPin, Briefcase, Clock, ChevronRight } from "lucide-react";

const JobCard = ({ job }) => {
  return (
    <Link
      to={`/jobs/${job._id}`}
      className="block card p-5 hover:-translate-y-1 hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {job.company.logo ? (
            <img
              src={job.company.logo}
              alt={job.company.name}
              className="h-14 w-14 rounded-lg object-cover border border-slate-100 shadow-sm"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-xl font-bold text-blue-600 border border-blue-100 shadow-sm">
              {job.company.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {job.title}
            </h2>
            <p className="text-slate-500 font-medium mt-1">
              {job.company.name}
            </p>
          </div>
        </div>
        
        <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 group-hover:bg-blue-50 transition-colors">
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </div>
      </div>

      {job.description && (
        <p className="mt-4 text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
          <MapPin className="w-4 h-4" />
          {job.location}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
          <Briefcase className="w-3.5 h-3.5" />
          {job.employmentType}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
          <Clock className="w-3.5 h-3.5" />
          {job.experienceLevel}
        </div>
      </div>
      
      {job.salary && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-slate-500 text-sm font-medium">Salary</span>
          <span className="font-bold text-slate-900">₹{job.salary.toLocaleString()}</span>
        </div>
      )}
    </Link>
  );
};

export default JobCard;