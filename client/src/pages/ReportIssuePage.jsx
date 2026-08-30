import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  MapPin,
  Upload,
  AlertCircle,
  Trash2,
  Zap,
  Droplets,
  MoreHorizontal,
  CheckCircle,
  Loader2,
  X,
  Sparkles,
  ShieldCheck,
  Clock,
  Activity,
  PhoneCall,
  HelpCircle,
  CheckCircle2,
  Navigation,
  FileText,
  AlertTriangle,
  ArrowRight,
  Flame,
  Building,
} from 'lucide-react';
import { issueApi } from '../api';
import LocationPickerMap from '../components/ui/LocationPickerMap';
import ReportSuccessModal from '../components/reporting/ReportSuccessModal';

const ISSUE_CATEGORIES = [
  {
    id: 'pothole',
    label: 'Potholes & Roads',
    icon: <AlertTriangle size={20} />,
    desc: 'Craters, road cracks & footpath hazards',
    badgeColor: 'bg-red-50 text-red-700 border-red-200 group-hover:border-red-400',
    activeColor: 'bg-red-50/90 border-red-500 text-red-800 ring-2 ring-red-500/20 shadow-sm',
    accent: 'text-red-600',
  },
  {
    id: 'garbage',
    label: 'Garbage & Waste',
    icon: <Trash2 size={20} />,
    desc: 'Overflowing bins & illegal dumping sites',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:border-emerald-400',
    activeColor: 'bg-emerald-50/90 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20 shadow-sm',
    accent: 'text-emerald-600',
  },
  {
    id: 'streetlight',
    label: 'Streetlights & Poles',
    icon: <Zap size={20} />,
    desc: 'Non-functional lights & wire hazards',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 group-hover:border-amber-400',
    activeColor: 'bg-amber-50/90 border-amber-500 text-amber-800 ring-2 ring-amber-500/20 shadow-sm',
    accent: 'text-amber-600',
  },
  {
    id: 'drainage',
    label: 'Drainage & Sewage',
    icon: <Droplets size={20} />,
    desc: 'Blocked sewer lines & stormwater pooling',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 group-hover:border-blue-400',
    activeColor: 'bg-blue-50/90 border-blue-500 text-blue-800 ring-2 ring-blue-500/20 shadow-sm',
    accent: 'text-blue-600',
  },
  {
    id: 'water',
    label: 'Water Supply',
    icon: <Droplets size={20} />,
    desc: 'Pipeline bursts, contamination & leaks',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200 group-hover:border-cyan-400',
    activeColor: 'bg-cyan-50/90 border-cyan-500 text-cyan-800 ring-2 ring-cyan-500/20 shadow-sm',
    accent: 'text-cyan-600',
  },
  {
    id: 'other',
    label: 'Other Civic Hazards',
    icon: <MoreHorizontal size={20} />,
    desc: 'Fallen trees, park damage & encroachments',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200 group-hover:border-purple-400',
    activeColor: 'bg-purple-50/90 border-purple-500 text-purple-800 ring-2 ring-purple-500/20 shadow-sm',
    accent: 'text-purple-600',
  },
];

const SEVERITY_LEVELS = [
  {
    id: 'low',
    label: 'Low',
    desc: 'Minor defect, safe for traffic',
    color: 'border-slate-200 bg-slate-50/70 hover:bg-white text-slate-700',
    activeBg: 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 ring-2 ring-offset-1',
    icon: '🟢',
  },
  {
    id: 'medium',
    label: 'Medium',
    desc: 'Inconvenient to pedestrian routine',
    color: 'border-slate-200 bg-slate-50/70 hover:bg-white text-slate-700',
    activeBg: 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20 ring-2 ring-offset-1',
    icon: '🟡',
  },
  {
    id: 'high',
    label: 'High',
    desc: 'Impending safety hazard',
    color: 'border-slate-200 bg-slate-50/70 hover:bg-white text-slate-700',
    activeBg: 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20 ring-2 ring-offset-1',
    icon: '🟠',
  },
  {
    id: 'critical',
    label: 'Critical',
    desc: 'Immediate road or health risk',
    color: 'border-slate-200 bg-slate-50/70 hover:bg-white text-slate-700',
    activeBg: 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20 ring-2 ring-offset-1',
    icon: '🔴',
  },
];

