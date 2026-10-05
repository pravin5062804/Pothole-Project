import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe, Shield, Menu, X, User, LogOut, Briefcase, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {logo} from "../../assets/logo.png";

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Report Issue', to: '/report' },
  { label: 'Track Issue', to: '/track' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and dropdown on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin',
          icon: <Shield size={12} />,
          bg: 'bg-purple-100 text-purple-700 border-purple-200',
        };
      case 'worker':
        return {
          label: 'Worker',
          icon: <Briefcase size={12} />,
          bg: 'bg-blue-100 text-blue-700 border-blue-200',
        };
      default:
        return {
          label: 'Citizen',
          icon: <UserCheck size={12} />,
          bg: 'bg-green-100 text-green-700 border-green-200',
        };
    }
  };

  return (
    <nav
      id="navbar"
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-100 px-6 transition-shadow duration-200 ${scrolled ? 'shadow-md' : ''
        }`}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[72px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            className="flex items-center"
          >
            <img
              src={logo}
              alt="FixMyCity"
              className="h-11 w-auto object-contain"
            />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-primary text-[1.25rem] font-black text-gray-900 tracking-tight leading-none group-hover:text-green-600 transition-colors">
              Civic<span className="text-green-600">Link</span>
            </span>
            <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">
              Municipal Portal
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`relative px-3.5 py-2 rounded-lg text-[0.88rem] font-medium transition-colors ${isActive
                    ? 'text-green-700 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-green-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Selector */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full border border-gray-200 transition-colors"
          >
            <Globe size={14} />
            EN
          </button>

          {isAuthenticated && user ? (
            /* Logged-In User Controls */
            <div className="flex items-center gap-2.5">
              {user.role === 'worker' && (
                <Link
                  to="/worker"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-full text-xs font-bold shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-green-700 transition-all"
                >
                  <Briefcase size={13} />
                  <span>Worker Portal</span>
                </Link>
              )}
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-full text-xs font-bold shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-green-700 transition-all"
                >
                  <Shield size={13} />
                  <span>Admin Portal</span>
                </Link>
              )}

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full transition-colors cursor-pointer"
                  id="user-profile-button"
                >
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left leading-tight hidden xl:block">
                    <p className="text-xs font-bold text-gray-800 line-clamp-1 max-w-[100px]">
                      {user.name}
                    </p>
                    <span className="text-[10px] text-gray-500 capitalize">{user.role}</span>
                  </div>
                  <ChevronDown size={14} className="text-gray-500" />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 origin-top-right"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <div className="mt-2 flex items-center gap-1.5">
                          {(() => {
                            const badge = getRoleBadge(user.role);
                            return (
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bg}`}
                              >
                                {badge.icon}
                                {badge.label}
                              </span>
                            );
                          })()}
                          {user.ward && (
                            <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                              {user.ward}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="py-1">
                        {(user.role === 'admin' || user.role === 'worker') && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 bg-emerald-50/50"
                          >
                            <Shield size={14} className="text-emerald-600" />
                            Open Admin Portal
                          </Link>
                        )}
                        <Link
                          to="/report"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Report a New Issue
                        </Link>
                        <Link
                          to="/track"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Track My Reports
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            /* Unauthenticated Login & Sign Up buttons */
            <>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-5 py-2 border-2 border-green-600 rounded-full text-sm font-semibold text-green-700 hover:bg-green-50 transition-colors cursor-pointer"
                id="btn-login"
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => openAuthModal('signup')}
                className="px-5 py-2.5 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-700 shadow-md shadow-green-600/25 hover:shadow-lg transition-all cursor-pointer"
                id="btn-signup"
              >
                Sign Up
              </motion.button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="flex lg:hidden p-1 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          id="mobile-menu-toggle"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden pb-4 border-t border-gray-100 pt-4 flex flex-col gap-3 overflow-hidden"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-2 py-1"
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && user && (user.role === 'admin' || user.role === 'worker') && (
              <Link
                to="/admin"
                className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl flex items-center gap-2"
              >
                <Shield size={16} />
                <span>Admin Operations Portal</span>
              </Link>
            )}

            <div className="flex flex-col gap-2 mt-2 px-2">
              {isAuthenticated && user ? (
                <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-xs text-red-600 font-bold px-3 py-1.5 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="flex-1 px-4 py-2 border-2 border-green-600 rounded-full text-sm font-semibold text-green-700 text-center cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuthModal('signup')}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold text-center cursor-pointer shadow-md"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
