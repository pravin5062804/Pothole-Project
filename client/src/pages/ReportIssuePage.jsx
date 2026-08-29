import { useState } from 'react';
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
} from 'lucide-react';

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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
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
            {/* Success Message */}
            {submitted && (
              <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 animate-fade-in-up">
                <CheckCircle size={22} className="text-green-600 shrink-0" />
                <div>
                  <p className="font-semibold text-green-800">Issue Reported Successfully!</p>
                  <p className="text-sm text-green-600">
                    Your report ID is #CR-2026-{Math.floor(Math.random() * 9000 + 1000)}. You can
                    track it from the Track Issue page.
                  </p>
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
                  placeholder="Enter address or use current location"
                  className="w-full pl-11 pr-32 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors cursor-pointer"
                >
                  <MapPin size={14} />
                  Use GPS
                </button>
              </div>
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
                Upload Photos
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={() => setDragActive(false)}
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
                <p className="text-xs text-gray-400">Supports JPG, PNG, HEIC up to 10MB</p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-green-600 text-white rounded-xl text-base font-bold hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              Submit Report
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
              <h3 className="font-primary text-lg font-bold mb-4">📊 This Month</h3>
              <div className="space-y-4">
                {[
                  { label: 'Reports Filed', value: '1,247' },
                  { label: 'Avg Resolution', value: '3.2 days' },
                  { label: 'Satisfaction', value: '94%' },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center">
                    <span className="text-white/75 text-sm">{stat.label}</span>
                    <span className="font-bold text-lg">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-primary text-lg font-bold text-gray-900 mb-4">
                🔥 Recent Reports
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Broken streetlight on Park Ave', time: '2 min ago', status: 'New' },
                  { title: 'Garbage overflow near market', time: '15 min ago', status: 'Assigned' },
                  { title: 'Water leakage on 5th Street', time: '1 hr ago', status: 'In Progress' },
                ].map((report) => (
                  <div
                    key={report.title}
                    className="flex items-start justify-between gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">{report.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{report.time}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full whitespace-nowrap">
                      {report.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
