import { Search, RotateCcw } from "lucide-react";
import { EMPLOYMENT_TYPES } from "@/constants/jobConstants";
import { EXPERIENCE_LEVELS } from "@/constants/jobConstants";

const JobFilters = ({ filters, setFilters, onApply, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="mb-6 card p-4 md:p-5">
      <form onSubmit={(e) => { e.preventDefault(); onApply(); }} className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 items-end">
          {/* Keyword */}
          <div className="lg:col-span-4">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Search</label>

          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />

            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleChange}
              placeholder="Job title or keyword..."
              className="input pl-10 bg-slate-50"
            />
          </div>
        </div>

          <div className="lg:col-span-3">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Location</label>

          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Pune"
            className="input bg-slate-50"
          />
        </div>

          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Employment
            </label>

          <select
            name="employmentType"
            value={filters.employmentType}
            onChange={handleChange}
            className="input bg-slate-50"
          >
            <option value="">All</option>
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

          <div className="lg:col-span-3">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Experience</label>

          <select
            name="experienceLevel"
            value={filters.experienceLevel}
            onChange={handleChange}
            className="input bg-slate-50"
          >
            <option value="">All</option>
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>
        
      <div className="flex justify-end gap-3 mt-1">
          <button
            type="button"
            onClick={onReset}
            className="btn-secondary py-2"
          >
            <RotateCcw size={16} className="mr-2" />
            Reset
          </button>

          <button
            type="submit"
            className="btn-primary py-2 px-6"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobFilters;
