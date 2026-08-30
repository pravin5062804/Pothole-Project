import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Briefcase,
  MapPin,
  BarChart3,
  Users,
  RefreshCw,
  ExternalLink,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminNavbar({
  activeTab,
  onTabChange,
  onRefresh,
  loading,
}) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const NAV_ITEMS = [
    { id: 'reports', label: 'Reports & Dispatch', icon: <Briefcase size={16} /> },
    { id: 'map', label: 'City Heatmap', icon: <MapPin size={16} /> },
    { id: 'analytics', label: 'Ward SLA Analytics', icon: <BarChart3 size={16} /> },
    { id: 'wards', label: 'Crew Deployment', icon: <Users size={16} /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/90 text-slate-900 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand Left */}
        <div className="flex items-center gap-6">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Shield size={22} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-primary text-lg font-black text-slate-900 tracking-tight leading-none">
                  Civic<span className="text-emerald-600">Control</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
                  Admin OS
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Municipal Operations Portal
              </span>
            </div>
          </Link>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1.5 ml-4 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/70">
            {NAV_ITEMS.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Refresh */}
          <button
            type="button"
            onClick={onRefresh}
            title="Refresh Live Data"
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/90 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin text-emerald-600' : ''} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          {/* Switch to Public Citizen Portal */}
          <Link
            to="/"
            title="Go to Citizen Facing Website"
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/90 rounded-xl text-xs font-semibold transition-all"
          >
            <span>Citizen Portal</span>
            <ExternalLink size={12} className="text-slate-400" />
          </Link>

          {/* Admin User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-2xl transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <p className="text-xs font-bold text-slate-900 line-clamp-1 max-w-[110px]">
                  {user?.name || 'Chief Admin'}
                </p>
                <span className="text-[10px] text-emerald-700 font-bold">
                  {user?.role === 'worker' ? 'Field Worker' : 'Administrator'}
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 origin-top-right"
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900">{user?.name || 'Chief Admin'}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@gmail.com'}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Shield size={11} />
                        Authorized Officer
                      </span>
                      {user?.ward && (
                        <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                          {user.ward}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <span>Public Citizen Website</span>
                      <ExternalLink size={12} className="text-slate-400" />
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Sign Out of Admin</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden px-4 pb-3 flex items-center gap-1.5 overflow-x-auto border-t border-slate-100 pt-2.5 bg-white">
        {NAV_ITEMS.map((item) => {
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
