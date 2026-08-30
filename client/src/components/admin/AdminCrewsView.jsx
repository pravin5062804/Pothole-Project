import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Briefcase,
  UserCheck,
  Zap,
  ChevronRight,
  Shield,
  Search,
  Filter,
  Wrench,
  Truck,
  HardHat,
  AlertTriangle,
  Radio,
  Sparkles,
  X,
  ExternalLink,
  Activity,
  ArrowUpRight,
} from 'lucide-react';

const WARDS_CONFIG = [
  {
    id: 'Ward 1',
    name: 'Ward 1: Central Commercial Zone',
    chief: 'Eng. Rajesh Sharma',
    phone: '+91 98765 43210',
    crews: 4,
    technicians: 16,
    specialty: 'Roads & Asphalt Paving',
    categoryKey: 'pothole',
    color: 'emerald',
    icon: Truck,
    description: 'High-speed pothole patching & arterial road resurfacing units.',
  },
  {
    id: 'Ward 2',
    name: 'Ward 2: North Extension & Markets',
    chief: 'Eng. Sunita Verma',
    phone: '+91 98765 43211',
    crews: 3,
    technicians: 12,
    specialty: 'Sanitation & Waste Clearing',
    categoryKey: 'garbage',
    color: 'amber',
    icon: HardHat,
    description: 'Commercial waste disposal, compactor trucks & market sanitization.',
  },
  {
    id: 'Ward 3',
    name: 'Ward 3: University District',
    chief: 'Eng. Amit Joshi',
    phone: '+91 98765 43212',
    crews: 3,
    technicians: 9,
    specialty: 'Electrical & Power Grid',
    categoryKey: 'streetlight',
    color: 'yellow',
    icon: Zap,
    description: 'LED streetlighting, high-voltage transformers & feeder repair teams.',
  },
  {
    id: 'Ward 4',
    name: 'Ward 4: Metro & Corridor',
    chief: 'Eng. Preeti Rao',
    phone: '+91 98765 43213',
    crews: 5,
    technicians: 20,
    specialty: 'Drainage & Stormwater',
    categoryKey: 'drainage',
    color: 'cyan',
    icon: Wrench,
    description: 'Stormwater culverts, jetting suction machines & flood barrier crew.',
  },
  {
    id: 'Ward 5',
    name: 'Ward 5: Old Heritage Area',
    chief: 'Eng. Vikram Seth',
    phone: '+91 98765 43214',
    crews: 3,
    technicians: 10,
    specialty: 'Emergency Response',
    categoryKey: 'other',
    color: 'rose',
    icon: Shield,
    description: 'Rapid response for structural hazards, tree falls & safety cordons.',
  },
  {
    id: 'Ward 6',
    name: 'Ward 6: Green Park & Lake',
    chief: 'Eng. Devendra Patel',
    phone: '+91 98765 43215',
    crews: 2,
    technicians: 8,
    specialty: 'Sanitation & Parks',
    categoryKey: 'garbage',
    color: 'green',
    icon: Users,
    description: 'Public park upkeep, lake shore waste collection & recycling units.',
  },
  {
    id: 'Ward 7',
    name: 'Ward 7: Industrial Corridor',
    chief: 'Eng. Neha Gupta',
    phone: '+91 98765 43216',
    crews: 4,
    technicians: 15,
    specialty: 'Heavy Infrastructure',
    categoryKey: 'pothole',
    color: 'indigo',
    icon: Briefcase,
    description: 'Heavy vehicle transit lanes, industrial bypasses & drainage conduits.',
  },
  {
    id: 'Ward 8',
    name: 'Ward 8: South Residential Enclave',
    chief: 'Eng. Sanjay Mehta',
    phone: '+91 98765 43217',
    crews: 3,
    technicians: 11,
    specialty: 'Water Supply & Pipelines',
    categoryKey: 'water',
    color: 'blue',
    icon: Activity,
    description: 'Main potable line leak repairs, pressure valves & tanker dispatch.',
  },
];

const SPECIALTY_FILTERS = [
  'All Specialties',
  'Roads & Asphalt Paving',
  'Sanitation & Waste Clearing',
  'Electrical & Power Grid',
  'Drainage & Stormwater',
  'Water Supply & Pipelines',
  'Emergency Response',
];