const FAQS = [
  {
    q: 'How fast is my report reviewed and dispatched?',
    a: 'Reports are sent directly to the local ward engineering team and scheduled for on-site inspection within 24 to 48 hours.',
  },
  {
    q: 'What happens if neighbors have already reported this?',
    a: 'Our system combines all reports from the same location so the issue gains higher urgency on the city repair schedule.',
  },
  {
    q: 'Can I track resolution without logging in?',
    a: 'Yes, just save your Ticket ID (e.g. #CR-2026-XXXX) and search it anytime on the Track page.',
  },
];

export default function ReportIssuePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submittedInfo, setSubmittedInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const fileInputRef = useRef(null);

  const handleFiles = (fileList) => {
    const selected = Array.from(fileList).slice(0, 3);
    setPhotos(selected);
    const previews = selected.map((f) => URL.createObjectURL(f));
    setPhotoPreviews(previews);
  };

  const handleUseGPS = () => {
    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          if (!address) {
            setAddress(`GPS: ${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`);
          }
          setIsLocating(false);
        },
        (err) => {
          console.warn('Geolocation error:', err.message);
          setIsLocating(false);
          alert('Could not fetch precise GPS. You can manually enter the street address.');
        },
        { timeout: 10000 }
      );
    } else {
      alert('Geolocation is not supported in this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      setErrorMsg('Please select a relevant issue category.');
      return;
    }
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
      const newTicketId = response.issue?.ticketId || 'CR-2026-NEW';

      // Save ticket in citizen's local tracking list
      try {
        const saved = JSON.parse(localStorage.getItem('my_civic_tickets') || '[]');
        if (!saved.includes(newTicketId)) {
          saved.unshift(newTicketId);
          localStorage.setItem('my_civic_tickets', JSON.stringify(saved));
        }
      } catch (e) {}

      setSubmittedInfo({
        ticketId: newTicketId,
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
      setErrorMsg(err.response?.data?.message || 'Failed to submit report. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Completion percentage
  const completedStepsCount = [
    title.trim().length > 3,
    Boolean(selectedCategory),
    description.trim().length > 10,
    Boolean(address.trim() || coords),
    photos.length > 0,
  ].filter(Boolean).length;
  const progressPercent = Math.round((completedStepsCount / 5) * 100);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Header Banner with Urban Civic Landscape */}
      <div className="relative overflow-hidden bg-slate-900 text-white pt-12 pb-24 px-6 shadow-lg border-b border-emerald-900/30">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1600&q=80&auto=format"
            alt="City Infrastructure"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.7] contrast-[1.08]"
          />
          {/* Multi-layered cinematic gradient overlay */}
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
            {/* Left Header Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-100 mb-4 shadow-xs">
                <Sparkles size={14} className="text-yellow-300 animate-spin-slow" />
                Citizen Civic Action Portal
              </div>
              <h1 className="font-primary text-4xl max-md:text-3xl font-black text-white mb-3 tracking-tight leading-tight">
                Report a Civic Issue
              </h1>
              <p className="text-emerald-100/90 text-base max-w-[560px] leading-relaxed mb-6">
                Take a photo, tag your street location, and alert local municipal crews immediately.
                Help keep your neighborhood clean, safe, and well-maintained.
              </p>

              {/* Live Status Indicators */}
              <div className="flex flex-wrap gap-4 text-xs font-medium">
                <div className="flex items-center gap-2 bg-black/25 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Ward 1–12 Field Crews Active</span>
                </div>
                <div className="flex items-center gap-2 bg-black/25 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
                  <Clock size={13} className="text-emerald-300" />
                  <span>Avg. Resolution: ~2 Minutes</span>
                </div>
              </div>
            </motion.div>

            {/* Right Feature Highlights Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 transition-all hover:bg-white/15">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-200 mb-2">
                  <Sparkles size={16} />
                </div>
                <p className="font-bold text-sm text-white">Smart Routing</p>
                <p className="text-xs text-emerald-100/75 mt-0.5 leading-snug">
                  Automatically directs reports to the correct municipal department.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 transition-all hover:bg-white/15">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/30 flex items-center justify-center text-cyan-200 mb-2">
                  <Navigation size={16} />
                </div>
                <p className="font-bold text-sm text-white">Nearby Issue Match</p>
                <p className="text-xs text-emerald-100/75 mt-0.5 leading-snug">
                  Groups neighboring reports to speed up repair urgency.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 transition-all hover:bg-white/15">
                <div className="w-8 h-8 rounded-xl bg-amber-500/30 flex items-center justify-center text-amber-200 mb-2">
                  <ShieldCheck size={16} />
                </div>
                <p className="font-bold text-sm text-white">Official Ticket ID</p>
                <p className="text-xs text-emerald-100/75 mt-0.5 leading-snug">
                  Unique reference number to track live progress anytime.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 transition-all hover:bg-white/15">
                <div className="w-8 h-8 rounded-xl bg-blue-500/30 flex items-center justify-center text-blue-200 mb-2">
                  <Activity size={16} />
                </div>
                <p className="font-bold text-sm text-white">Direct Ward Dispatch</p>
                <p className="text-xs text-emerald-100/75 mt-0.5 leading-snug">
                  Assigned directly to local ward maintenance engineers.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="max-w-[1200px] mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_370px] gap-8 items-start">
          {/* Main Form Card */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 max-sm:p-5"
          >
            {/* Form Progress Meter */}
            <div className="mb-8 pb-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText size={14} className="text-emerald-600" />
                  Report Completeness
                </span>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {progressPercent}% Ready
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm shadow-xs"
                >
                  <AlertCircle size={20} className="shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message Banner */}
            <AnimatePresence>
              {submittedInfo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="mb-8 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-500/40 rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-primary text-lg font-bold text-emerald-900">
                        {submittedInfo.isMerged
                          ? 'Report Combined with Existing Area Issue!'
                          : 'Issue Submitted Successfully!'}
                      </h3>
                      <p className="text-sm text-emerald-700 mt-1">
                        Your Ticket ID is{' '}
                        <span className="font-extrabold text-emerald-900 bg-emerald-200/60 px-2 py-0.5 rounded-md">
                          #{submittedInfo.ticketId}
                        </span>
                        . Save this ID to track live updates.
                      </p>
                      {submittedInfo.isMerged && (
                        <p className="text-xs text-emerald-800 mt-3 bg-white/80 p-3 rounded-xl border border-emerald-200 leading-relaxed">
                          💡 <strong>Notice:</strong> Neighbors have also reported a problem at this exact location.
                          We added your photos to give this issue higher priority for local repair crews!
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Field 1: Issue Title */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="issue-title"
                  className="block text-sm font-bold text-slate-800"
                >
                  Issue Title <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Keep it short & specific</span>
              </div>
              <input
                id="issue-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Deep pothole near Sector 4 Metro Station entrance"
                className="w-full px-4 py-3.5 bg-slate-50/50 hover:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-400 shadow-2xs"
              />
            </div>

            {/* Field 2: Category Selection */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-bold text-slate-800">
                  Select Category <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Choose the best match</span>
              </div>
              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3">
                {ISSUE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <motion.button
                      key={cat.id}
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`group flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? cat.activeColor
                          : `${cat.badgeColor} bg-white hover:bg-slate-50/80`
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                          isSelected ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {cat.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 leading-tight">
                          {cat.label}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">{cat.desc}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Field 3: Description */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="issue-description"
                  className="block text-sm font-bold text-slate-800"
                >
                  Description & Context <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {description.length} characters
                </span>
              </div>
              <textarea
                id="issue-description"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the problem clearly: how long has it been there, hazards caused to pedestrians or traffic, nearby landmarks..."
                className="w-full px-4 py-3.5 bg-slate-50/50 hover:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all resize-none placeholder:text-slate-400 shadow-2xs"
              />
            </div>

            {/* Field 4: Location with Interactive Leaflet Map (Default & Satellite modes) */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="issue-location"
                  className="block text-sm font-bold text-slate-800"
                >
                  Location & Map Pin <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Click map or use GPS to pin</span>
              </div>

              {/* Address Input Bar */}
              <div className="relative mb-3">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="issue-location"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter street name, landmark, or click on the map below"
                  className="w-full pl-11 pr-32 py-3.5 bg-slate-50/50 hover:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-400 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={handleUseGPS}
                  disabled={isLocating}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isLocating ? (
                    <>
                      <Loader2 size={13} className="animate-spin text-emerald-700" />
                      Locating...
                    </>
                  ) : (
                    <>
                      <Navigation size={13} className="text-emerald-700" />
                      Use GPS
                    </>
                  )}
                </button>
              </div>

              {/* Leaflet Interactive Map Picker with Default & Satellite Modes */}
              <LocationPickerMap
                coords={coords}
                onCoordsChange={setCoords}
                onAddressChange={(newAddr) => {
                  setAddress(newAddr);
                }}
              />
            </div>

            {/* Field 5: Severity Level */}
            <div className="mb-7">
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Estimated Severity Level
              </label>
              <div className="grid grid-cols-4 max-sm:grid-cols-2 gap-2.5">
                {SEVERITY_LEVELS.map((level) => {
                  const isSelected = severity === level.id;
                  return (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setSeverity(level.id)}
                      className={`px-3 py-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected ? level.activeBg : level.color
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center justify-center gap-1">
                        <span>{level.icon}</span>
                        <span>{level.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 6: Photo Evidence */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Camera size={16} className="text-emerald-600" />
                  Attach Photos (Evidence)
                </label>
                <span className="text-[11px] text-slate-400">Up to 3 images</span>
              </div>
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
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                  dragActive
                    ? 'border-emerald-500 bg-emerald-50/70 scale-[1.01]'
                    : 'border-slate-200 bg-slate-50/40 hover:border-emerald-300 hover:bg-emerald-50/20'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 shadow-2xs">
                  <Upload size={22} />
                </div>
                <p className="text-xs font-bold text-slate-700 mb-0.5">
                  Drag photos here or <span className="text-emerald-600 underline">browse files</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Clear photos help repair teams identify the exact tools and materials needed.
                </p>
              </div>

              {/* Upload Previews */}
              {photoPreviews.length > 0 && (
                <div className="mt-4 flex gap-3 flex-wrap">
                  {photoPreviews.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-xs group"
                    >
                      <img src={url} alt="Evidence preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPhotos(photos.filter((_, i) => i !== idx));
                          setPhotoPreviews(photoPreviews.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl text-base font-bold hover:from-emerald-700 hover:to-green-700 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Submitting Report & Alerting Ward Team...</span>
                </>
              ) : (
                <>
                  <Upload size={20} />
                  <span>Submit Civic Report</span>
                  <ArrowRight size={18} className="ml-1" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Live Resolution Pipeline Card */}
            <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-primary text-base font-bold text-slate-800 flex items-center gap-2">
                  <Activity size={18} className="text-emerald-600" />
                  Resolution Steps
                </h3>
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Active
                </span>
              </div>
              <div className="space-y-3.5">
                {[
                  { step: '1', title: 'Citizen Report', sub: 'Photo + GPS location received' },
                  { step: '2', title: 'Department Review', sub: 'Assigned to the correct municipal division' },
                  { step: '3', title: 'Field Crew Dispatch', sub: 'Repair team visits on-site' },
                  { step: '4', title: 'Citizen Verification', sub: 'Neighbors confirm when work is fixed' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800">{item.title}</p>
                      <p className="text-[11px] text-slate-500 leading-tight">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reporting Guidelines Card */}
            <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6">
              <h3 className="font-primary text-base font-bold text-slate-800 mb-3.5 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" />
                Tips for Fast Resolution
              </h3>
              <ul className="space-y-2.5">
                {[
                  'Take clear, well-lit photos showing both the problem and the surroundings',
                  'Mention nearby landmarks, shop names, or metro pillars',
                  'Specify if safety hazards affect school zones or hospitals',
                  'Save your Ticket ID to confirm when repairs are completed',
                ].map((tip, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                    <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Emergency Helpline Box */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Flame size={16} />
                Urgent Emergency?
              </div>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                For gas leaks, electrical wire collapses, or road sinkholes requiring immediate police or ambulance response:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:112"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors border border-white/10"
                >
                  <PhoneCall size={13} className="text-emerald-400" />
                  Police: 112
                </a>
                <a
                  href="tel:101"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors border border-white/10"
                >
                  <PhoneCall size={13} className="text-red-400" />
                  Fire: 101
                </a>
              </div>
            </div>

            {/* Quick FAQ Mini-Accordion */}
            <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6">
              <h3 className="font-primary text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                <HelpCircle size={18} className="text-emerald-600" />
                Frequently Asked
              </h3>
              <div className="space-y-2.5">
                {FAQS.map((faq, i) => (
                  <div key={i} className="border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                      className="w-full text-left text-xs font-bold text-slate-700 hover:text-emerald-700 flex justify-between items-center py-1 cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <span className="text-slate-400 text-xs font-normal">
                        {activeFaq === i ? '−' : '+'}
                      </span>
                    </button>
                    {activeFaq === i && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-[11px] text-slate-500 mt-1 leading-relaxed"
                      >
                        {faq.a}
                      </motion.p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Done / Report Success Celebratory Modal */}
      <AnimatePresence>
        {submittedInfo && (
          <ReportSuccessModal
            info={submittedInfo}
            onClose={() => setSubmittedInfo(null)}
            onResetForm={() => {
              setTitle('');
              setDescription('');
              setSelectedCategory('');
              setSeverity('medium');
              setAddress('');
              setPhotos([]);
              setPhotoPreviews([]);
              setCoords(null);
              setSubmittedInfo(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
