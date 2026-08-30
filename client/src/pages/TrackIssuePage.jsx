import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ShieldCheck,
  Activity,
  Layers,
  CheckCircle2,
  X,
  ChevronDown,
  Copy,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Flame,
  FileText,
  UserCheck,
  Eye,
  User,
  Globe,
  PlusCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { issueApi } from '../api';
import { useAuth } from '../context/AuthContext';
import CommunityVerificationSection from '../components/tracking/CommunityVerificationSection';
import { getSocket } from '../services/socketService';

const STATUS_FILTERS = [
  { id: 'All', label: 'All Issues' },
  { id: 'reported', label: 'Reported' },
  { id: 'verified', label: 'Under Review' },
  { id: 'assigned', label: 'Crew Assigned' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'pending_confirmation', label: 'Pending Verification' },
  { id: 'resolved', label: 'Resolved' },
];

const STATUS_CONFIG = {
  reported: {
    label: 'Reported',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    progress: 15,
    dot: 'bg-purple-500',
  },
  verified: {
    label: 'Under Review',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    progress: 35,
    dot: 'bg-indigo-500',
  },
  assigned: {
    label: 'Crew Assigned',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    progress: 55,
    dot: 'bg-blue-500',
  },
  in_progress: {
    label: 'Work in Progress',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    progress: 75,
    dot: 'bg-amber-500',
  },
  pending_confirmation: {
    label: 'Pending Verification',
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
    progress: 90,
    dot: 'bg-orange-500',
  },
  resolved: {
    label: 'Resolved & Verified',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    progress: 100,
    dot: 'bg-emerald-500',
  },
  reopened: {
    label: 'Reopened by Citizen',
    badge: 'bg-red-50 text-red-700 border-red-200',
    progress: 40,
    dot: 'bg-red-500',
  },
};

