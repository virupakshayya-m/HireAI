import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyApplications } from "@/services/applicationService";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data.applications || []);
      } catch (error) {
        toast.error(error.message || "Failed to load your applications");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Helper function to render colored badges based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-warning-100 text-warning-800">
            Pending
          </span>
        );
      case "shortlisted":
        return (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary-100 text-primary-800">
            Shortlisted
          </span>
        );
      case "accepted":
        return (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-success-100 text-success-800">
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-danger-100 text-danger-800">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6 mt-8">
        <div className="h-10 bg-neutral-200 rounded w-48 mb-8 animate-pulse"></div>
        <div className="card overflow-hidden">
          <div className="h-12 bg-neutral-100 border-b border-neutral-200 animate-pulse"></div>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 border-b border-neutral-100 bg-white animate-pulse p-4 flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-32"></div>
                <div className="h-3 bg-neutral-200 rounded w-24"></div>
              </div>
              <div className="h-4 bg-neutral-200 rounded w-20"></div>
              <div className="h-4 bg-neutral-200 rounded w-24"></div>
              <div className="h-6 bg-neutral-200 rounded-full w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8">
      <h1 className="text-3xl font-bold mb-8">My Applications</h1>

      {applications.length === 0 ? (
        <div className="card py-16 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-bold text-neutral-900 mb-2">No applications yet!</h2>
          <p className="text-neutral-500 mb-6">Start browsing jobs and apply to see them here.</p>
          <Link
            to="/jobs"
            className="btn-primary"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden border-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Role & Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Date Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  AI Match
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <React.Fragment key={app._id}>
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-neutral-900">
                          {app.job?.title || "Job Unavailable"}
                        </span>
                        <span className="text-sm text-neutral-500">
                          {app.job?.company?.name || "Unknown Company"}
                        </span>
                        {app.aiInsights && app.aiInsights.matchScore > 0 && (
                          <button
                            onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                            className="text-primary-600 font-medium text-xs text-left mt-1 hover:text-primary-700 transition-colors"
                          >
                            {expandedId === app._id ? "Hide Feedback" : "View AI Feedback"}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {app.aiInsights && app.aiInsights.matchScore > 0 ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${app.aiInsights.matchScore > 75 ? 'bg-success-500' : app.aiInsights.matchScore > 50 ? 'bg-warning-500' : 'bg-danger-500'}`}
                              style={{ width: `${app.aiInsights.matchScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{app.aiInsights.matchScore}%</span>
                        </div>
                      ) : (
                        <span className="text-sm text-neutral-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/jobs/${app.job?._id}`}
                        className="text-primary-600 hover:text-primary-800 transition-colors"
                      >
                        View Job
                      </Link>
                    </td>
                  </tr>

                  {/* Expandable Row for Candidate AI Feedback */}
                  {expandedId === app._id && app.aiInsights && (
                    <tr className="bg-primary-50/50 border-b border-neutral-100">
                      <td colSpan={5} className="px-6 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
                          <div>
                            <h4 className="font-semibold text-success-700 mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              Why you're a good fit
                            </h4>
                            <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1.5">
                              {app.aiInsights.strengths?.length > 0 ? (
                                app.aiInsights.strengths.map((s, i) => <li key={i}>{s}</li>)
                              ) : (
                                <li className="text-neutral-500 list-none">No specific strengths identified.</li>
                              )}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-danger-700 mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                              Skills to improve
                            </h4>
                            <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1.5">
                              {app.aiInsights.missingSkills?.length > 0 ? (
                                app.aiInsights.missingSkills.map((m, i) => <li key={i}>{m}</li>)
                              ) : app.aiInsights.weaknesses?.length > 0 ? (
                                app.aiInsights.weaknesses.map((w, i) => <li key={i}>{w}</li>)
                              ) : (
                                <li className="text-neutral-500 list-none">No missing skills identified!</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
