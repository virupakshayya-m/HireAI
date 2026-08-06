import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  getMyProfile,
  updateMyProfile,
  uploadResume,
  uploadProfilePhoto,
} from "@/services/profileService";
import { useAuth } from "@/context/AuthContext";

const CandidateProfile = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [skillsText, setSkillsText] = useState(""); // We'll manage skills as a comma-separated string for the UI
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await getMyProfile();

      if (data.user && data.user.profile) {
        setName(data.user.name || "");
        setEmail(data.user.email || "");
        setBio(data.user.profile.bio || "");
        // Convert the array of skills from the backend into a comma-separated string
        if (data.user.profile.skills && data.user.profile.skills.length > 0) {
          setSkillsText(data.user.profile.skills.join(", "));
        }
        setEducation(data.user.profile.education || "");
        setExperience(data.user.profile.experience || "");
        setProfilePhoto(data.user.profile.profilePhoto || "");

        if (data.user.profile.resume && data.user.profile.resume.url) {
          setResumeUrl(data.user.profile.resume.url);
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
      // Convert comma-separated string back to an array for the backend
      const skillsArray = skillsText
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      await updateMyProfile({
        name,
        bio,
        skills: skillsArray,
        education,
        experience,
      });

      await refreshUser();
      toast.success("Profile updated successfully!");
      navigate("/jobs");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional frontend validation
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF and DOCX files are allowed");
      return;
    }

    setIsUploading(true);

    // Create FormData object to send the physical file
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const data = await uploadResume(formData);
      setResumeUrl(data.resume.url);
      await refreshUser();
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to upload resume");
    } finally {
      setIsUploading(false);
      // Reset the file input so they can upload a new one if needed
      e.target.value = null;
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
      <div className="max-w-4xl mx-auto p-6 mt-8 space-y-8">
        <div className="h-10 bg-slate-200 rounded w-48 animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 card p-6 h-96 animate-pulse"></div>
          <div className="card p-6 h-64 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-500 mt-1">
            Keep your profile updated to improve your chances of getting noticed
            by recruiters.
          </p>
        </div>
        <Link
          to="/jobs"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          &larr; Back to Jobs
        </Link>
      </div>

      <form onSubmit={handleProfileUpdate} className="space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column: Photo & Personal Info */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            
            {/* Profile Photo */}
            <div className="card p-5 md:p-6 flex items-center gap-6 h-fit">
              <div className="shrink-0 relative">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white shadow-sm">
                    {bio ? "U" : "?"}
                  </div>
                )}
                {isPhotoUploading && (
                  <div className="absolute inset-0 bg-white/60 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Profile Photo
                </h3>
                <p className="text-sm text-slate-500 mb-3">
                  Upload a professional picture (JPG, PNG).
                </p>
                <div className="relative">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/*"
                    onChange={handlePhotoUpload}
                    disabled={isPhotoUploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="card p-5 md:p-6">
              <div>
                <h2 className="text-lg font-bold mb-5 text-slate-900">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input bg-slate-50"
                      placeholder="e.g., John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      readOnly
                      disabled
                      className="input bg-slate-100 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Resume */}
          <div className="lg:col-span-1">
            <div className="card p-5 md:p-6 h-full">
              <h2 className="text-lg font-bold mb-5 text-slate-900">Resume</h2>

              <div className="space-y-6">
                {resumeUrl ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center space-x-2 text-green-700 mb-3">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-medium">Resume Uploaded</span>
                    </div>
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Current Resume &rarr;
                    </a>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-sm text-gray-600">No resume uploaded yet.</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {resumeUrl ? "Update Resume" : "Upload Resume"} (PDF/DOCX)
                  </label>

                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleResumeUpload}
                      disabled={isUploading}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 cursor-pointer"
                    />
                    {isUploading && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-sm text-blue-600 font-medium animate-pulse">
                          Uploading...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Professional Information */}
        <div className="card p-5 md:p-6">
          <div>
            <h2 className="text-lg font-bold mb-5 text-slate-900">
              Professional Information
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="input bg-slate-50"
                  placeholder="Tell recruiters a little bit about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills (Comma Separated)
                </label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  className="input bg-slate-50"
                  placeholder="e.g., React, Node.js, Python, Project Management"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education
                  </label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="input bg-slate-50"
                    placeholder="e.g., BS Computer Science, Stanford University"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="input bg-slate-50"
                    placeholder="e.g., 3 years as a Frontend Developer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary px-8"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CandidateProfile;