export default function TrackIssuePage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [trackingScope, setTrackingScope] = useState('my_issues'); // 'my_issues' | 'all_issues'
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [votingIssueId, setVotingIssueId] = useState(null);
  const [voteSuccess, setVoteSuccess] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

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

    // Subscribe to real-time status updates via Socket.IO
    const socket = getSocket();
    const handleStatusUpdate = (data) => {
      console.log('⚡ [Socket.IO] Live issue update received:', data);
      fetchIssues();
    };

    if (socket) {
      socket.on('issue_status_updated', handleStatusUpdate);
      socket.on('new_issue_created', handleStatusUpdate);
    }

    return () => {
      clearTimeout(timer);
      if (socket) {
        socket.off('issue_status_updated', handleStatusUpdate);
        socket.off('new_issue_created', handleStatusUpdate);
      }
    };
  }, [searchQuery, activeFilter]);

  const handleCopy = (e, id) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Compute Citizen's My Reported Issues
  const mySavedTickets = (() => {
    try {
      return JSON.parse(localStorage.getItem('my_civic_tickets') || '[]');
    } catch (e) {
      return [];
    }
  })();

  const myIssues = issues.filter((issue) => {
    const ticketId = issue.ticketId || '';
    const id = issue._id || '';

    // Check if in citizen local history
    if (mySavedTickets.includes(ticketId) || mySavedTickets.includes(id)) return true;

    // Check if logged-in user matches reporter
    if (
      user &&
      issue.reporters?.some(
        (r) =>
          (r.user && r.user === user._id) ||
          (user.email && r.email?.toLowerCase() === user.email?.toLowerCase()) ||
          (user.name && r.name?.toLowerCase() === user.name?.toLowerCase())
      )
    ) {
      return true;
    }

    return false;
  });

  // Decide active issues list based on trackingScope (unless actively searching a query)
  const displayedIssues =
    searchQuery.trim()
      ? issues
      : trackingScope === 'my_issues'
      ? myIssues
      : issues;

  // Quick stats
  const totalCount = issues.length;
  const inProgressCount = issues.filter((i) =>
    ['in_progress', 'assigned', 'verified'].includes(i.status)
  ).length;
  const resolvedCount = issues.filter((i) => i.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Header Banner with Urban Civic Landscape */}
      <div className="relative overflow-hidden bg-slate-900 text-white pt-12 pb-28 px-6 shadow-lg border-b border-emerald-900/30">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1600&q=80&auto=format"
            alt="City Infrastructure"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.7] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-900/90 to-slate-950/90" />
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        {/* Ambient Glow Orbs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-emerald-500 blur-3xl pointer-events-none z-0"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-teal-500 blur-3xl pointer-events-none z-0"
        />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-100 mb-4 shadow-xs">
                <Activity size={14} className="text-emerald-300" />
                Live Citizen Resolution Tracker
              </div>
              <h1 className="font-primary text-4xl max-md:text-3xl font-black text-white mb-3 tracking-tight leading-tight">
                Track My Civic Reports
              </h1>
              <p className="text-emerald-100/90 text-base max-w-[580px] leading-relaxed mb-6">
                Check real-time repair progress of complaints you reported, verify field completion evidence, and monitor city work orders.
              </p>

              {/* Search Bar with Glassmorphic Style */}
              <div className="relative group max-w-[560px]">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Ticket ID (e.g. CR-2026-4521) or street name..."
                  className="w-full pl-12 pr-12 py-4 rounded-2xl text-sm bg-white/95 backdrop-blur-md text-slate-800 shadow-2xl border border-white/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all placeholder:text-slate-400 font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Right Live Stats Counters */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="grid grid-cols-2 gap-3.5"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 transition-all hover:bg-white/15">
                <p className="text-xs text-emerald-200 font-medium mb-1">My Filed Reports</p>
                <p className="font-primary text-2xl font-black text-white">{myIssues.length}</p>
                <p className="text-[11px] text-emerald-100/70 mt-1">Filed from this account</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 transition-all hover:bg-white/15">
                <p className="text-xs text-amber-200 font-medium mb-1">In-Progress Repairs</p>
                <p className="font-primary text-2xl font-black text-amber-300">{inProgressCount}</p>
                <p className="text-[11px] text-emerald-100/70 mt-1">Field teams scheduled</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 transition-all hover:bg-white/15">
                <p className="text-xs text-emerald-200 font-medium mb-1">Resolved & Confirmed</p>
                <p className="font-primary text-2xl font-black text-emerald-400">{resolvedCount}</p>
                <p className="text-[11px] text-emerald-100/70 mt-1">Verified fixed by residents</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 transition-all hover:bg-white/15">
                <p className="text-xs text-cyan-200 font-medium mb-1">Avg. Fix Time</p>
                <p className="font-primary text-2xl font-black text-cyan-300">~2 mins</p>
                <p className="text-[11px] text-emerald-100/70 mt-1">Demo fast turnaround</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="max-w-[1200px] mx-auto px-6 -mt-10 relative z-20">
        {/* Scope Toggle: My Issues vs All Issues */}
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-md flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTrackingScope('my_issues')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                trackingScope === 'my_issues'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <User size={14} />
              <span>My Filed Reports ({myIssues.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setTrackingScope('all_issues')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                trackingScope === 'all_issues'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Globe size={14} />
              <span>Citywide Incidents ({issues.length})</span>
            </button>
          </div>

          <Link
            to="/report"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-green-700 transition-all cursor-pointer"
          >
            <PlusCircle size={14} />
            <span>Report New Issue</span>
          </Link>
        </div>

        {/* Filters and Controls Card */}
        <div className="bg-white rounded-3xl p-4 shadow-xl shadow-slate-200/60 border border-slate-100 flex items-center justify-between gap-4 mb-6 overflow-x-auto">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <Filter size={16} className="text-slate-400 shrink-0 ml-2 mr-1" />
            {STATUS_FILTERS.map((filter) => {
              const isSelected = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={fetchIssues}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs shrink-0 cursor-pointer"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin text-emerald-600' : 'text-slate-500'} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Voting Success Alert */}
        <AnimatePresence>
          {voteSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-5 py-3.5 rounded-2xl flex items-center gap-3 shadow-xs"
            >
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span className="font-semibold">{voteSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Issues Feed List */}
        <div className="space-y-5">
          {loading && displayedIssues.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
              <Loader2 size={40} className="text-emerald-600 animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-600 font-bold">Loading civic reports...</p>
              <p className="text-xs text-slate-400 mt-1">Connecting to live updates</p>
            </div>
          ) : displayedIssues.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-xl shadow-slate-200/40">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <User size={30} />
              </div>
              <h3 className="font-primary text-xl font-bold text-slate-900 mb-1.5">
                {trackingScope === 'my_issues'
                  ? 'No Reports Filed Yet'
                  : 'No Matching Issues Found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-[440px] mx-auto mb-6 leading-relaxed">
                {trackingScope === 'my_issues'
                  ? 'You have not reported any civic issues yet. Report a pothole, drainage overflow, or broken streetlight to track real-time resolution updates here.'
                  : "We couldn't find any issues matching your search criteria."}
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link
                  to="/report"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl text-xs font-bold hover:from-emerald-700 hover:to-green-700 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <PlusCircle size={15} />
                  <span>Report an Issue Now</span>
                </Link>
                {trackingScope === 'my_issues' && issues.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setTrackingScope('all_issues')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-2xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Globe size={15} />
                    <span>Browse Citywide Incidents ({issues.length})</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            displayedIssues.map((issue) => {
              const statusCfg = STATUS_CONFIG[issue.status] || {
                label: issue.status,
                badge: 'bg-slate-100 text-slate-700',
                progress: 20,
                dot: 'bg-slate-400',
              };
              const isSelected = selectedIssue === issue._id;

              return (
                <motion.div
                  layout
                  key={issue._id}
                  onClick={() => setSelectedIssue(isSelected ? null : issue._id)}
                  className={`bg-white rounded-3xl p-6 border transition-all duration-200 cursor-pointer group ${
                    isSelected
                      ? 'border-emerald-500 shadow-xl shadow-emerald-950/5 ring-2 ring-emerald-500/20'
                      : 'border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50'
                  }`}
                >
                  {/* Card Header & Ribbon */}
                  <div className="flex items-start justify-between gap-4 max-md:flex-col">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                        {/* Ticket Badge with Copy Button */}
                        <div
                          onClick={(e) => handleCopy(e, issue.ticketId || issue._id)}
                          title="Click to copy Ticket ID"
                          className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <span>#{issue.ticketId || issue._id.substring(0, 8)}</span>
                          <Copy size={12} className="text-emerald-600" />
                          {copiedId === (issue.ticketId || issue._id) && (
                            <span className="text-[10px] text-emerald-700 font-sans font-bold">
                              Copied!
                            </span>
                          )}
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${statusCfg.badge}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                          {statusCfg.label}
                        </span>

                        {/* Severity Badge */}
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                            issue.severity === 'critical'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : issue.severity === 'high'
                              ? 'bg-orange-50 text-orange-700 border-orange-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {issue.severity?.toUpperCase()} SEVERITY
                        </span>

                        {/* Recurrence count badge */}
                        {issue.recurrenceCount > 1 && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <span>👥</span>
                            <span>{issue.recurrenceCount} Neighbors Reported</span>
                          </span>
                        )}

                        {/* Timestamp */}
                        <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto max-sm:ml-0">
                          <Calendar size={12} />
                          {new Date(issue.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-primary text-lg font-bold text-slate-900 mb-1.5 group-hover:text-emerald-700 transition-colors leading-snug">
                        {issue.title}
                      </h3>
                      <p className="text-xs text-slate-600 mb-3.5 line-clamp-2 leading-relaxed">
                        {issue.description}
                      </p>

                      {/* Metadata Chips */}
                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1 font-medium text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                          <MapPin size={13} className="text-red-500 shrink-0" />
                          <span className="truncate max-w-[280px]">
                            {issue.address ||
                              (issue.location?.coordinates
                                ? `Near [${issue.location.coordinates[0]?.toFixed(
                                    3
                                  )}, ${issue.location.coordinates[1]?.toFixed(3)}]`
                                : 'City Center Area')}
                          </span>
                        </span>
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold uppercase text-slate-700">
                          {issue.category}
                        </span>

                        {/* Estimated SLA Resolution Time Badge */}
                        <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50/90 font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
                          <Clock size={12} className="text-emerald-600 shrink-0" />
                          <span>
                            Est. Fix Time:{' '}
                            {issue.severity === 'critical'
                              ? '1–2 Minutes'
                              : '2–5 Minutes'}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex flex-col items-end justify-between max-md:items-start max-md:w-full max-md:pt-2 max-md:border-t max-md:border-slate-100">
                      <div className="text-right max-md:text-left mb-2">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Progress
                        </p>
                        <p className="text-xl font-black text-slate-900">
                          {statusCfg.progress}%
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <span>{isSelected ? 'Hide Details' : 'View Timeline'}</span>
                        <ChevronDown
                          size={14}
                          className={`transform transition-transform ${
                            isSelected ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="mt-5 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full transition-all duration-500 ${
                        statusCfg.progress === 100
                          ? 'bg-emerald-500'
                          : statusCfg.progress > 60
                          ? 'bg-emerald-600'
                          : 'bg-emerald-400'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${statusCfg.progress}%` }}
                    />
                  </div>

                  {/* Expanded Detail Panel & Citizen Confirmation */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 pt-6 border-t border-slate-100 overflow-hidden"
                      >
                        {/* Evidence Photo Gallery */}
                        {issue.photos && issue.photos.length > 0 && (
                          <div className="mb-6">
                            <p className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
                              <FileText size={14} className="text-emerald-600" />
                              Attached Photos:
                            </p>
                            <div className="flex gap-3 flex-wrap">
                              {issue.photos.map((p, i) => {
                                const photoUrl = p.url || p;
                                return (
                                  <div
                                    key={i}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPreviewImage(photoUrl);
                                    }}
                                    className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-xs cursor-zoom-in group/img"
                                  >
                                    <img
                                      src={photoUrl}
                                      alt="Report Evidence"
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition-opacity">
                                      <Eye size={18} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Citizen Community Verification & Dispute Section */}
                        <CommunityVerificationSection
                          issue={issue}
                          onVoteSuccess={fetchIssues}
                        />

                        {/* Progress Timeline */}
                        <div>
                          <h4 className="font-primary text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <ShieldCheck size={16} className="text-emerald-600" />
                            Official Resolution Timeline
                          </h4>

                          <div className="space-y-4 relative pl-3">
                            {(issue.timeline && issue.timeline.length > 0
                              ? issue.timeline
                              : [
                                  {
                                    status: 'reported',
                                    updatedByName: 'Citizen Reporter',
                                    note: 'Issue reported and recorded in municipal system.',
                                    timestamp: issue.createdAt,
                                  },
                                ]
                            ).map((t, i, arr) => (
                              <div key={i} className="flex items-start gap-3 relative">
                                <div className="flex flex-col items-center">
                                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-emerald-600 text-white shadow-xs">
                                    <CheckCircle size={15} />
                                  </div>
                                  {i < arr.length - 1 && (
                                    <div className="w-0.5 h-10 bg-emerald-200 mt-1" />
                                  )}
                                </div>
                                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 flex-1 -mt-1">
                                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                                    <p className="text-xs font-bold text-slate-900 capitalize">
                                      {t.status?.replace('_', ' ')}
                                    </p>
                                    <span className="text-[11px] text-slate-400">
                                      {new Date(t.timestamp || Date.now()).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500">
                                    Updated by{' '}
                                    <span className="font-semibold text-slate-700">
                                      {t.updatedByName || 'Municipal System'}
                                    </span>
                                  </p>
                                  {t.note && (
                                    <p className="text-xs text-slate-600 mt-1.5 bg-white p-2 rounded-xl border border-slate-100">
                                      "{t.note}"
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs cursor-pointer"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full max-h-[85vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl p-2"
            >
              <img
                src={previewImage}
                alt="Enlarged preview"
                className="w-full h-full max-h-[80vh] object-contain rounded-2xl"
              />
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
