import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  RefreshCw,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { issueApi } from '../api';
import {
  AdminSidebar,
  AdminStatsGrid,
  AdminReportsManager,
  AdminHeatmapView,
  AdminAnalyticsView,
  AdminCrewsView,
  AdminStatusModal,
} from '../components/admin';

export default function AdminPage() {
  const { user, isAuthenticated, openAuthModal, logout, login } = useAuth();

  const [activeTab, setActiveTab] = useState('reports');
  const [issues, setIssues] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  // Status modal state
  const [modalIssue, setModalIssue] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const isAdminOrWorker = user && (user.role === 'admin' || user.role === 'worker');

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (activeFilter !== 'All') params.status = activeFilter;
      if (severityFilter !== 'All') params.severity = severityFilter;

      const [issueRes, statsRes] = await Promise.allSettled([
        issueApi.getIssues(params),
        issueApi.getDashboardStats(),
      ]);

      if (issueRes.status === 'fulfilled' && issueRes.value?.issues) {
        setIssues(issueRes.value.issues);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value) {
        setStatsData(statsRes.value);
      }
    } catch (err) {
      console.warn('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminOrWorker) {
      fetchData();
    }
  }, [searchQuery, activeFilter, severityFilter, isAdminOrWorker]);

  const handleOpenStatusModal = (e, issue) => {
    e.stopPropagation();
    setModalIssue(issue);
    setNewStatus(issue.status);
    setStatusNote('');
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!modalIssue) return;
    setIsUpdating(true);
    try {
      await issueApi.updateStatus(modalIssue._id, newStatus, statusNote);
      setFeedbackMsg(`Successfully updated ticket #${modalIssue.ticketId || modalIssue._id.substring(0, 8)} to ${newStatus.replace('_', ' ')}!`);
      setModalIssue(null);
      fetchData();
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAutoDispatchSingle = async (issueId) => {
    try {
      const res = await issueApi.autoDispatchSingle(issueId);
      setFeedbackMsg(res.message || 'Auto-dispatched successfully!');
      fetchData();
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to auto-dispatch issue.');
    }
  };

  const [isDispatchingBatch, setIsDispatchingBatch] = useState(false);
  const handleBatchAutoDispatch = async () => {
    setIsDispatchingBatch(true);
    try {
      const res = await issueApi.batchAutoDispatch();
      setFeedbackMsg(`⚡ Queue Processed: ${res.dispatchedCount} complaints auto-assigned to field crews!`);
      fetchData();
      setTimeout(() => setFeedbackMsg(''), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to batch auto-dispatch queue.');
    } finally {
      setIsDispatchingBatch(false);
    }
  };

  const handleDemoAdminLogin = async () => {
    try {
      setLoading(true);
      await login('admin@gmail.com', 'admin123');
    } catch (err) {
      alert('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Metrics
  const totalReports = statsData?.stats?.totalReports ?? issues.length;
  const inProgressReports = issues.filter((i) => ['in_progress', 'assigned', 'verified'].includes(i.status)).length;
  const resolvedReports = issues.filter((i) => i.status === 'resolved').length;
  const criticalReports = issues.filter((i) => i.severity === 'critical' || i.priorityScore >= 75).length;

  // Unauthenticated / Non-Admin Access Gate
  if (!isAdminOrWorker) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1600&q=80&auto=format"
            alt="City Admin"
            className="w-full h-full object-cover filter brightness-[0.35] contrast-[1.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-emerald-950/80" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-md w-full bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 text-center shadow-2xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-lg shadow-emerald-950/60">
            <Lock size={30} />
          </div>

          <h2 className="font-primary text-2xl font-black text-white mb-2">
            Municipal Admin Portal
          </h2>
          <p className="text-xs text-slate-300 mb-6 leading-relaxed">
            This dashboard is restricted to authorized municipal officers, ward supervisors, and field maintenance teams.
          </p>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleDemoAdminLogin}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Shield size={16} />
              <span>Login with Admin (admin@gmail.com)</span>
            </button>

            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="w-full py-3 bg-white/10 hover:bg-white/15 text-white rounded-2xl text-xs font-bold border border-white/15 transition-all cursor-pointer"
            >
              Sign In with Custom Account
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex antialiased">
      {/* Clean White Left Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={fetchData}
        loading={loading}
      />

      {/* Main Admin Workspace Canvas */}
      <main className="flex-1 min-w-0 p-8 max-w-[1400px] w-full">
        {/* KPI Metric Cards */}
        <AdminStatsGrid
          totalReports={totalReports}
          inProgressReports={inProgressReports}
          resolvedReports={resolvedReports}
          criticalReports={criticalReports}
        />

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

        {/* Active Tab View */}
        {activeTab === 'reports' && (
          <AdminReportsManager
            issues={issues}
            loading={loading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            severityFilter={severityFilter}
            onSeverityChange={setSeverityFilter}
            onOpenStatusModal={handleOpenStatusModal}
            onAutoDispatchSingle={handleAutoDispatchSingle}
            onBatchAutoDispatch={handleBatchAutoDispatch}
            isDispatching={isDispatchingBatch}
          />
        )}

        {activeTab === 'map' && (
          <AdminHeatmapView
            issues={issues}
            onOpenStatusModal={handleOpenStatusModal}
            onAutoDispatchSingle={handleAutoDispatchSingle}
            onBatchAutoDispatch={handleBatchAutoDispatch}
            isDispatching={isDispatchingBatch}
          />
        )}

        {activeTab === 'analytics' && <AdminAnalyticsView />}

        {activeTab === 'wards' && <AdminCrewsView issues={issues} />}
      </main>

      {/* Update Status Modal Dialog */}
      <AnimatePresence>
        {modalIssue && (
          <AdminStatusModal
            issue={modalIssue}
            newStatus={newStatus}
            onStatusChange={setNewStatus}
            statusNote={statusNote}
            onNoteChange={setStatusNote}
            onSave={handleSaveStatus}
            onClose={() => setModalIssue(null)}
            isUpdating={isUpdating}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
