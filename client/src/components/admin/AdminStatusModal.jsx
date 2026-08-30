import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2, UserCheck, Shield, Users } from 'lucide-react';

const FIELD_TEAMS = [
  { id: 'team_road_w1', name: 'Ward 1 Road Maintenance Crew (Lead: Eng. Rajesh)' },
  { id: 'team_waste_w2', name: 'Ward 2 Sanitation & Waste Disposal Unit (Lead: Eng. Sunita)' },
  { id: 'team_elec_w3', name: 'Ward 3 Electrical & Streetlight Division (Lead: Eng. Amit)' },
  { id: 'team_drain_w4', name: 'Ward 4 Drainage & Stormwater Crew (Lead: Eng. Preeti)' },
  { id: 'team_emer_w5', name: 'Ward 5 Emergency Civil Response Team (Lead: Eng. Vikram)' },
  { id: 'worker_ramesh', name: 'Field Worker Ramesh (On-duty Technician)' },
];

export default function AdminStatusModal({
  issue,
  newStatus,
  onStatusChange,
  statusNote,
  onNoteChange,
  onSave,
  onClose,
  isUpdating,
}) {
  const [selectedTeam, setSelectedTeam] = useState(issue?.assignedWorker?.name || '');

  if (!issue) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm cursor-pointer"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-7 max-w-lg w-full shadow-2xl border border-slate-100 cursor-default"
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
              #{issue.ticketId || issue._id.substring(0, 8)}
            </span>
            <h3 className="font-primary text-lg font-bold text-slate-900 mt-1">
              Update Status & Field Dispatch
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Milestone Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
            >
              <option value="reported">Reported</option>
              <option value="verified">Under Review</option>
              <option value="assigned">Crew Assigned</option>
              <option value="in_progress">Work in Progress</option>
              <option value="pending_confirmation">Pending Citizen Verification</option>
              <option value="resolved">Resolved & Verified</option>
              <option value="reopened">Reopened</option>
            </select>
          </div>

          {/* Assign Worker or Repair Team */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users size={13} className="text-emerald-600" /> Assign Field Repair Unit
              </span>
              <span className="text-[10px] text-slate-400">Optional</span>
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => {
                setSelectedTeam(e.target.value);
                if (e.target.value && !statusNote) {
                  onNoteChange(`Dispatched to ${e.target.value}.`);
                }
              }}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
            >
              <option value="">-- No Team Assigned --</option>
              {FIELD_TEAMS.map((team) => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Official Note / Dispatch Log
            </label>
            <textarea
              rows={3}
              value={statusNote}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="e.g. Field crew dispatched with repair equipment. Work scheduled to complete by 5 PM."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl text-xs font-bold hover:from-emerald-700 hover:to-green-700 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isUpdating ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving Status...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={14} />
                  <span>Save Status & Notify Citizen</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
