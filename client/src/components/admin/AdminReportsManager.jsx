import { useState } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Copy,
  Edit3,
  UserCheck,
  AlertTriangle,
  Loader2,
  Zap,
  CheckCircle2,
} from 'lucide-react';

const STATUS_FILTERS = [
  { id: 'All', label: 'All Reports' },
  { id: 'reported', label: 'New Reported' },
  { id: 'verified', label: 'Under Review' },
  { id: 'assigned', label: 'Assigned' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'pending_confirmation', label: 'Pending Verification' },
  { id: 'resolved', label: 'Resolved' },
];

const STATUS_CONFIG = {
  reported: { label: 'Reported', badge: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  verified: { label: 'Under Review', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
  assigned: { label: 'Crew Assigned', badge: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  in_progress: { label: 'Work in Progress', badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  pending_confirmation: { label: 'Pending Verification', badge: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  resolved: { label: 'Resolved & Verified', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  reopened: { label: 'Reopened', badge: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
};

const SEVERITY_CONFIG = {
  critical: { label: 'Critical', badge: 'bg-red-50 text-red-700 border-red-200', icon: '🔴' },
  high: { label: 'High', badge: 'bg-orange-50 text-orange-700 border-orange-200', icon: '🟠' },
  medium: { label: 'Medium', badge: 'bg-amber-50 text-amber-700 border-amber-200', icon: '🟡' },
  low: { label: 'Low', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '🟢' },
};

export default function AdminReportsManager({
  issues = [],
  loading,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  severityFilter,
  onSeverityChange,
  onOpenStatusModal,
  onAutoDispatchSingle,
  onBatchAutoDispatch,
  isDispatching,
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [dispatchingIssueId, setDispatchingIssueId] = useState(null);

  const unassignedCount = issues.filter((i) =>
    ['reported', 'verified', 'reopened'].includes(i.status)
  ).length;

  const handleCopy = (e, id) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSingleAutoDispatch = async (e, issueId) => {
    e.stopPropagation();
    if (!onAutoDispatchSingle) return;
    setDispatchingIssueId(issueId);
    try {
      await onAutoDispatchSingle(issueId);
    } finally {
      setDispatchingIssueId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Toolbar & Smart Auto-Dispatch Button */}
      <div className="bg-white rounded-3xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center justify-between gap-4 flex-wrap">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Ticket #, street address, or category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <Filter size={14} className="text-slate-400 shrink-0 ml-1" />
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Severity Selector */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-slate-400" />
          <select
            value={severityFilter}
            onChange={(e) => onSeverityChange(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700 cursor-pointer focus:outline-none"
          >
            <option value="All">All Severities</option>
            <option value="critical">🔴 Critical</option>
            <option value="high">🟠 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        {/* Smart Batch Auto-Dispatch Queue Button */}
        {onBatchAutoDispatch && unassignedCount > 0 && (
          <button
            type="button"
            onClick={onBatchAutoDispatch}
            disabled={isDispatching}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isDispatching ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Zap size={14} className="text-amber-200" />
            )}
            <span>Auto-Dispatch Queue ({unassignedCount})</span>
          </button>
        )}
      </div>

      {/* Reports Feed */}
      {loading && issues.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
          <Loader2 size={40} className="text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-600 font-bold">Synchronizing city reports...</p>
        </div>
      ) : issues.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
          <AlertTriangle size={36} className="text-slate-400 mx-auto mb-3" />
          <h3 className="font-primary text-base font-bold text-slate-800 mb-1">No reports found</h3>
          <p className="text-xs text-slate-500 mb-0">No complaints match your current search and filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => {
            const statusCfg = STATUS_CONFIG[issue.status] || {
              label: issue.status,
              badge: 'bg-slate-100 text-slate-700',
              dot: 'bg-slate-400',
            };
            const severityCfg = SEVERITY_CONFIG[issue.severity] || {
              label: issue.severity || 'Normal',
              badge: 'bg-slate-100 text-slate-700',
              icon: '🟡',
            };
            const isUnassigned = ['reported', 'verified', 'reopened'].includes(issue.status);

            return (
              <div
                key={issue._id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all flex items-start justify-between gap-6 max-md:flex-col"
              >
                <div className="flex-1 min-w-0">
                  {/* Badges Ribbon */}
                  <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                    <div
                      onClick={(e) => handleCopy(e, issue.ticketId || issue._id)}
                      title="Copy Ticket ID"
                      className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg hover:bg-emerald-100 cursor-pointer"
                    >
                      <span>#{issue.ticketId || issue._id.substring(0, 8)}</span>
                      <Copy size={12} className="text-emerald-600" />
                      {copiedId === (issue.ticketId || issue._id) && (
                        <span className="text-[10px] text-emerald-700 font-sans font-bold">Copied!</span>
                      )}
                    </div>

                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${statusCfg.badge}`}>
                      <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                      {statusCfg.label}
                    </span>

                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${severityCfg.badge}`}>
                      <span>{severityCfg.icon}</span> {severityCfg.label}
                    </span>

                    {issue.recurrenceCount > 1 && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        🔄 {issue.recurrenceCount} Combined Filings
                      </span>
                    )}

                    <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto max-sm:ml-0">
                      <Calendar size={12} />
                      {new Date(issue.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-primary text-base font-bold text-slate-900 mb-1 leading-snug">
                    {issue.title}
                  </h3>
                  <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>

                  {/* Location & Metadata */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1 font-medium text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                      <MapPin size={13} className="text-red-500 shrink-0" />
                      <span className="truncate max-w-[280px]">
                        {issue.address || (issue.location?.coordinates ? `GPS [${issue.location.coordinates[0]?.toFixed(3)}, ${issue.location.coordinates[1]?.toFixed(3)}]` : 'City Center Zone')}
                      </span>
                    </span>

                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold uppercase text-slate-700">
                      {issue.category}
                    </span>

                    {issue.assignedWorker?.name && (
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1">
                        <UserCheck size={13} />
                        Assigned: {issue.assignedWorker.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Triggers: Auto-Assign & Manual Modal */}
                <div className="shrink-0 max-md:w-full flex items-center gap-2 flex-wrap">
                  {isUnassigned && onAutoDispatchSingle && (
                    <button
                      type="button"
                      onClick={(e) => handleSingleAutoDispatch(e, issue._id)}
                      disabled={dispatchingIssueId === issue._id}
                      className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                      title="Auto-Assign using Smart Priority Queue"
                    >
                      {dispatchingIssueId === issue._id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Zap size={13} />
                      )}
                      <span>⚡ Auto-Assign</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => onOpenStatusModal(e, issue)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Edit3 size={14} />
                    <span>Update Status & Dispatch</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
