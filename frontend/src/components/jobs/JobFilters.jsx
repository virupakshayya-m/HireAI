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
    <div className="mb-8 card p-6">
      <h2 className="mb-6 text-2xl font-bold">Search Jobs</h2>

      <div className="grid gap-4 lg:grid-cols-4">
        {/* Keyword */}

        <div className="lg:col-span-4">
          <label className="mb-2 block text-sm font-medium">Search</label>

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

        {/* Location */}

        <div>
          <label className="mb-2 block text-sm font-medium">Location</label>

          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Pune"
            className="input bg-slate-50"
          />
        </div>

        {/* Employment */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Employment Type
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

        {/* Experience */}

        <div>
          <label className="mb-2 block text-sm font-medium">Experience</label>

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

      <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onReset}
          className="btn-secondary"
        >
          <RotateCcw size={18} className="mr-2" />
          Reset
        </button>

        <button
          type="button"
          onClick={onApply}
          className="btn-primary"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default JobFilters;
