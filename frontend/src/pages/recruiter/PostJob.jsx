import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { EMPLOYMENT_TYPES } from "@/utils/constants";
import { EXPERIENCE_LEVELS } from "@/utils/constants";

import { createJob } from "../../services/jobService";

const initialForm = {
  title: "",
  description: "",
  requirements: [""],
  salary: "",
  location: "",
  employmentType: "",
  experienceLevel: "",
};

const PostJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRequirementChange = (index, value) => {
    const updatedRequirements = [...formData.requirements];

    updatedRequirements[index] = value;

    setFormData((prev) => ({
      ...prev,
      requirements: updatedRequirements,
    }));
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirement = (index) => {
    if (formData.requirements.length === 1) return;

    const updatedRequirements = formData.requirements.filter(
      (_, i) => i !== index,
    );

    setFormData((prev) => ({
      ...prev,
      requirements: updatedRequirements,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      salary: Number(formData.salary),
      requirements: formData.requirements
        .map((req) => req.trim())
        .filter(Boolean),
    };

    try {
      setIsSubmitting(true);

      const data = await createJob(payload);

      toast.success(data.message);

      navigate("/recruiter/dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to create job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Post New Job</h1>

        <p className="mt-2 text-gray-500">
          Fill in the details below to publish a new job.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border bg-white p-8 shadow-sm"
      >
        {/* Job Title */}

        <div>
          <label className="mb-2 block font-medium">Job Title</label>

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
          <label className="mb-2 block font-medium">Description</label>

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

        <div>
          <label className="mb-4 block font-medium">Requirements</label>

          <div className="space-y-3">
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={requirement}
                  placeholder={`Requirement ${index + 1}`}
                  onChange={(e) =>
                    handleRequirementChange(index, e.target.value)
                  }
                  className="flex-1 rounded-lg border p-3 outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  disabled={formData.requirements.length === 1}
                  className="rounded-lg bg-red-500 px-4 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRequirement}
            className="mt-4 rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200"
          >
            + Add Requirement
          </button>
        </div>

        {/* Salary */}

        <div>
          <label className="mb-2 block font-medium">Salary (₹)</label>

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
          <label className="mb-2 block font-medium">Location</label>

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
          <label className="mb-2 block font-medium">Employment Type</label>

          <select
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
            required
          >
            <option value="">Select Employment Type</option>

            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Experience */}

        <div>
          <label className="mb-2 block font-medium">Experience Level</label>

          <select
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
            required
          >
            <option value="">Select Experience Level</option>

            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Posting Job..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
