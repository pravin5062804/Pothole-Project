import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  PlusCircle,
  Home,
  ShieldCheck,
  Clock,
  Sparkles,
  MapPin,
  Flame,
  Activity,
  Layers,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ReportSuccessModal({
  info,
  onClose,
  onResetForm,
}) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  if (!info) return null;

  const ticketId = info.ticketId || 'CR-2026-NEW';

  const handleCopy = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.25 }}
        className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative overflow-hidden"
      >
        {/* Decorative ambient background orb */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-teal-400/20 blur-2xl pointer-events-none" />

        {/* Close icon */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Success Animated Badge */}
        <div className="text-center mb-6">
          <div className="relative inline-flex items-center justify-center mb-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30"
            >
              <CheckCircle2 size={34} />
            </motion.div>
            <span className="absolute -inset-1 rounded-2xl bg-emerald-400/30 animate-ping -z-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Sparkles size={12} className="text-emerald-600" />
            Report Successfully Logged
          </div>

          <h2 className="font-primary text-2xl font-black text-slate-900 leading-tight">
            Thank You for Reporting!
          </h2>
          <p className="text-xs text-slate-500 max-w-[380px] mx-auto mt-1 leading-relaxed">
            Your civic filing has been recorded into the municipal database and routed to field engineers.
          </p>
        </div>

        {/* Official Ticket ID Card */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 mb-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Official Ticket Reference
            </span>
            <span className="text-[10px] font-bold bg-emerald-100/70 text-emerald-800 px-2 py-0.5 rounded-md">
              Active Tracking
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
            <span className="font-mono text-lg font-black text-slate-900 tracking-wider">
              #{ticketId}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-all border border-emerald-200/60 cursor-pointer"
            >
              {copied ? <Check size={13} className="text-emerald-700" /> : <Copy size={13} />}
              <span>{copied ? 'Copied!' : 'Copy ID'}</span>
            </button>
          </div>

          {info.isMerged && (
            <div className="mt-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-2.5 text-[11px] flex items-start gap-2">
              <Layers size={14} className="text-amber-600 shrink-0 mt-0.5" />
              <span>
                <b>Hotspot Matched:</b> Your report was merged with nearby neighbor filings within 75m, boosting priority for immediate crew dispatch.
              </span>
            </div>
          )}
        </div>

        {/* Resolution Roadmap (3 Steps) */}
        <div className="mb-6 space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            What Happens Next?
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center mx-auto mb-1">
                ✓
              </div>
              <p className="text-[11px] font-bold text-slate-800">1. AI Triage</p>
              <p className="text-[9px] text-slate-500">Categorized & Logged</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
              <div className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center mx-auto mb-1">
                2
              </div>
              <p className="text-[11px] font-bold text-slate-800">2. Field Dispatch</p>
              <p className="text-[9px] text-slate-500">Crew arrival scheduled</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
              <div className="w-5 h-5 rounded-full bg-slate-400 text-white text-[10px] font-bold flex items-center justify-center mx-auto mb-1">
                3
              </div>
              <p className="text-[11px] font-bold text-slate-800">3. Citizen Check</p>
              <p className="text-[9px] text-slate-500">Verify completion photo</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <Link
            to="/track"
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Track Live Status on Map</span>
            <ArrowRight size={15} />
          </Link>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (onResetForm) onResetForm();
                onClose();
              }}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle size={13} />
              <span>Report Another</span>
            </button>

            <Link
              to="/"
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors text-center"
            >
              <Home size={13} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
