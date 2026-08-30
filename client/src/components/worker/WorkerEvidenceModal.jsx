import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Upload,
  Camera,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Trash2,
  FileText,
  Shield,
  Clock,
} from 'lucide-react';
import { issueApi } from '../../api';

export default function WorkerEvidenceModal({ issue, onClose, onSuccess }) {
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  if (!issue) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 3) {
      setError('You can upload a maximum of 3 completion proof photos.');
      return;
    }
    setError('');

    const newPhotos = [...photos, ...files].slice(0, 3);
    setPhotos(newPhotos);

    const newPreviews = newPhotos.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removePhoto = (index) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (photos.length === 0) {
      setError('Please attach at least 1 photo showing the completed on-site repair.');
      return;
    }
    if (!notes.trim()) {
      setError('Please provide a brief description of the work and materials used.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      photos.forEach((file) => {
        formData.append('evidencePhotos', file);
      });
      formData.append('resolutionNotes', notes.trim());

      const res = await issueApi.submitEvidence(issue._id, formData);
      if (onSuccess) onSuccess(res);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit resolution evidence.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                #{issue.ticketId || issue._id.substring(0, 8)}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                {issue.category}
              </span>
            </div>
            <h3 className="font-primary text-lg font-black text-slate-900 mt-1">
              Submit Field Fix Proof
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

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Upload Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>After-Fix Photographs (Max 3)</span>
              <span className="text-[10px] text-slate-400">{photos.length}/3 attached</span>
            </label>

            {previews.length > 0 ? (
              <div className="grid grid-cols-3 gap-2.5 mb-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative rounded-2xl overflow-hidden border border-slate-200 h-24 group">
                    <img src={src} alt="Evidence" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 bg-red-600/80 text-white p-1 rounded-full hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                {photos.length < 3 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl h-24 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    <Camera size={20} />
                    <span className="text-[10px] font-bold mt-1">+ Add Photo</span>
                  </button>
                )}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/20 rounded-2xl p-6 text-center transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                  <Camera size={20} />
                </div>
                <p className="text-xs font-bold text-slate-700">Click to upload completion photos</p>
                <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG or WEBP (up to 3 photos)</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Work description / notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Work Completed & Materials Used
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Filled 2 sq meter pothole with rapid-curing bitumen asphalt. Surface leveled and compacted."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
            />
          </div>

          {/* Citizen Confirmation Notice */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 text-[11px] text-amber-800 flex items-start gap-2">
            <Clock size={15} className="text-amber-600 shrink-0 mt-0.5" />
            <span>
              Once submitted, ticket will move to <b>Pending Citizen Verification</b> for 3 days. Local citizens can confirm or dispute the quality of work.
            </span>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl text-xs font-bold hover:from-emerald-700 hover:to-green-700 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Uploading Evidence...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  <span>Submit Proof & Complete Task</span>
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
