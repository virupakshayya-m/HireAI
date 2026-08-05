import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createCompany,
  getMyCompany,
  updateCompany,
} from "@/services/companyService";
import { useAuth } from "@/context/AuthContext";

const CompanySetup = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    industry: "",
  });

  // Fetch company data on component mount
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const data = await getMyCompany();
        // If the backend returns a company, pre-fill the form
        if (data.company) {
          setFormData({
            name: data.company.name || "",
            description: data.company.description || "",
            website: data.company.website || "",
            location: data.company.location || "",
            industry: data.company.industry || "",
          });
          setIsEditing(true); // Switch to edit mode
        }
      } catch (error) {
        // If error is 404, it means the recruiter hasn't created a company yet.
        // This is normal, so we just let them see the blank form.
        if (error.statusCode !== 404) {
          toast.error("Error fetching company details");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isEditing) {
        // Update existing company
        await updateCompany(formData);
        toast.success("Company updated successfully!");
      } else {
        // Create new company
        await createCompany(formData);
        toast.success("Company created successfully!");
        setIsEditing(true);
      }
      await refreshUser(); // Update global user state with new company
      navigate("/recruiter/dashboard"); // Send them back to dashboard after saving
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-8 space-y-6">
        <div className="h-8 bg-slate-200 rounded w-64 animate-pulse mb-6"></div>
        <div className="card p-6 h-96 animate-pulse bg-slate-100"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8">
      <div className="card p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6 text-slate-900">
          {isEditing ? "Update Company Profile" : "Create Company Profile"}
        </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="input bg-slate-50 mt-1"
            placeholder="e.g. Google, Amazon, Acme Corp"
          />
        </div>

        {/* Industry & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="input bg-slate-50 mt-1"
              placeholder="e.g. Technology, Finance"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input bg-slate-50 mt-1"
              placeholder="e.g. San Francisco, CA"
            />
          </div>
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Website URL
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="input bg-slate-50 mt-1"
            placeholder="https://www.example.com"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company Description
          </label>
          <textarea
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleChange}
            className="input bg-slate-50 mt-1"
            placeholder="Brief description about what your company does..."
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary"
          >
            {isSaving ? "Saving..." : isEditing ? "Update Company" : "Register Company"}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default CompanySetup;
