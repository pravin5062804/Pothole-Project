import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Camera,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Loader2,
  ShieldCheck,
  Upload,
  UserCheck,
} from 'lucide-react';
import { issueApi } from '../../api';

export default function CommunityVerificationSection({ issue, onVoteSuccess }) {
  const [tallies, setTallies] = useState({ confirms: 0, disputes: 0 });
  const [votesList, setVotesList] = useState([]);
  const [loadingVotes, setLoadingVotes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dispute modal state
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeComment, setDisputeComment] = useState('');
  const [voterName, setVoterName] = useState('');
  const [disputePhoto, setDisputePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const isPending = issue?.status === 'pending_confirmation';
  const hasEvidence = issue?.resolutionEvidence && issue.resolutionEvidence.length > 0;

  const fetchVotes = async () => {
    if (!issue?._id) return;
    setLoadingVotes(true);
    try {
      const res = await issueApi.getIssueVotes(issue._id);
      if (res?.tallies) {
        setTallies(res.tallies);
      }
      if (res?.votes) {
        setVotesList(res.votes);
      }
    } catch (err) {
      console.warn('Failed to load issue votes:', err);
    } finally {
      setLoadingVotes(false);
    }
  };

  useEffect(() => {
    fetchVotes();
  }, [issue?._id]);

  const handleConfirmVote = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('vote', 'confirm');
      formData.append('comment', 'Confirmed by resident. Work is satisfactory.');
      formData.append('voterName', voterName || 'Local Citizen');

      await issueApi.submitVote(issue._id, formData);
      fetchVotes();
      if (onVoteSuccess) onVoteSuccess();
      alert('Thank you! Your confirmation vote has been recorded.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit confirmation vote.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisputeSubmit = async (e) => {
    e.preventDefault();
    if (!disputeComment.trim()) {
      alert('Please provide a reason why this resolution is inadequate.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('vote', 'dispute');
      formData.append('comment', disputeComment.trim());
      formData.append('voterName', voterName || 'Local Citizen');
      if (disputePhoto) {
        formData.append('photo', disputePhoto);
      }

      await issueApi.submitVote(issue._id, formData);
      setDisputeModalOpen(false);
      setDisputeComment('');
      setDisputePhoto(null);
      setPhotoPreview(null);
      fetchVotes();
      if (onVoteSuccess) onVoteSuccess();
      alert('Your dispute has been logged. The municipal team and field crew have been alerted to re-inspect.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit dispute.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isPending && !hasEvidence && tallies.confirms === 0 && tallies.disputes === 0) {
    return null;
  }

  const totalVotes = tallies.confirms + tallies.disputes;
  const confirmPct = totalVotes > 0 ? Math.round((tallies.confirms / totalVotes) * 100) : 0;
  const disputePct = totalVotes > 0 ? Math.round((tallies.disputes / totalVotes) * 100) : 0;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-lg shadow-slate-200/40 my-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-primary text-base font-black text-slate-900">
                Community Resolution Verification
              </h3>
              {isPending && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                  Open for Citizen Votes
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Field repair crews have submitted completion evidence. Local citizens vote to confirm or dispute the fix.
            </p>
          </div>
        </div>

        {/* 3-day verification timer */}
        {isPending && issue.confirmationWindowExpiresAt && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-xs font-bold">
            <Clock size={13} className="text-amber-600" />
            <span>Verification Closes: {new Date(issue.confirmationWindowExpiresAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Field Worker Proof Photos (Before & After) */}
      {hasEvidence && (
        <div className="py-5 border-b border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Camera size={14} className="text-emerald-600" />
            Field Crew After-Fix Evidence ({issue.resolutionEvidence.length} Photos)
          </h4>
          <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-3">
            {issue.resolutionEvidence.map((ev, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-50">
                <img
                  src={ev.url || ev}
                  alt={`Proof ${idx + 1}`}
                  className="w-full h-36 object-cover hover:scale-105 transition-transform"
                />
                {ev.notes && (
                  <p className="p-2.5 text-[11px] text-slate-600 bg-white border-t border-slate-100 leading-tight">
                    {ev.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Vote Tallies Progress Meter */}
      <div className="py-5">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="text-emerald-700 flex items-center gap-1.5">
            <ThumbsUp size={14} /> Confirmed Satisfactory: {tallies.confirms} ({confirmPct}%)
          </span>
          <span className="text-red-600 flex items-center gap-1.5">
            <ThumbsDown size={14} /> Disputed Incomplete: {tallies.disputes} ({disputePct}%)
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${confirmPct}%` }} />
          <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${disputePct}%` }} />
        </div>
      </div>

      {/* Citizen Voting Action Buttons */}
      {isPending && (
        <div className="pt-2 flex items-center gap-3 max-sm:flex-col">
          <button
            type="button"
            onClick={handleConfirmVote}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-2xl text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
          >
            {isSubmitting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <ThumbsUp size={15} />
            )}
            <span>Confirm Resolution (Mark Fixed)</span>
          </button>

          <button
            type="button"
            onClick={() => setDisputeModalOpen(true)}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-white hover:bg-red-50 text-red-700 font-bold border border-red-200 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <AlertTriangle size={15} className="text-red-600" />
            <span>Dispute Fix (Work Inadequate)</span>
          </button>
        </div>
      )}

      {/* Dispute Modal Dialog */}
      <AnimatePresence>
        {disputeModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs cursor-pointer"
            onClick={() => setDisputeModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-7 max-w-lg w-full shadow-2xl border border-slate-100 cursor-default"
            >
              <h3 className="font-primary text-lg font-black text-slate-900 mb-1">
                Dispute Inadequate Resolution
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                If the reported civic issue is still present or poorly repaired, tell the municipal team why so they can re-open and prioritize it.
              </p>

              <form onSubmit={handleDisputeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={voterName}
                    onChange={(e) => setVoterName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dispute Reason / What is still broken? *
                  </label>
                  <textarea
                    rows={3}
                    value={disputeComment}
                    onChange={(e) => setDisputeComment(e.target.value)}
                    placeholder="e.g. The pothole was only filled with loose sand and collapsed after rain. Deep depression remains."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 resize-none"
                    required
                  />
                </div>

                {/* Optional Dispute Proof Photo */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Attach Current Condition Proof Photo (Optional)
                  </label>
                  {photoPreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 h-28 w-36">
                      <img src={photoPreview} alt="Dispute preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setDisputePhoto(null);
                          setPhotoPreview(null);
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-slate-200 hover:border-red-400 p-4 rounded-xl text-center text-slate-500 hover:text-red-600 transition-colors cursor-pointer text-xs font-semibold flex items-center justify-center gap-2"
                    >
                      <Camera size={16} />
                      <span>Take or upload photo of current site</span>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setDisputePhoto(file);
                        setPhotoPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting Dispute...' : 'Submit Official Dispute'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisputeModalOpen(false)}
                    className="px-5 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
