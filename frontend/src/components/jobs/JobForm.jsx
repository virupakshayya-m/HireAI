import RequirementInput from "@/components/jobs/RequirementInput";
import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
} from "@/constants/jobConstants";

const JobForm = ({
  formData,
  setFormData,
  onSubmit,
  loading,
  buttonText,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-xl border bg-white p-8 shadow-sm"
    >
      {/* Title */}

      <div>
        <label className="mb-2 block font-medium">
          Job Title
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Software Engineer"
          className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          required
        />
      </div>

      {/* Description */}

      <div>
        <label className="mb-2 block font-medium">
          Description
        </label>

        <textarea
          rows={6}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the role..."
          className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          required
        />
      </div>

      {/* Requirements */}

      <RequirementInput
        requirements={formData.requirements}
        setFormData={setFormData}
      />

      {/* Salary */}

      <div>
        <label className="mb-2 block font-medium">
          Salary (₹)
        </label>

        <input
          type="number"
          min={1}
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="600000"
          className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          required
        />
      </div>

      {/* Location */}

      <div>
        <label className="mb-2 block font-medium">
          Location
        </label>

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Kolhapur"
          className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          required
        />
      </div>

      {/* Employment Type */}

      <div>
        <label className="mb-2 block font-medium">
          Employment Type
        </label>

        <select
          name="employmentType"
          value={formData.employmentType}
          onChange={handleChange}
          className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          required
        >
          <option value="">
            Select Employment Type
          </option>

          {EMPLOYMENT_TYPES.map((type) => (
            <option
              key={type}
              value={type}
            >
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Experience */}

      <div>
        <label className="mb-2 block font-medium">
          Experience Level
        </label>

        <select
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={handleChange}
          className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          required
        >
          <option value="">
            Select Experience Level
          </option>

          {EXPERIENCE_LEVELS.map((level) => (
            <option
              key={level}
              value={level}
            >
              {level}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : buttonText}
      </button>
    </form>
  );
};

export default JobForm;