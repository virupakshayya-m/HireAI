import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { getMyProfile, updateMyProfile, uploadProfilePhoto } from "@/services/profileService";
import { useAuth } from "@/context/AuthContext";

const RecruiterProfile = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await getMyProfile();
      
      if (data.user) {
        setName(data.user.name || "");
        setEmail(data.user.email || "");
        if (data.user.profile) {
          setProfilePhoto(data.user.profile.profilePhoto || "");
        }
      }
    } catch (error) {
      toast.error(error.message || "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateMyProfile({ name });
      await refreshUser();
      toast.success("Profile updated successfully!");
      navigate("/recruiter/dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and WEBP files are allowed");
      return;
    }

    setIsPhotoUploading(true);
    
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const data = await uploadProfilePhoto(formData);
      setProfilePhoto(data.profilePhoto);
      await refreshUser();
      toast.success("Profile photo uploaded successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to upload photo");
    } finally {
      setIsPhotoUploading(false);
      e.target.value = null; 
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-8 space-y-8">
        <div className="h-10 bg-neutral-200 rounded w-48 animate-pulse mb-8"></div>
        <div className="card p-6 h-96 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-neutral-500 mt-1">Manage your personal information.</p>
        </div>
        <Link
          to="/recruiter/dashboard"
          className="text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="space-y-6">
        <div className="card p-5 md:p-6 flex items-center gap-6">
          <div className="shrink-0 relative">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-neutral-50 shadow-sm" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-bold border-4 border-white shadow-sm">
                {name ? name.charAt(0).toUpperCase() : "?"} 
              </div>
            )}
            {isPhotoUploading && (
              <div className="absolute inset-0 bg-white/60 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Profile Photo</h3>
            <p className="text-sm text-neutral-500 mb-3">Upload a professional picture (JPG, PNG).</p>
            <div className="relative">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/*"
                onChange={handlePhotoUpload}
                disabled={isPhotoUploading}
                className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="card p-5 md:p-6">
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <h2 className="text-lg font-bold mb-5 text-neutral-900">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input bg-neutral-50"
                    placeholder="e.g., Jane Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    disabled
                    className="input bg-neutral-100 text-neutral-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-neutral-100">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary px-8"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;
