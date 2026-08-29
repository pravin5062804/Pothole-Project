import { useState, useRef } from 'react';
import {
  Camera,
  MapPin,
  Upload,
  ChevronDown,
  AlertCircle,
  Trash2,
  Zap,
  Droplets,
  Construction,
  MoreHorizontal,
  CheckCircle,
  Loader2,
  X,
} from 'lucide-react';
import { issueApi } from '../api/issueApi';

const ISSUE_CATEGORIES = [
  { id: 'pothole', label: 'Potholes & Roads', icon: <AlertCircle size={20} /> },
  { id: 'garbage', label: 'Garbage & Waste', icon: <Trash2 size={20} /> },
  { id: 'streetlight', label: 'Streetlights', icon: <Zap size={20} /> },
  { id: 'drainage', label: 'Drainage', icon: <Droplets size={20} /> },
  { id: 'water', label: 'Water Supply', icon: <Droplets size={20} /> },
  { id: 'other', label: 'Others', icon: <MoreHorizontal size={20} /> },
];

const SEVERITY_LEVELS = [
  { id: 'low', label: 'Low', color: 'bg-green-100 text-green-700 border-green-300' },
  { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { id: 'high', label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { id: 'critical', label: 'Critical', color: 'bg-red-100 text-red-700 border-red-300' },
];

export default function ReportIssuePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submittedInfo, setSubmittedInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  const handleFiles = (fileList) => {
    const selected = Array.from(fileList).slice(0, 3);
    setPhotos(selected);
    const previews = selected.map((f) => URL.createObjectURL(f));
    setPhotoPreviews(previews);
  };

  const handleUseGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          if (!address) {
            setAddress(`GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
          }
        },
        (err) => {
          console.warn('Geolocation error:', err.message);
          alert('Could not fetch precise GPS. Using default location coordinates.');
        }
      );
    } else {
      alert('Geolocation is not supported in this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSubmittedInfo(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (selectedCategory) formData.append('category', selectedCategory);
      if (severity) formData.append('severity', severity);
      if (address) formData.append('address', address);

      if (coords) {
        formData.append('latitude', coords.lat);
        formData.append('longitude', coords.lng);
      }

      photos.forEach((file) => {
        formData.append('photos', file);
      });

      const response = await issueApi.reportIssue(formData);

      setSubmittedInfo({
        ticketId: response.issue?.ticketId || 'CR-2026-NEW',
        isMerged: response.isMergedDuplicate,
        message: response.message,
      });

      // Clear fields
      setTitle('');
      setDescription('');
      setSelectedCategory('');
      setSeverity('medium');
      setAddress('');
      setPhotos([]);
      setPhotoPreviews([]);
      setCoords(null);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit report. Please verify connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm text-white/90 font-medium mb-4">
            <Construction size={16} />
            Report a Civic Issue
          </div>
          <h1 className="font-primary text-4xl max-md:text-3xl font-extrabold text-white mb-3">
            Report an Issue
          </h1>
          <p className="text-white/80 text-lg max-w-[600px]">
            Help us keep your city clean, safe, and well-maintained. Fill in the details below to
            report a civic issue.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-[1200px] mx-auto px-6 -mt-8 pb-20">
        <div className="grid grid-cols-[1fr_360px] max-lg:grid-cols-1 gap-8">
          {/* Main Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
          >
            {/* Error Message */}
            {errorMsg && (
              <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                <AlertCircle size={20} className="shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {submittedInfo && (
              <div className="mb-6 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4 animate-fade-in-up">
                <CheckCircle size={22} className="text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800">
                    {submittedInfo.isMerged
                      ? 'Report Matched & Merged with Existing Issue!'
                      : 'Issue Reported Successfully!'}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Your Ticket ID is{' '}
                    <span className="font-bold text-green-900">#{submittedInfo.ticketId}</span>.
                    You can track its live progress from the Track Issue page.
                  </p>
                  {submittedInfo.isMerged && (
                    <p className="text-xs text-green-700 mt-1 bg-green-100/60 p-2 rounded-lg">
                      💡 Note: Our geo-clustering detected an active report in the same location and
                      merged your report to boost its recurrence and priority rank!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Issue Title */}
            <div className="mb-6">
              <label
                htmlFor="issue-title"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Issue Title <span className="text-red-500">*</span>
              </label>
              <input
                id="issue-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Large pothole on Main Street"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 max-sm:grid-cols-2 gap-3">
                {ISSUE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-500/20'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label
                htmlFor="issue-description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="issue-description"
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed information about the issue, its location, and how long it has existed..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all resize-none placeholder:text-gray-400"
              />
            </div>

            {/* Location */}
            <div className="mb-6">
              <label
                htmlFor="issue-location"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="issue-location"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter address or landmark (or use GPS)"
                  className="w-full pl-11 pr-32 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={handleUseGPS}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors cursor-pointer"
                >
                  <MapPin size={14} />
                  Use GPS
                </button>
              </div>
              {coords && (
                <p className="text-xs text-green-700 mt-1.5">
                  📍 Geo-coordinates attached: [{coords.lng.toFixed(4)}, {coords.lat.toFixed(4)}]
                </p>
              )}
            </div>

            {/* Severity */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Severity Level
              </label>
              <div className="flex gap-3 flex-wrap">
                {SEVERITY_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setSeverity(level.id)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all cursor-pointer ${
                      severity === level.id
                        ? `${level.color} ring-2 ring-offset-1`
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Photos (for Groq AI Analysis)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
                }}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  dragActive
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Camera size={22} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  Drag and drop photos here, or{' '}
                  <span className="text-green-600 font-semibold">browse</span>
                </p>
                <p className="text-xs text-gray-400">Supports JPG, PNG, WebP up to 10MB (Cloudinary + AI)</p>
              </div>

              {/* Previews */}
              {photoPreviews.length > 0 && (
                <div className="mt-4 flex gap-3 flex-wrap">
                  {photoPreviews.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                      <img src={url} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPhotos(photos.filter((_, i) => i !== idx));
                          setPhotoPreviews(photoPreviews.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-green-600 text-white rounded-xl text-base font-bold hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing with AI & Submitting...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Submit Report
                </>
              )}
            </button>
          </form>

          {/* Sidebar */}
          <div className="space-y-6 max-lg:order-first">
            {/* Tips Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-primary text-lg font-bold text-gray-900 mb-4">
                📝 Reporting Tips
              </h3>
              <ul className="space-y-3">
                {[
                  'Take clear photos of the issue from multiple angles',
                  'Include nearby landmarks for accurate location',
                  'Mention how long the issue has existed',
                  'Describe any safety hazards involved',
                  'Provide your contact info for follow-ups',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-green-700 to-emerald-600 rounded-2xl p-6 text-white">
              <h3 className="font-primary text-lg font-bold mb-4">📊 System Pipeline</h3>
              <div className="space-y-4">
                {[
                  { label: 'AI Classification', value: 'Groq Vision + LLM' },
                  { label: 'Deduplication', value: '75m Geo-Radius' },
                  { label: 'Media Storage', value: 'Cloudinary CDN' },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center">
                    <span className="text-white/75 text-sm">{stat.label}</span>
                    <span className="font-bold text-sm">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Assistance Badge */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-primary text-lg font-bold text-gray-900 mb-2">
                🤖 AI Verification
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Our automated Groq AI service evaluates photo evidence and descriptions to auto-classify categories, assign severity scores, and route high-priority hazards directly to municipal repair crews.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
