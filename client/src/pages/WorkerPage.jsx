import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  MapPin,
  Camera,
  Play,
  Calendar,
  AlertCircle,
  RefreshCw,
  Lock,
  LogOut,
  ChevronRight,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
  Home,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { issueApi } from '../api';
import WorkerEvidenceModal from '../components/worker/WorkerEvidenceModal';

const STATUS_TABS = [
  { id: 'all', label: 'All Jobs' },
  { id: 'assigned', label: 'Assigned & Queued' },
  { id: 'in_progress', label: 'In Progress (On-Site)' },
  { id: 'pending_confirmation', label: 'Pending Verification' },
  { id: 'resolved', label: 'Completed' },
];

export default function WorkerPage() {
  const { user, isAuthenticated, openAuthModal, logout, login } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIssueForEvidence, setSelectedIssueForEvidence] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const isWorker = user && (user.role === 'worker' || user.role === 'admin');

  const fetchWorkerJobs = async () => {
    setLoading(true);
    try {
      const res = await issueApi.getIssues({});
      if (res?.issues) {
        setIssues(res.issues);
      }
    } catch (err) {
      console.warn('Error fetching worker jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isWorker) {
      fetchWorkerJobs();
    }
  }, [isWorker]);

  const handleStartWork = async (issueId) => {
    try {
      await issueApi.updateStatus(
        issueId,
        'in_progress',
        'Field repair team arrived on site. Repair work commenced.'
      );
      setFeedbackMsg('Job marked as In Progress. Safe working!');
      fetchWorkerJobs();
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update job status.');
    }
  };

  const handleDemoWorkerLogin = async () => {
    try {
      setLoading(true);
      await login('worker@gmail.com', 'worker123');
    } catch (err) {
      alert('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Metrics
  const assignedCount = issues.filter((i) => i.status === 'assigned').length;
  const inProgressCount = issues.filter((i) => i.status === 'in_progress').length;
  const pendingCount = issues.filter((i) => i.status === 'pending_confirmation').length;
  const resolvedCount = issues.filter((i) => i.status === 'resolved').length;

  // Filter list by selected tab
  const filteredIssues = issues.filter((issue) => {
    if (activeTab === 'all') return true;
    return issue.status === activeTab;
  });

  // Access Gate for non-workers
  if (!isWorker) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1600&q=80&auto=format"
            alt="Field Worker"
            className="w-full h-full object-cover filter brightness-[0.35] contrast-[1.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-emerald-950/80" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-md w-full bg-slate-900/85 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 text-center shadow-2xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-lg shadow-emerald-950/60">
            <Briefcase size={30} />
          </div>

          <h2 className="font-primary text-2xl font-black text-white mb-2">
            Field Crew Worker Portal
          </h2>
          <p className="text-xs text-slate-300 mb-6 leading-relaxed">
            This portal is exclusively for municipal repair technicians, field crew supervisors, and maintenance teams.
          </p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleDemoWorkerLogin}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Shield size={16} />
              <span>Login as Field Worker (worker@gmail.com)</span>
            </button>

            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="w-full py-3 bg-white/10 hover:bg-white/15 text-white rounded-2xl text-xs font-bold border border-white/15 transition-all cursor-pointer"
            >
              Sign In with Custom Worker Account
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Worker Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs px-6 py-4">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Briefcase size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-primary text-base font-black text-slate-900 leading-tight">
                  Civic<span className="text-emerald-600">Field</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
                  Crew Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Officer: <b className="text-slate-800">{user?.name || 'Field Technician'}</b> ({user?.ward || 'Ward 4'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchWorkerJobs}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin text-emerald-600' : 'text-slate-500'} />
              <span>Refresh Jobs</span>
            </button>

            <Link
              to="/"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all"
            >
              <Home size={13} className="text-slate-500" />
              <span>Public Website</span>
            </Link>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Work Orders Canvas */}
      <main className="max-w-[1240px] mx-auto px-6 py-8 flex-1 w-full">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assigned Queue</span>
            <p className="font-primary text-3xl font-black text-slate-900 mt-1">{assignedCount}</p>
            <span className="text-[10px] text-slate-400">Awaiting technician arrival</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">In Progress</span>
            <p className="font-primary text-3xl font-black text-amber-600 mt-1">{inProgressCount}</p>
            <span className="text-[10px] text-slate-400">On-site repair active</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Under Citizen Review</span>
            <p className="font-primary text-3xl font-black text-orange-600 mt-1">{pendingCount}</p>
            <span className="text-[10px] text-slate-400">Fix proof submitted</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Verified Fixed</span>
            <p className="font-primary text-3xl font-black text-emerald-600 mt-1">{resolvedCount}</p>
            <span className="text-[10px] text-slate-400">Confirmed by citizens</span>
          </div>
        </div>

        {/* Feedback Alert */}
        <AnimatePresence>
          {feedbackMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-5 py-3.5 rounded-2xl flex items-center gap-3 shadow-xs"
            >
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span className="font-semibold">{feedbackMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-2xl p-2 mb-6 border border-slate-200/80 shadow-xs flex items-center gap-1.5 overflow-x-auto">
          {STATUS_TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Job Orders List */}
        {filteredIssues.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
            <CheckCircle2 size={36} className="text-emerald-500 mx-auto mb-2" />
            <h3 className="font-primary text-base font-bold text-slate-800">No work orders in this queue</h3>
            <p className="text-xs text-slate-400 mt-0.5">All tasks in this category are clear or completed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIssues.map((issue) => (
              <div
                key={issue._id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all flex items-start justify-between gap-6 max-md:flex-col"
              >
                <div className="flex-1 min-w-0">
                  {/* Badge Ribbon */}
                  <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                      #{issue.ticketId || issue._id.substring(0, 8)}
                    </span>
                    <span className="text-xs font-bold uppercase bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                      {issue.category}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        issue.status === 'in_progress'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : issue.status === 'pending_confirmation'
                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                          : issue.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {issue.status?.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400 ml-auto max-sm:ml-0 flex items-center gap-1">
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

                  {/* Location & GPS */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1 font-medium text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                      <MapPin size={13} className="text-red-500 shrink-0" />
                      <span className="truncate max-w-[320px]">{issue.address || 'Field Location GPS'}</span>
                    </span>

                    {issue.resolutionEvidence?.length > 0 && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <Camera size={13} />
                        {issue.resolutionEvidence.length} Fix Proof Photos Attached
                      </span>
                    )}
                  </div>
                </div>

                {/* Worker Action Buttons */}
                <div className="shrink-0 max-md:w-full flex flex-col gap-2 min-w-[200px]">
                  {issue.status === 'assigned' && (
                    <button
                      type="button"
                      onClick={() => handleStartWork(issue._id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      <Play size={14} />
                      <span>Start Work (Mark In Progress)</span>
                    </button>
                  )}

                  {['assigned', 'in_progress'].includes(issue.status) && (
                    <button
                      type="button"
                      onClick={() => setSelectedIssueForEvidence(issue)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      <Camera size={14} />
                      <span>Upload Fix Proof & Complete</span>
                    </button>
                  )}

                  {issue.status === 'pending_confirmation' && (
                    <div className="text-center p-2.5 bg-orange-50 rounded-xl border border-orange-200 text-xs font-bold text-orange-800">
                      ⏳ Pending Citizen Verification
                    </div>
                  )}

                  {issue.status === 'resolved' && (
                    <div className="text-center p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                      <CheckCircle2 size={14} />
                      <span>Verified Fixed & Closed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Resolution Evidence Modal */}
      {selectedIssueForEvidence && (
        <WorkerEvidenceModal
          issue={selectedIssueForEvidence}
          onClose={() => setSelectedIssueForEvidence(null)}
          onSuccess={() => {
            setFeedbackMsg('Fix evidence submitted successfully! Ticket is now pending citizen confirmation.');
            fetchWorkerJobs();
            setTimeout(() => setFeedbackMsg(''), 4000);
          }}
        />
      )}
    </div>
  );
}
