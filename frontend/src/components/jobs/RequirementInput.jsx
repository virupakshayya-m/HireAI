const RequirementInput = ({ requirements, setFormData }) => {
  const handleRequirementChange = (index, value) => {
    const updatedRequirements = [...requirements];

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
    if (requirements.length === 1) return;

    const updatedRequirements = requirements.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      requirements: updatedRequirements,
    }));
  };

  return (
    <div>
      <label className="mb-4 block font-medium">Requirements</label>

      <div className="space-y-3">
        {requirements.map((requirement, index) => (
          <div key={index} className="flex gap-3">
            <input
              type="text"
              value={requirement}
              placeholder={`Requirement ${index + 1}`}
              onChange={(e) => handleRequirementChange(index, e.target.value)}
              className="flex-1 rounded-lg border p-3 outline-none focus:border-blue-500"
            />

            <button
              type="button"
              onClick={() => removeRequirement(index)}
              disabled={requirements.length === 1}
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
  );
};

export default RequirementInput;
