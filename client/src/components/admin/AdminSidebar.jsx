import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Briefcase,
  MapPin,
  BarChart3,
  Users,
  Home,
  LogOut,
  RefreshCw,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ activeTab, onTabChange, onRefresh, loading }) {
  const { user, logout } = useAuth();

  const NAV_ITEMS = [
    { id: 'reports', label: 'Reports & Dispatch', icon: <Briefcase size={17} /> },
    { id: 'map', label: 'City Incident Map', icon: <MapPin size={17} /> },
    { id: 'analytics', label: 'Ward SLA Analytics', icon: <BarChart3 size={17} /> },
    { id: 'wards', label: 'Crew Deployment', icon: <Users size={17} /> },
  ];

  return (
    <aside className="w-64 bg-white text-slate-800 flex flex-col border-r border-slate-200/80 shrink-0 min-h-screen sticky top-0 shadow-xs z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100">
        <Link to="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Shield size={22} />
          </div>
          <div>
            <h2 className="font-primary text-base font-black text-slate-900 leading-tight">
              Civic<span className="text-emerald-600">Control</span>
            </h2>
            <span className="inline-block text-[10px] text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 mt-0.5">
              Admin Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Admin User Profile Card */}
      <div className="p-4 mx-4 mt-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Chief Admin'}</p>
            <span className="inline-block text-[10px] font-bold text-emerald-700">
              {user?.role === 'worker' ? 'Field Worker' : 'Chief Administrator'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Admin Navigation */}
      <div className="p-4 flex-1 space-y-1.5">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Management Controls
        </p>
        {NAV_ITEMS.map((item) => {
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {isSelected && <ChevronRight size={14} className="text-emerald-200" />}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer Controls */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-emerald-600' : 'text-slate-500'} />
            <span>Refresh Live Data</span>
          </button>
        )}

        <Link
          to="/"
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Home size={15} />
            <span>Public Website</span>
          </div>
          <ExternalLink size={12} className="text-slate-400" />
        </Link>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
