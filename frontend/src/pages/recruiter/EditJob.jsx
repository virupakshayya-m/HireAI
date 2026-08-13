import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import JobForm from "@/components/jobs/JobForm";

import { getJobById, updateJob } from "@/services/jobService";

const initialForm = {
  title: "",
  description: "",
  requirements: [""],
  salary: "",
  location: "",
  employmentType: "",
  experienceLevel: "",
};

const EditJob = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);

        const data = await getJobById(id);

        const job = data.job;

        setFormData({
          title: job.title,
          description: job.description,
          requirements: job.requirements,
          salary: job.salary,
          location: job.location,
          employmentType: job.employmentType,
          experienceLevel: job.experienceLevel,
        });
      } catch (error) {
        toast.error(error.message || "Failed to fetch job");

        navigate("/recruiter/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

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
      setSaving(true);

      const data = await updateJob(id, payload);

      toast.success(data.message);

      navigate("/recruiter/dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center">Loading job...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Edit Job</h1>
          <p className="mt-2 text-neutral-500">Update your job details.</p>
        </div>
        <Link
          to="/recruiter/dashboard"
          className="text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <JobForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        loading={saving}
        buttonText="Save Changes"
      />
    </div>
  );
};

export default EditJob;
