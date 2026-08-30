import { useState } from 'react';
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
} from 'lucide-react';

const WARDS_CONFIG = [
  { id: 'Ward 1', name: 'Ward 1: Central Commercial Zone', chief: 'Eng. Rajesh Sharma', phone: '+91 98765 43210', crews: 4, specialty: 'Roads & Asphalt Paving' },
  { id: 'Ward 2', name: 'Ward 2: North Extension & Markets', chief: 'Eng. Sunita Verma', phone: '+91 98765 43211', crews: 3, specialty: 'Sanitation & Waste Clearing' },
  { id: 'Ward 3', name: 'Ward 3: University District', chief: 'Eng. Amit Joshi', phone: '+91 98765 43212', crews: 3, specialty: 'Electrical & Power Grid' },
  { id: 'Ward 4', name: 'Ward 4: Metro & Corridor', chief: 'Eng. Preeti Rao', phone: '+91 98765 43213', crews: 5, specialty: 'Drainage & Stormwater' },
  { id: 'Ward 5', name: 'Ward 5: Old Heritage Area', chief: 'Eng. Vikram Seth', phone: '+91 98765 43214', crews: 3, specialty: 'Emergency Response' },
  { id: 'Ward 6', name: 'Ward 6: Green Park & Lake', chief: 'Eng. Devendra Patel', phone: '+91 98765 43215', crews: 2, specialty: 'Sanitation & Parks' },
  { id: 'Ward 7', name: 'Ward 7: Industrial Corridor', chief: 'Eng. Neha Gupta', phone: '+91 98765 43216', crews: 4, specialty: 'Heavy Infrastructure' },
  { id: 'Ward 8', name: 'Ward 8: South Residential Enclave', chief: 'Eng. Sanjay Mehta', phone: '+91 98765 43217', crews: 3, specialty: 'Water Supply & Pipelines' },
];

export default function AdminCrewsView({ issues = [] }) {
  const [selectedWard, setSelectedWard] = useState(null);

  // Group active dispatches per ward
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

  return (
    <div className="space-y-6">
      {/* Header Overview Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-200/50 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-emerald-700">8 Municipal Ward Maintenance Units Online</span>
          </div>
          <h3 className="font-primary text-xl font-black text-slate-900">
            Field Crew Deployment & Real-Time Tracking
          </h3>
          <p className="text-xs text-slate-500">
            Track on-duty field repair teams, assigned maintenance engineers, and active work orders across all municipal zones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
            <UserCheck size={15} className="text-emerald-600" />
            <span>27 Technicians Deployed</span>
          </div>
        </div>
      </div>

      {/* Ward Crew Cards Grid */}
      <div className="grid grid-cols-4 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-5">
        {WARDS_CONFIG.map((w) => {
          const wardJobs = getWardJobs(w.id);
          const inProgress = wardJobs.filter((j) => j.status === 'in_progress').length;
          const assigned = wardJobs.filter((j) => j.status === 'assigned').length;
          const completed = wardJobs.filter((j) => j.status === 'resolved').length;

          return (
            <div
              key={w.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header ribbon */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {w.specialty}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">{w.crews} Crews</span>
                </div>

                <h4 className="font-primary text-base font-bold text-slate-900 mb-1 leading-snug">
                  {w.name}
                </h4>
                <p className="text-xs text-slate-600 mb-0.5 flex items-center gap-1 font-medium">
                  <UserCheck size={12} className="text-slate-400" />
                  Lead: <b className="text-slate-800">{w.chief}</b>
                </p>
                <p className="text-[11px] text-slate-400 mb-4 flex items-center gap-1">
                  <Phone size={11} className="text-slate-400" />
                  {w.phone}
                </p>
              </div>

              {/* Real-time Ward Task Tracker */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Queued</span>
                    <p className="font-bold text-xs text-blue-700">{assigned}</p>
                  </div>
                  <div className="bg-amber-50 p-2 rounded-xl border border-amber-200">
                    <span className="text-[10px] text-amber-700 font-bold uppercase">Active</span>
                    <p className="font-bold text-xs text-amber-900">{inProgress}</p>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 font-bold uppercase">Done</span>
                    <p className="font-bold text-xs text-emerald-900">{completed}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 pt-1">
                  <span>Current Total Load:</span>
                  <span className="text-emerald-700 font-bold">{wardJobs.length} Assigned Jobs</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
