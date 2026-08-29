import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Globe, Shield, Menu, X, User, LogOut, Briefcase, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Report Issue', to: '/report' },
  { label: 'Track Issue', to: '/track' },
  { label: 'Dashboard', to: '/dashboard' },
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
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-100 px-6 transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[72px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5" id="logo">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white shadow-sm shadow-green-600/30">
            <Shield size={22} />
          </div>
          <div>
            <h1 className="font-primary text-[1.35rem] font-extrabold text-gray-900 leading-tight">
              CivicLink
            </h1>
            <span className="text-[0.72rem] text-gray-500 font-medium tracking-wide">
              Better Cities, Together
            </span>
          </div>
        </Link>

        {/* Nav Links - Desktop */}
        <div className="hidden lg:flex items-center gap-8" id="nav-links">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`text-[0.9rem] font-medium transition-colors relative ${
                  isActive ? 'text-gray-900 nav-active' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            className="flex items-center gap-1.5 text-sm text-gray-600 px-3 py-1.5 border border-gray-200 rounded-full hover:border-gray-300 transition-colors cursor-pointer"
            id="lang-selector"
          >
            <Globe size={16} />
            English
            <ChevronDown size={14} />
          </button>

          {isAuthenticated && user ? (
            /* Logged-In User Badge & Menu */
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
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in-up">
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
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated Login & Sign Up buttons */
            <>
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-5 py-2 border-2 border-green-600 rounded-full text-sm font-semibold text-green-700 hover:bg-green-50 transition-colors cursor-pointer"
                id="btn-login"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="px-5 py-2.5 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-600/30 transition-all cursor-pointer"
                id="btn-signup"
              >
                Sign Up
              </button>
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
      {mobileOpen && (
        <div className="lg:hidden pb-4 border-t border-gray-100 pt-4 flex flex-col gap-3 animate-fade-in-up">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-2 py-1"
            >
              {link.label}
            </Link>
          ))}
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
                  className="text-xs text-red-600 font-bold px-3 py-1.5 bg-red-50 rounded-lg hover:bg-red-100"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="flex-1 px-4 py-2 border-2 border-green-600 rounded-full text-sm font-semibold text-green-700 text-center"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold text-center"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

