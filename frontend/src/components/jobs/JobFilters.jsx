import { Search, RotateCcw } from "lucide-react";
import { EMPLOYMENT_TYPES } from "@/utils/constants";
import { EXPERIENCE_LEVELS } from "@/utils/constants";

const JobFilters = ({ filters, setFilters, onApply, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
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
              className="w-full rounded-lg border py-2 pl-10 pr-4 outline-none focus:border-blue-500"
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
            className="w-full rounded-lg border p-2 outline-none focus:border-blue-500"
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
            className="w-full rounded-lg border p-2 outline-none focus:border-blue-500"
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
            className="w-full rounded-lg border p-2 outline-none focus:border-blue-500"
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

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100"
        >
          <RotateCcw size={18} />
          Reset
        </button>

        <button
          type="button"
          onClick={onApply}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default JobFilters;
