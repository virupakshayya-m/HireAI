import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import JobForm from "@/components/jobs/JobForm";
import { createJob } from "@/services/jobService";

const initialForm = {
  title: "",
  description: "",
  requirements: [""],
  salary: "",
  location: "",
  employmentType: "",
  experienceLevel: "",
};

function PostJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      const data = await createJob(payload);

      toast.success(data.message);

      navigate("/recruiter/dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to create job");
    } finally {
      setLoading(false);
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

      <JobForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        loading={loading}
        buttonText="Post Job"
      />
    </div>
  );
}

export default PostJob;
