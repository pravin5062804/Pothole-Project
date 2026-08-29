import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Globe, Shield, Menu, X } from 'lucide-react';

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
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav
      id="navbar"
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 px-6 transition-shadow duration-200 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[72px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5" id="logo">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
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
          <Link
            to="/login"
            className="px-5 py-2 border-2 border-green-600 rounded-full text-sm font-semibold text-green-700 hover:bg-green-50 transition-colors"
            id="btn-login"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2.5 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-600/30 transition-all"
            id="btn-signup"
          >
            Sign Up
          </Link>
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
          <div className="flex gap-3 mt-2 px-2">
            <Link
              to="/login"
              className="px-4 py-2 border-2 border-green-600 rounded-full text-sm font-semibold text-green-700"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
