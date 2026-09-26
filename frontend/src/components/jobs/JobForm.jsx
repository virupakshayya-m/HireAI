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
      className="space-y-6 card p-6 md:p-8"
    >
      {/* Title */}

      <div>
        <label htmlFor="title" className="mb-2 block font-medium">
          Job Title
        </label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Software Engineer"
          className="input bg-neutral-50"
          required
        />
      </div>

      {/* Description */}

      <div>
        <label htmlFor="description" className="mb-2 block font-medium">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the role..."
          className="input bg-neutral-50"
          required
        />
      </div>

      {/* Requirements */}

      <RequirementInput
        requirements={formData.requirements}
        setFormData={setFormData}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Salary */}
        <div>
          <label htmlFor="salary" className="mb-2 block font-medium">
            Salary (₹)
          </label>
          <input
            id="salary"
            type="number"
            min={1}
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="600000"
            className="input bg-neutral-50"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="mb-2 block font-medium">
            Location
          </label>
          <input
            id="location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Kolhapur"
            className="input bg-neutral-50"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employment Type */}
        <div>
          <label htmlFor="employmentType" className="mb-2 block font-medium">
            Employment Type
          </label>
          <select
            id="employmentType"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            className="input bg-neutral-50"
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
          <label htmlFor="experienceLevel" className="mb-2 block font-medium">
            Experience Level
          </label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            className="input bg-neutral-50"
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
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3 text-lg mt-4 shadow-md shadow-blue-500/20"
      >
        {loading ? "Saving..." : buttonText}
      </button>
    </form>
  );
};

export default JobForm;