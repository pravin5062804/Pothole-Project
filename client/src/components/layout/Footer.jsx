import { Link } from 'react-router-dom';
import { Shield, Globe, MessageCircle, Briefcase, Camera } from 'lucide-react';

const FOOTER_COLUMNS = [
  {
    title: 'Platform',
    links: [
      { label: 'Report Issue', to: '/report' },
      { label: 'Track Issue', to: '/track' },
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Analytics', to: '/dashboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '#' },
      { label: 'Press', to: '#' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', to: '#' },
      { label: 'Community', to: '#' },
      { label: 'FAQs', to: '#' },
      { label: 'Feedback', to: '#' },
    ],
  },
];

const SOCIAL_LINKS = [
  { Icon: Globe, label: 'Website' },
  { Icon: MessageCircle, label: 'Chat' },
  { Icon: Briefcase, label: 'LinkedIn' },
  { Icon: Camera, label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16" id="footer">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Grid */}
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] max-md:grid-cols-2 max-sm:grid-cols-1 gap-12 mb-12 max-md:gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-primary text-[1.3rem] font-extrabold mb-3 flex items-center gap-2.5">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Shield size={18} />
              </div>
              CivicLink
            </h3>
            <p className="text-gray-400 text-[0.88rem] leading-relaxed mb-5">
              Empowering citizens to build better cities through transparent civic issue reporting
              and resolution.
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-[38px] h-[38px] rounded-[10px] bg-white/[0.08] flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[0.88rem] font-bold uppercase tracking-wider text-gray-300 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-gray-400 text-[0.88rem] hover:text-green-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.08] py-6 flex items-center justify-between max-md:flex-col max-md:gap-3 max-md:text-center">
          <p className="text-gray-500 text-[0.82rem]">© 2026 CivicLink. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((label) => (
              <a
                key={label}
                href="#"
                className="text-gray-500 text-[0.82rem] hover:text-gray-300 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