export default function AdminCrewsView({
  issues = [],
  onOpenStatusModal,
  onAutoDispatchSingle,
  onBatchAutoDispatch,
  isDispatching = false,
}) {
  const [selectedWard, setSelectedWard] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');

  // Match jobs to ward
  const getWardJobs = (wardId) => {
    return issues.filter((issue) => {
      const wardStr = (issue.ward || '').toLowerCase();
      const crewStr = (issue.assignedCrewName || '').toLowerCase();
      const addressStr = (issue.address || '').toLowerCase();
      const target = wardId.toLowerCase();

      return (
        wardStr.includes(target) ||
        crewStr.includes(target) ||
        addressStr.includes(target)
      );
    });
  };

  // Filtered wards based on search & specialty
  const filteredWards = useMemo(() => {
    return WARDS_CONFIG.filter((w) => {
      const matchesSearch =
        searchQuery === '' ||
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.chief.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.specialty.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === 'All Specialties' ||
        w.specialty.toLowerCase() === selectedSpecialty.toLowerCase();

      return matchesSearch && matchesSpecialty;
    });
  }, [searchQuery, selectedSpecialty]);

  // Overall Global Crew Stats
  const totalCrews = WARDS_CONFIG.reduce((acc, w) => acc + w.crews, 0);
  const totalTechnicians = WARDS_CONFIG.reduce((acc, w) => acc + w.technicians, 0);
  const totalActiveJobs = issues.filter((i) =>
    ['in_progress', 'assigned'].includes(i.status)
  ).length;
  const unassignedJobs = issues.filter(
    (i) => i.status === 'reported' || !i.assignedCrewName
  ).length;

  return (
    <div className="space-y-6">
      {/* ─── Hero Overview Banner (Clean White Theme) ─── */}
      <div className="relative overflow-hidden bg-white rounded-3xl p-7 border border-slate-200/80 shadow-md shadow-slate-200/40">
        <div className="relative z-10 flex items-center justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-xs font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Municipal Field Operations Center • Live Dispatch Active</span>
            </div>
            <h2 className="font-primary text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Field Crew Deployment & Ward Operations
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              Coordinate {totalCrews} specialized maintenance crews and {totalTechnicians} on-ground municipal engineers across 8 strategic city wards in real-time.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            {onBatchAutoDispatch && (
              <button
                type="button"
                onClick={onBatchAutoDispatch}
                disabled={isDispatching || unassignedJobs === 0}
                className="px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap size={16} className={isDispatching ? 'animate-spin' : 'text-yellow-200 fill-yellow-200'} />
                <span>
                  {isDispatching
                    ? 'Dispatching Crews...'
                    : unassignedJobs > 0
                    ? `Auto-Deploy ${unassignedJobs} Queued Jobs`
                    : 'All Reports Dispatched'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Live Metrics Row inside Hero (White Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 transition-all hover:bg-slate-100/70">
            <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Total Active Units</p>
            <p className="font-primary text-2xl font-black text-slate-900 mt-0.5">{totalCrews} Crews</p>
            <p className="text-[10px] text-slate-500 font-medium">{totalTechnicians} Field Technicians</p>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-4 transition-all hover:bg-amber-50">
            <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Live In-Progress</p>
            <p className="font-primary text-2xl font-black text-amber-900 mt-0.5">{totalActiveJobs} Tasks</p>
            <p className="text-[10px] text-amber-700/80 font-medium">On-ground active repair</p>
          </div>

          <div className="bg-cyan-50/60 border border-cyan-200/70 rounded-2xl p-4 transition-all hover:bg-cyan-50">
            <p className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider">Pending Dispatch</p>
            <p className="font-primary text-2xl font-black text-cyan-900 mt-0.5">{unassignedJobs} Reports</p>
            <p className="text-[10px] text-cyan-700/80 font-medium">Awaiting crew assignment</p>
          </div>

          <div className="bg-purple-50/60 border border-purple-200/70 rounded-2xl p-4 transition-all hover:bg-purple-50">
            <p className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Ward Readiness</p>
            <p className="font-primary text-2xl font-black text-purple-900 mt-0.5">100% Online</p>
            <p className="text-[10px] text-purple-700/80 font-medium">All 8 Wards Connected</p>
          </div>
        </div>
      </div>

      {/* ─── Search & Specialty Filter Bar ─── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Ward name, chief engineer, or specialty..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Specialty Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {SPECIALTY_FILTERS.map((spec) => {
            const isSelected = selectedSpecialty === spec;
            return (
              <button
                key={spec}
                type="button"
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {spec}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Ward Cards Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {filteredWards.map((w) => {
          const wardJobs = getWardJobs(w.id);
          const inProgress = wardJobs.filter((j) => j.status === 'in_progress').length;
          const assigned = wardJobs.filter((j) => j.status === 'assigned').length;
          const completed = wardJobs.filter((j) => j.status === 'resolved').length;
          const critical = wardJobs.filter((j) => j.severity === 'critical').length;
          const totalLoad = inProgress + assigned;

          // Capacity level
          const capacityMax = w.crews * 4; // Each crew handles ~4 tasks
          const loadPercent = Math.min(Math.round((totalLoad / Math.max(capacityMax, 1)) * 100), 100);
          const isHighLoad = loadPercent > 70;

          const IconComponent = w.icon;

          return (
            <motion.div
              key={w.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  isHighLoad
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />

              <div>
                {/* Header Badge & Crew Counter */}
                <div className="flex items-center justify-between gap-2 mb-3 mt-1">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <IconComponent size={12} className="text-emerald-600 shrink-0" />
                    <span className="truncate max-w-[130px]">{w.specialty}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-slate-500">{w.crews} Crews</span>
                  </div>
                </div>

                {/* Ward Title & Description */}
                <h3 className="font-primary text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                  {w.name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {w.description}
                </p>

                {/* Engineer / Lead Card */}
                <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                      {w.chief.split(' ')[1]?.[0] || 'E'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unit Chief</p>
                      <p className="text-xs font-bold text-slate-800 truncate">{w.chief}</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${w.phone}`}
                    className="p-2 bg-white hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-xl border border-slate-200/80 transition-colors shadow-2xs"
                    title={`Call ${w.chief}`}
                  >
                    <Phone size={13} />
                  </a>
                </div>

                {/* Capacity & Workload Bar */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-500">Crew Workload:</span>
                    <span className={`font-black ${isHighLoad ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {loadPercent}% ({totalLoad} Active)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isHighLoad ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(loadPercent, 5)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Real-time Stats & Action Footer */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-3">
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                    <span className="text-[9px] text-slate-400 font-black uppercase">Queued</span>
                    <p className="font-black text-xs text-blue-600 mt-0.5">{assigned}</p>
                  </div>
                  <div className="bg-amber-50 p-2 rounded-xl border border-amber-200/80">
                    <span className="text-[9px] text-amber-700 font-black uppercase">Fixing</span>
                    <p className="font-black text-xs text-amber-800 mt-0.5">{inProgress}</p>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200/80">
                    <span className="text-[9px] text-emerald-700 font-black uppercase">Done</span>
                    <p className="font-black text-xs text-emerald-800 mt-0.5">{completed}</p>
                  </div>
                </div>

                {critical > 0 && (
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200/70 px-2.5 py-1 rounded-xl">
                    <AlertTriangle size={12} className="shrink-0 text-rose-600 animate-bounce" />
                    <span>{critical} Critical Emergency Alert</span>
                  </div>
                )}

                {/* Inspect Ward Tasks Button */}
                <button
                  type="button"
                  onClick={() => setSelectedWard(w)}
                  className="w-full py-2.5 px-3 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md"
                >
                  <Briefcase size={13} />
                  <span>Inspect Ward Tasks ({wardJobs.length})</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Ward Detail Drawer / Inspection Modal ─── */}
      <AnimatePresence>
        {selectedWard && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    {selectedWard.specialty}
                  </span>
                  <h3 className="font-primary text-xl font-black text-white mt-1.5">
                    {selectedWard.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Lead: <b>{selectedWard.chief}</b> • {selectedWard.crews} Field Crews ({selectedWard.technicians} Techs)
                  </p>
                </div>

                <button
                  onClick={() => setSelectedWard(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body: Active Jobs in this Ward */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Assigned Ward Incidents & Work Orders
                  </h4>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {getWardJobs(selectedWard.id).length} Total Tasks
                  </span>
                </div>

                {getWardJobs(selectedWard.id).length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                    <p className="text-xs font-bold text-slate-700">All Clear in this Ward!</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">No pending or active repairs assigned right now.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getWardJobs(selectedWard.id).map((job) => (
                      <div
                        key={job._id || job.id}
                        className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-all flex items-center justify-between gap-4 flex-wrap"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {job.photos?.[0]?.url ? (
                            <img
                              src={job.photos[0].url}
                              alt="Job evidence"
                              className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                              <Briefcase size={20} />
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-[10px] font-bold uppercase text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                                {job.category}
                              </span>
                              <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                                  job.severity === 'critical'
                                    ? 'bg-rose-100 text-rose-800'
                                    : job.severity === 'high'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {job.severity}
                              </span>
                              <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                                  job.status === 'resolved'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : job.status === 'in_progress'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {job.status.replace('_', ' ')}
                              </span>
                            </div>

                            <p className="font-primary text-xs font-bold text-slate-900 truncate">
                              {job.title}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                              <MapPin size={10} />
                              {job.address || 'Geo-tagged street location'}
                            </p>
                          </div>
                        </div>

                        {onOpenStatusModal && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedWard(null);
                              onOpenStatusModal(job);
                            }}
                            className="px-3.5 py-2 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
                          >
                            Update Work
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <a
                  href={`tel:${selectedWard.phone}`}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <Phone size={13} />
                  <span>Call {selectedWard.chief}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedWard(null)}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
