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
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "shortlisted":
        return (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
            Shortlisted
          </span>
        );
      case "accepted":
        return (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-500">Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8">
      <h1 className="text-3xl font-bold mb-8">My Applications</h1>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-medium text-gray-700">No applications yet!</h2>
          <p className="text-gray-500 mt-2">Start browsing jobs and apply to see them here.</p>
          <Link
            to="/jobs"
            className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AI Match
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <React.Fragment key={app._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {app.job?.title || "Job Unavailable"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {app.job?.company?.name || "Unknown Company"}
                        </span>
                        {app.aiInsights && app.aiInsights.matchScore > 0 && (
                          <button
                            onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                            className="text-indigo-600 text-xs text-left mt-1 hover:underline"
                          >
                            {expandedId === app._id ? "Hide Feedback" : "View AI Feedback"}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {app.aiInsights && app.aiInsights.matchScore > 0 ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${app.aiInsights.matchScore > 75 ? 'bg-green-500' : app.aiInsights.matchScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${app.aiInsights.matchScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{app.aiInsights.matchScore}%</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/jobs/${app.job?._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Job
                      </Link>
                    </td>
                  </tr>

                  {/* Expandable Row for Candidate AI Feedback */}
                  {expandedId === app._id && app.aiInsights && (
                    <tr className="bg-indigo-50/30 border-b border-gray-100">
                      <td colSpan={5} className="px-6 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
                          <div>
                            <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              Why you're a good fit
                            </h4>
                            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1.5">
                              {app.aiInsights.strengths?.length > 0 ? (
                                app.aiInsights.strengths.map((s, i) => <li key={i}>{s}</li>)
                              ) : (
                                <li className="text-gray-500 list-none">No specific strengths identified.</li>
                              )}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                              Skills to improve
                            </h4>
                            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1.5">
                              {app.aiInsights.missingSkills?.length > 0 ? (
                                app.aiInsights.missingSkills.map((m, i) => <li key={i}>{m}</li>)
                              ) : app.aiInsights.weaknesses?.length > 0 ? (
                                app.aiInsights.weaknesses.map((w, i) => <li key={i}>{w}</li>)
                              ) : (
                                <li className="text-gray-500 list-none">No missing skills identified!</li>
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
