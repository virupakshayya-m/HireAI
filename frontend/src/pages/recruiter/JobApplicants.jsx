import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getJobApplicants, updateApplicationStatus } from "@/services/applicationService";

const JobApplicants = () => {
  const { id } = useParams(); // This is the jobId from the URL
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchApplicants = async () => {
    try {
      setIsLoading(true);
      const data = await getJobApplicants(id);
      setApplicants(data.applications || []);
    } catch (error) {
      toast.error(error.message || "Failed to load applicants");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      toast.success(`Status updated to ${newStatus}`);

      // Update the UI locally without needing a full page refresh
      setApplicants((prevApplicants) =>
        prevApplicants.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  // Helper function to render colored badges based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case "shortlisted":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Shortlisted</span>;
      case "accepted":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Accepted</span>;
      case "rejected":
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 mt-8">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 bg-slate-200 rounded w-64 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="card overflow-hidden">
          <div className="h-12 bg-slate-100 border-b border-slate-200 animate-pulse"></div>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 border-b border-slate-100 bg-white animate-pulse p-4 flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-5 bg-slate-200 rounded w-48"></div>
                <div className="h-4 bg-slate-200 rounded w-32"></div>
              </div>
              <div className="h-4 bg-slate-200 rounded w-24"></div>
              <div className="h-4 bg-slate-200 rounded w-32"></div>
              <div className="h-6 bg-slate-200 rounded-full w-20"></div>
              <div className="h-10 bg-slate-200 rounded-lg w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Applicants</h1>
        <Link
          to="/recruiter/dashboard"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      {applicants.length === 0 ? (
        <div className="card py-16 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">No applicants yet.</h2>
          <p className="text-slate-500 max-w-md mx-auto">When candidates apply for this job, they will appear here.</p>
        </div>
      ) : (
        <div className="card overflow-hidden border-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AI Match</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Update Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicants.map((app) => (
                <React.Fragment key={app._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{app.candidate?.name || "Unknown"}</span>
                        <span className="text-sm text-gray-500">{app.candidate?.email || "No Email"}</span>
                        {app.aiInsights && app.aiInsights.matchScore > 0 && (
                          <button
                            onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                            className="text-blue-600 font-medium text-xs text-left mt-1 hover:text-blue-700 transition-colors"
                          >
                            {expandedId === app._id ? "Hide AI Insights" : "View AI Insights"}
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
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="input py-1.5 px-3 bg-slate-50 text-sm font-medium min-w-[140px]"
                      >
                        <option value="pending">Pending</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                  
                  {/* Expandable Row for AI Insights */}
                  {expandedId === app._id && app.aiInsights && (
                    <tr className="bg-blue-50/50 border-b border-slate-100">
                      <td colSpan={5} className="px-6 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">AI Summary</h4>
                            <p className="text-sm text-gray-700 leading-relaxed mb-4">{app.aiInsights.summary}</p>
                            
                            <h4 className="font-semibold text-gray-900 mb-2 mt-4">Suggested Interview Questions</h4>
                            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                              {app.aiInsights.interviewQuestions?.map((q, i) => (
                                <li key={i}>{q}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
                              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                                {app.aiInsights.strengths?.map((s, i) => (
                                  <li key={i}>{s}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-red-700 mb-2">Weaknesses / Missing</h4>
                              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                                {app.aiInsights.weaknesses?.map((w, i) => (
                                  <li key={i}>{w}</li>
                                ))}
                                {app.aiInsights.missingSkills?.map((m, i) => (
                                  <li key={`ms-${i}`}>Missing: {m}</li>
                                ))}
                              </ul>
                            </div>
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

export default JobApplicants;
