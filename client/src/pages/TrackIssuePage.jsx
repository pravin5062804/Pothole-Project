import { useState } from 'react';
import {
  Search,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader,
  MapPin,
  Calendar,
  ArrowRight,
  Filter,
} from 'lucide-react';

const MOCK_ISSUES = [
  {
    id: 'CR-2026-4521',
    title: 'Large pothole on MG Road near Central Mall',
    category: 'Potholes & Roads',
    status: 'In Progress',
    statusColor: 'bg-yellow-100 text-yellow-700',
    date: 'Aug 25, 2026',
    location: 'MG Road, Sector 12',
    progress: 65,
  },
  {
    id: 'CR-2026-4498',
    title: 'Overflowing garbage bins near City Park',
    category: 'Garbage & Waste',
    status: 'Assigned',
    statusColor: 'bg-blue-100 text-blue-700',
    date: 'Aug 23, 2026',
    location: 'City Park, Block A',
    progress: 30,
  },
  {
    id: 'CR-2026-4467',
    title: 'Street light not working for 2 weeks',
    category: 'Streetlights',
    status: 'Resolved',
    statusColor: 'bg-green-100 text-green-700',
    date: 'Aug 18, 2026',
    location: 'Ring Road, Junction 5',
    progress: 100,
  },
  {
    id: 'CR-2026-4390',
    title: 'Drainage blockage causing waterlogging',
    category: 'Drainage',
    status: 'Under Review',
    statusColor: 'bg-purple-100 text-purple-700',
    date: 'Aug 15, 2026',
    location: 'Gandhi Nagar, Lane 3',
    progress: 15,
  },
  {
    id: 'CR-2026-4312',
    title: 'Water pipe burst on Highway 4',
    category: 'Water Supply',
    status: 'Resolved',
    statusColor: 'bg-green-100 text-green-700',
    date: 'Aug 10, 2026',
    location: 'Highway 4, KM Marker 12',
    progress: 100,
  },
];

const STATUS_FILTERS = ['All', 'In Progress', 'Assigned', 'Under Review', 'Resolved'];

export default function TrackIssuePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedIssue, setSelectedIssue] = useState(null);

  const filteredIssues = MOCK_ISSUES.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || issue.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm text-white/90 font-medium mb-4">
            <Search size={16} />
            Track Your Reports
          </div>
          <h1 className="font-primary text-4xl max-md:text-3xl font-extrabold text-white mb-3">
            Track an Issue
          </h1>
          <p className="text-white/80 text-lg max-w-[600px]">
            Enter your report ID or search by keywords to check the current status of your reported
            issues.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-[640px]">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Report ID or keywords (e.g., CR-2026-4521)"
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm bg-white shadow-xl border-0 focus:outline-none focus:ring-2 focus:ring-green-300 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 -mt-4 pb-20">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
          <Filter size={16} className="text-gray-400 shrink-0" />
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
              <AlertTriangle size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="font-primary text-lg font-bold text-gray-700 mb-2">No issues found</h3>
              <p className="text-sm text-gray-500">Try a different search or filter.</p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                onClick={() => setSelectedIssue(selectedIssue === issue.id ? null : issue.id)}
              >
                <div className="flex items-start justify-between gap-4 max-sm:flex-col">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-md">
                        {issue.id}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${issue.statusColor}`}
                      >
                        {issue.status}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {issue.date}
                      </span>
                    </div>
                    <h3 className="font-primary text-base font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
                      {issue.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {issue.location}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                        {issue.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 max-sm:w-full max-sm:justify-between">
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-1">Progress</p>
                      <p className="text-lg font-bold text-gray-900">{issue.progress}%</p>
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-gray-400 group-hover:text-green-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      issue.progress === 100 ? 'bg-green-500' : 'bg-green-400'
                    }`}
                    style={{ width: `${issue.progress}%` }}
                  />
                </div>

                {/* Expanded Timeline */}
                {selectedIssue === issue.id && (
                  <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in-up">
                    <h4 className="font-primary text-sm font-bold text-gray-700 mb-4">
                      Status Timeline
                    </h4>
                    <div className="space-y-4">
                      {[
                        {
                          step: 'Report Submitted',
                          done: true,
                          time: issue.date,
                          desc: 'Issue report received and logged.',
                        },
                        {
                          step: 'Under Review',
                          done: issue.progress > 10,
                          time: 'Aug 16, 2026',
                          desc: 'Report being reviewed by authorities.',
                        },
                        {
                          step: 'Assigned',
                          done: issue.progress > 25,
                          time: 'Aug 17, 2026',
                          desc: 'Assigned to maintenance team.',
                        },
                        {
                          step: 'In Progress',
                          done: issue.progress > 50,
                          time: 'Aug 20, 2026',
                          desc: 'Work is underway.',
                        },
                        {
                          step: 'Resolved',
                          done: issue.progress === 100,
                          time: issue.progress === 100 ? 'Aug 22, 2026' : 'Pending',
                          desc: 'Issue has been resolved.',
                        },
                      ].map((t, i) => (
                        <div key={t.step} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                t.done
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 text-gray-400'
                              }`}
                            >
                              {t.done ? (
                                <CheckCircle size={14} />
                              ) : (
                                <Clock size={14} />
                              )}
                            </div>
                            {i < 4 && (
                              <div
                                className={`w-0.5 h-8 ${
                                  t.done ? 'bg-green-300' : 'bg-gray-200'
                                }`}
                              />
                            )}
                          </div>
                          <div className="-mt-0.5">
                            <p
                              className={`text-sm font-semibold ${
                                t.done ? 'text-gray-800' : 'text-gray-400'
                              }`}
                            >
                              {t.step}
                            </p>
                            <p className="text-xs text-gray-400">{t.time}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
