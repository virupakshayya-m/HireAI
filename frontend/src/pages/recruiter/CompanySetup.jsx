import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createCompany,
  getMyCompany,
  updateCompany,
  uploadCompanyLogo,
} from "@/services/companyService";
import { useAuth } from "@/context/AuthContext";

const CompanySetup = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLogoUploading, setIsLogoUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    industry: "",
    logo: "",
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
            logo: data.company.logo || "",
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

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and WEBP files are allowed");
      return;
    }

    setIsLogoUploading(true);
    
    const uploadData = new FormData();
    uploadData.append("logo", file);

    try {
      const data = await uploadCompanyLogo(uploadData);
      setFormData(prev => ({ ...prev, logo: data.logo }));
      await refreshUser();
      toast.success("Company logo uploaded successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to upload logo");
    } finally {
      setIsLogoUploading(false);
      e.target.value = null; 
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-8 space-y-6">
        <div className="h-8 bg-neutral-200 rounded w-64 animate-pulse mb-6"></div>
        <div className="card p-6 h-96 animate-pulse bg-neutral-100"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">
          {isEditing ? "Update Company Profile" : "Create Company Profile"}
        </h1>
        {isEditing && (
          <Link
            to="/recruiter/dashboard"
            className="text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors"
          >
            &larr; Back to Dashboard
          </Link>
        )}
      </div>

      <div className="card p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
            Company Name <span className="text-danger-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="input bg-neutral-50 mt-1"
            placeholder="e.g. Google, Amazon, Acme Corp"
          />
        </div>

        {/* Industry & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-neutral-700">
              Industry
            </label>
            <input
              id="industry"
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="input bg-neutral-50 mt-1"
              placeholder="e.g. Technology, Finance"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-neutral-700">
              Location
            </label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input bg-neutral-50 mt-1"
              placeholder="e.g. San Francisco, CA"
            />
          </div>
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-neutral-700">
            Website URL
          </label>
          <input
            id="website"
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="input bg-neutral-50 mt-1"
            placeholder="https://www.example.com"
          />
        </div>

        {/* Logo */}
        {isEditing && (
          <div>
            <label htmlFor="logo-upload" className="block text-sm font-medium text-neutral-700 mb-2">
              Company Logo
            </label>
            <div className="flex items-center gap-6">
              <div className="shrink-0 relative">
                {formData.logo ? (
                  <img src={formData.logo} alt="Logo" className="w-20 h-20 rounded-lg object-cover border border-neutral-200 shadow-sm" />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 text-2xl font-bold border border-primary-100 shadow-sm">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
                  </div>
                )}
                {isLogoUploading && (
                  <div className="absolute inset-0 bg-white/60 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-500 mb-2">Upload your company logo (JPG, PNG).</p>
                <input
                  id="logo-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/*"
                  onChange={handleLogoUpload}
                  disabled={isLogoUploading}
                  className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
            Company Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleChange}
            className="input bg-neutral-50 mt-1"
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
