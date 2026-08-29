import {
  BarChart3,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
} from 'lucide-react';

const OVERVIEW_CARDS = [
  {
    title: 'Total Reports',
    value: '12,547',
    change: '+12.5%',
    up: true,
    icon: <BarChart3 size={22} />,
    bg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    title: 'Resolved',
    value: '8,231',
    change: '+8.2%',
    up: true,
    icon: <CheckCircle size={22} />,
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Pending',
    value: '2,316',
    change: '-3.1%',
    up: false,
    icon: <Clock size={22} />,
    bg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  {
    title: 'Active Citizens',
    value: '25,892',
    change: '+18.7%',
    up: true,
    icon: <Users size={22} />,
    bg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
];

const CATEGORY_DATA = [
  { name: 'Potholes & Roads', count: 3421, pct: 27, color: 'bg-red-400' },
  { name: 'Garbage & Waste', count: 2856, pct: 23, color: 'bg-green-400' },
  { name: 'Streetlights', count: 1987, pct: 16, color: 'bg-yellow-400' },
  { name: 'Drainage', count: 1743, pct: 14, color: 'bg-blue-400' },
  { name: 'Water Supply', count: 1376, pct: 11, color: 'bg-cyan-400' },
  { name: 'Others', count: 1164, pct: 9, color: 'bg-gray-400' },
];

const RECENT_ACTIVITY = [
  {
    action: 'Report #CR-4521 assigned to Maintenance Team',
    time: '5 min ago',
    type: 'assign',
  },
  {
    action: 'Report #CR-4498 status changed to In Progress',
    time: '12 min ago',
    type: 'progress',
  },
  {
    action: 'Report #CR-4467 has been Resolved',
    time: '1 hr ago',
    type: 'resolved',
  },
  {
    action: 'New report #CR-4530 submitted in Sector 14',
    time: '2 hr ago',
    type: 'new',
  },
  {
    action: 'Report #CR-4312 verified by citizen',
    time: '3 hr ago',
    type: 'verified',
  },
];

const TOP_AREAS = [
  { name: 'MG Road, Sector 12', reports: 342 },
  { name: 'Gandhi Nagar', reports: 289 },
  { name: 'City Center', reports: 267 },
  { name: 'Ring Road', reports: 234 },
  { name: 'Industrial Area', reports: 198 },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 py-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm text-white/90 font-medium mb-4">
            <BarChart3 size={16} />
            Analytics Dashboard
          </div>
          <h1 className="font-primary text-4xl max-md:text-3xl font-extrabold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-white/80 text-base">
            Overview of civic issue reporting across your city
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 -mt-6 pb-20">
        {/* Overview Cards */}
        <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-5 mb-8">
          {OVERVIEW_CARDS.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.iconColor} flex items-center justify-center`}>
                  {card.icon}
                </div>
                <span
                  className={`flex items-center gap-0.5 text-xs font-bold ${
                    card.up ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {card.change}
                </span>
              </div>
              <h3 className="font-primary text-2xl font-extrabold text-gray-900">{card.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{card.title}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-[1fr_380px] max-lg:grid-cols-1 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-primary text-lg font-bold text-gray-900 mb-6">
                Issues by Category
              </h3>
              <div className="space-y-4">
                {CATEGORY_DATA.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      <span className="text-sm text-gray-500">
                        {cat.count.toLocaleString()} ({cat.pct}%)
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cat.color} transition-all duration-1000`}
                        style={{ width: `${cat.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resolution Time Chart (Visual representation) */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-primary text-lg font-bold text-gray-900 mb-6">
                Monthly Resolution Trend
              </h3>
              <div className="flex items-end gap-3 h-[200px] pb-4">
                {[
                  { month: 'Mar', resolved: 720, total: 980 },
                  { month: 'Apr', resolved: 830, total: 1050 },
                  { month: 'May', resolved: 910, total: 1120 },
                  { month: 'Jun', resolved: 1050, total: 1280 },
                  { month: 'Jul', resolved: 1180, total: 1350 },
                  { month: 'Aug', resolved: 1240, total: 1400 },
                ].map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col items-center gap-1 flex-1 justify-end">
                      <div
                        className="w-full max-w-[40px] bg-gray-200 rounded-t-md relative"
                        style={{ height: `${(d.total / 1400) * 160}px` }}
                      >
                        <div
                          className="absolute bottom-0 w-full bg-green-500 rounded-t-md"
                          style={{ height: `${(d.resolved / 1400) * 160}px` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{d.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-6 mt-2 justify-center">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-3 h-3 rounded bg-gray-200" />
                  Total Reports
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-3 h-3 rounded bg-green-500" />
                  Resolved
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-primary text-lg font-bold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {RECENT_ACTIVITY.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        item.type === 'resolved'
                          ? 'bg-green-500'
                          : item.type === 'progress'
                            ? 'bg-yellow-500'
                            : item.type === 'new'
                              ? 'bg-blue-500'
                              : 'bg-gray-400'
                      }`}
                    />
                    <div>
                      <p className="text-sm text-gray-700">{item.action}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Areas */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-primary text-lg font-bold text-gray-900 mb-4">
                Top Reporting Areas
              </h3>
              <div className="space-y-3">
                {TOP_AREAS.map((area, i) => (
                  <div
                    key={area.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <MapPin size={14} className="text-gray-400" />
                        {area.name}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{area.reports}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-green-700 to-emerald-600 rounded-2xl p-6 text-white">
              <h3 className="font-primary text-lg font-bold mb-4">Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Avg Response', value: '4.2h' },
                  { label: 'Avg Resolution', value: '3.2d' },
                  { label: 'Satisfaction', value: '94%' },
                  { label: 'Repeat Rate', value: '2.1%' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-extrabold">{stat.value}</p>
                    <p className="text-xs text-white/70 mt-0.5">{stat.label}</p>
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
