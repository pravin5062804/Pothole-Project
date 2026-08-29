import { useState, useEffect } from 'react';
import {
  Search,
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Calendar,
  ArrowRight,
  Filter,
  Loader2,
  RefreshCw,
  Sparkles,
  Vote,
} from 'lucide-react';
import { issueApi } from '../api/issueApi';

const STATUS_FILTERS = ['All', 'reported', 'verified', 'assigned', 'in_progress', 'pending_confirmation', 'resolved'];

const STATUS_CONFIG = {
  reported: { label: 'Reported', color: 'bg-purple-100 text-purple-700', progress: 15 },
  verified: { label: 'Verified', color: 'bg-indigo-100 text-indigo-700', progress: 30 },
  assigned: { label: 'Assigned', color: 'bg-blue-100 text-blue-700', progress: 45 },
  in_progress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700', progress: 65 },
  pending_confirmation: { label: 'Pending Verification', color: 'bg-orange-100 text-orange-700', progress: 85 },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-700', progress: 100 },
  reopened: { label: 'Reopened / Disputed', color: 'bg-red-100 text-red-700', progress: 40 },
};

export default function TrackIssuePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [votingIssueId, setVotingIssueId] = useState(null);
  const [voteSuccess, setVoteSuccess] = useState('');

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (activeFilter !== 'All') params.status = activeFilter;

      const data = await issueApi.getIssues(params);
      if (data && data.issues) {
        setIssues(data.issues);
      }
    } catch (err) {
      console.warn('Could not fetch from server API. Using local state.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchIssues();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeFilter]);

  const handleVote = async (e, issueId, voteType) => {
    e.stopPropagation();
    try {
      setVotingIssueId(issueId);
      const res = await issueApi.submitVote(issueId, {
        vote: voteType,
        voterName: 'Citizen Verifier',
      });
      setVoteSuccess(`Vote '${voteType}' recorded! Status: ${res.issueStatus}`);
      fetchIssues();
      setTimeout(() => setVoteSuccess(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Voting failed. Please try again.');
    } finally {
      setVotingIssueId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm text-white/90 font-medium mb-4">
            <Search size={16} />
            Track Your Reports
          </div>
          <h1 className="font-primary text-4xl max-md:text-3xl font-extrabold text-white mb-3">
            Track an Issue
          </h1>
          <p className="text-white/80 text-lg max-w-[600px]">
            Enter your report ID or search by keywords to check the current status and real-time lifecycle of your reported issues.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-[640px]">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Report ID (e.g., CR-2026-4521) or address keywords..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm bg-white shadow-xl border-0 focus:outline-none focus:ring-2 focus:ring-green-300 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 -mt-4 pb-20">
        {/* Filters */}
        <div className="flex items-center justify-between gap-3 mb-6 overflow-x-auto pb-2">
          <div className="flex items-center gap-3">
            <Filter size={16} className="text-gray-400 shrink-0" />
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer capitalize ${
                  activeFilter === filter
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {filter.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            onClick={fetchIssues}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {voteSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600" />
            <span>{voteSuccess}</span>
          </div>
        )}

        {/* Issues List */}
        <div className="space-y-4">
          {loading && issues.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
              <Loader2 size={36} className="text-green-600 animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">Fetching real-time civic issues...</p>
            </div>
          ) : issues.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
              <AlertTriangle size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="font-primary text-lg font-bold text-gray-700 mb-2">No issues found</h3>
              <p className="text-sm text-gray-500">
                Submit a new report from the "Report Issue" page to see it live here!
              </p>
            </div>
          ) : (
            issues.map((issue) => {
              const statusCfg = STATUS_CONFIG[issue.status] || {
                label: issue.status,
                color: 'bg-gray-100 text-gray-700',
                progress: 20,
              };
              const isSelected = selectedIssue === issue._id;

              return (
                <div
                  key={issue._id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                  onClick={() => setSelectedIssue(isSelected ? null : issue._id)}
                >
                  <div className="flex items-start justify-between gap-4 max-sm:flex-col">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                        <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-md">
                          #{issue.ticketId || issue._id.substring(0, 8)}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusCfg.color}`}
                        >
                          {statusCfg.label}
                        </span>
                        {issue.recurrenceCount > 1 && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                            🔄 {issue.recurrenceCount} Duplicate Reports Merged
                          </span>
                        )}
                        {issue.aiClassification?.label && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                            <Sparkles size={11} />
                            AI: {issue.aiClassification.label} ({Math.round((issue.aiClassification.confidence || 0.8) * 100)}%)
                          </span>
                        )}
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(issue.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="font-primary text-base font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
                        {issue.title}
                      </h3>

                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{issue.description}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1 text-xs">
                          <MapPin size={14} className="text-red-500" />
                          {issue.address || (issue.location?.coordinates ? `[${issue.location.coordinates[0]?.toFixed(3)}, ${issue.location.coordinates[1]?.toFixed(3)}]` : 'City Central')}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium uppercase text-gray-600">
                          {issue.category}
                        </span>
                        <span className="text-xs font-semibold text-gray-600">
                          Priority Score: <span className="text-green-700 font-bold">{issue.priorityScore || 10}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 max-sm:w-full max-sm:justify-between">
                      <div className="text-right">
                        <p className="text-xs text-gray-400 mb-1">Lifecycle</p>
                        <p className="text-lg font-bold text-gray-900">{statusCfg.progress}%</p>
                      </div>
                      <ArrowRight
                        size={18}
                        className="text-gray-400 group-hover:text-green-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        statusCfg.progress === 100 ? 'bg-green-500' : 'bg-green-400'
                      }`}
                      style={{ width: `${statusCfg.progress}%` }}
                    />
                  </div>

                  {/* Expanded Timeline & Verification Voting */}
                  {isSelected && (
                    <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in-up">
                      {/* Attached Photos */}
                      {issue.photos && issue.photos.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-600 mb-2">Reported Photo Evidence:</p>
                          <div className="flex gap-2 flex-wrap">
                            {issue.photos.map((p, i) => (
                              <img
                                key={i}
                                src={p.url || p}
                                alt="Report Evidence"
                                className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Community Resolution Verification Prompt */}
                      {issue.status === 'pending_confirmation' && (
                        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Vote size={18} className="text-amber-700" />
                            <h4 className="text-sm font-bold text-amber-900">
                              Community Resolution Verification Required
                            </h4>
                          </div>
                          <p className="text-xs text-amber-800 mb-3">
                            The repair crew marked this issue as resolved. As a citizen or local resident, please confirm if the issue is properly fixed or dispute if the problem persists.
                          </p>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              disabled={votingIssueId === issue._id}
                              onClick={(e) => handleVote(e, issue._id, 'confirm')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors cursor-pointer"
                            >
                              👍 Confirm Fixed
                            </button>
                            <button
                              type="button"
                              disabled={votingIssueId === issue._id}
                              onClick={(e) => handleVote(e, issue._id, 'dispute')}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
                            >
                              👎 Dispute Fix (Reopen)
                            </button>
                          </div>
                        </div>
                      )}

                      <h4 className="font-primary text-sm font-bold text-gray-700 mb-4">
                        Status Timeline
                      </h4>

                      <div className="space-y-4">
                        {(issue.timeline && issue.timeline.length > 0
                          ? issue.timeline
                          : [
                              {
                                status: 'reported',
                                updatedByName: 'Citizen Reporter',
                                note: 'Issue report received and logged.',
                                timestamp: issue.createdAt,
                              },
                            ]
                        ).map((t, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-green-500 text-white">
                                <CheckCircle size={14} />
                              </div>
                              {i < (issue.timeline?.length || 1) - 1 && (
                                <div className="w-0.5 h-8 bg-green-300" />
                              )}
                            </div>
                            <div className="-mt-0.5">
                              <p className="text-sm font-semibold text-gray-800 capitalize">
                                {t.status?.replace('_', ' ')}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(t.timestamp || Date.now()).toLocaleString()} &bull; by {t.updatedByName || 'System'}
                              </p>
                              {t.note && <p className="text-xs text-gray-500 mt-0.5">{t.note}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
