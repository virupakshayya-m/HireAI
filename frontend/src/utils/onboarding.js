export const isCandidateProfileComplete = (user) => {
  if (!user || user.role !== "candidate") return false;
  // A candidate's profile is considered complete if they have uploaded a resume
  return Boolean(user.profile?.resume?.url);
};

export const isRecruiterProfileComplete = (user) => {
  if (!user || user.role !== "recruiter") return false;
  // A recruiter's profile is complete if they have created a company profile
  return Boolean(user.company);
};

export const getOnboardingRedirectPath = (user) => {
  if (!user) return null;

  if (user.role === "recruiter" && !isRecruiterProfileComplete(user)) {
    return "/recruiter/company";
  }

  // Candidates are allowed to browse jobs without a complete profile,
  // so we don't enforce a hard redirect path for them globally.
  // Enforcement happens only when they attempt to apply for a job.
  
  return null;
};
