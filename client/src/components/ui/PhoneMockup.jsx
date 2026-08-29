/**
 * Realistic phone mockup SVG matching the reference design.
 * Shows the CivicLink app with proper UI elements, shadows, and depth.
 */
export default function PhoneMockup({ className = '' }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 300 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.2)) drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}>
        {/* Phone outer frame with realistic metal edge */}
        <defs>
          <linearGradient id="frameGrad" x1="0" y1="0" x2="300" y2="600" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e5e7eb" />
            <stop offset="50%" stopColor="#d1d5db" />
            <stop offset="100%" stopColor="#c0c4ca" />
          </linearGradient>
          <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="600" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fafafa" />
            <stop offset="100%" stopColor="#f5f5f5" />
          </linearGradient>
          <filter id="cardShadow" x="-4" y="-2" width="108%" height="115%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
          </filter>
          <clipPath id="screenClip">
            <rect x="12" y="12" width="276" height="576" rx="34" />
          </clipPath>
        </defs>

        {/* Frame */}
        <rect x="0" y="0" width="300" height="600" rx="40" fill="url(#frameGrad)" />
        {/* Screen area */}
        <rect x="6" y="6" width="288" height="588" rx="37" fill="white" />

        <g clipPath="url(#screenClip)">
          {/* Status bar background */}
          <rect x="12" y="12" width="276" height="44" fill="white" />
          
          {/* Status bar */}
          <text x="32" y="40" fontSize="13" fill="#1f2937" fontWeight="600" fontFamily="system-ui, sans-serif">9:41</text>
          {/* Signal bars */}
          <rect x="220" y="32" width="3" height="6" rx="1" fill="#1f2937" />
          <rect x="225" y="30" width="3" height="8" rx="1" fill="#1f2937" />
          <rect x="230" y="27" width="3" height="11" rx="1" fill="#1f2937" />
          <rect x="235" y="24" width="3" height="14" rx="1" fill="#1f2937" />
          {/* WiFi */}
          <path d="M248 35c3-3 3-3 0-6M245 32c5-5 5-5 0-10" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7"/>
          {/* Battery */}
          <rect x="258" y="28" width="22" height="11" rx="3" stroke="#1f2937" strokeWidth="1.5" fill="none" />
          <rect x="260" y="30" width="15" height="7" rx="1.5" fill="#22c55e" />
          <rect x="280" y="31" width="2" height="5" rx="1" fill="#1f2937" opacity="0.4" />

          {/* Dynamic island / notch */}
          <rect x="110" y="16" width="80" height="26" rx="13" fill="#111827" />

          {/* ===== App Content ===== */}
          
          {/* Greeting */}
          <text x="28" y="84" fontSize="19" fill="#111827" fontWeight="800" fontFamily="system-ui, sans-serif">Hello, Citizen! 👋</text>
          <text x="28" y="104" fontSize="11.5" fill="#9ca3af" fontFamily="system-ui, sans-serif">How can we help improve your city today?</text>

          {/* Report New Issue Card */}
          <rect x="22" y="120" width="256" height="80" rx="16" fill="#16a34a" filter="url(#cardShadow)" />
          <rect x="22" y="120" width="256" height="80" rx="16" fill="url(#reportGrad)" />
          <defs>
            <linearGradient id="reportGrad" x1="22" y1="120" x2="278" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
          </defs>
          <text x="40" y="152" fontSize="15" fill="white" fontWeight="700" fontFamily="system-ui, sans-serif">Report New Issue</text>
          <text x="40" y="172" fontSize="10.5" fill="rgba(255,255,255,0.75)" fontFamily="system-ui, sans-serif">Help your city by reporting issues</text>
          <text x="40" y="186" fontSize="10.5" fill="rgba(255,255,255,0.75)" fontFamily="system-ui, sans-serif">around you.</text>
          {/* Arrow button */}
          <circle cx="252" cy="160" r="18" fill="rgba(255,255,255,0.2)" />
          <path d="M246 160h12M254 155l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Popular Categories Header */}
          <text x="28" y="232" fontSize="14" fill="#111827" fontWeight="700" fontFamily="system-ui, sans-serif">Popular Categories</text>
          <text x="224" y="232" fontSize="11" fill="#16a34a" fontWeight="600" fontFamily="system-ui, sans-serif">View all</text>

          {/* Category Row 1 */}
          {/* Potholes */}
          <rect x="22" y="245" width="78" height="85" rx="16" fill="#fef2f2" />
          <circle cx="61" cy="272" r="16" fill="#fecaca" />
          <path d="M53 276l5-8h6l5 8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M55 272h12" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
          <text x="61" y="308" fontSize="9" fill="#6b7280" textAnchor="middle" fontWeight="500" fontFamily="system-ui, sans-serif">Potholes</text>

          {/* Garbage */}
          <rect x="110" y="245" width="78" height="85" rx="16" fill="#f0fdf4" />
          <circle cx="149" cy="272" r="16" fill="#bbf7d0" />
          <rect x="141" y="266" width="16" height="14" rx="2" fill="#22c55e" />
          <rect x="139" y="263" width="20" height="4" rx="2" fill="#16a34a" />
          <text x="149" y="308" fontSize="9" fill="#6b7280" textAnchor="middle" fontWeight="500" fontFamily="system-ui, sans-serif">Garbage</text>

          {/* Streetlight */}
          <rect x="198" y="245" width="78" height="85" rx="16" fill="#fffbeb" />
          <circle cx="237" cy="272" r="16" fill="#fef3c7" />
          <rect x="236" y="264" width="3" height="18" rx="1" fill="#d97706" />
          <circle cx="237" cy="264" r="4" fill="#fbbf24" />
          <path d="M232 264c0-4 2-6 5-6s5 2 5 6" stroke="#d97706" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <text x="237" y="308" fontSize="9" fill="#6b7280" textAnchor="middle" fontWeight="500" fontFamily="system-ui, sans-serif">Streetlight</text>

          {/* Category Row 2 */}
          {/* Drainage */}
          <rect x="22" y="342" width="78" height="85" rx="16" fill="#eff6ff" />
          <circle cx="61" cy="369" r="16" fill="#dbeafe" />
          <path d="M53 373c3-5 5-8 8-8s5 3 8 8" stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M56 368c2-3 4-6 5-6s3 3 5 6" stroke="#60a5fa" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <text x="61" y="405" fontSize="9" fill="#6b7280" textAnchor="middle" fontWeight="500" fontFamily="system-ui, sans-serif">Drainage</text>

          {/* Water Supply */}
          <rect x="110" y="342" width="78" height="85" rx="16" fill="#f0f9ff" />
          <circle cx="149" cy="369" r="16" fill="#e0f2fe" />
          <path d="M146 362c0 7 3 11 3 11s3-4 3-11c0-3-1-5-3-5s-3 2-3 5z" fill="#38bdf8" stroke="#0ea5e9" strokeWidth="1" />
          <text x="149" y="405" fontSize="9" fill="#6b7280" textAnchor="middle" fontWeight="500" fontFamily="system-ui, sans-serif">Water</text>

          {/* Others */}
          <rect x="198" y="342" width="78" height="85" rx="16" fill="#f5f5f5" />
          <circle cx="237" cy="369" r="16" fill="#e5e7eb" />
          <circle cx="229" cy="369" r="3" fill="#6b7280" />
          <circle cx="237" cy="369" r="3" fill="#6b7280" />
          <circle cx="245" cy="369" r="3" fill="#6b7280" />
          <text x="237" y="405" fontSize="9" fill="#6b7280" textAnchor="middle" fontWeight="500" fontFamily="system-ui, sans-serif">Others</text>

          {/* ===== Bottom Navigation ===== */}
          <rect x="12" y="510" width="276" height="78" fill="white" />
          <line x1="12" y1="510" x2="288" y2="510" stroke="#f3f4f6" strokeWidth="1" />

          {/* Home - active */}
          <path d="M56 530l-9 7v12h6v-7h6v7h6v-12l-9-7z" fill="#16a34a" />
          <text x="56" y="558" fontSize="8" fill="#16a34a" textAnchor="middle" fontWeight="600" fontFamily="system-ui, sans-serif">Home</text>

          {/* Reports */}
          <rect x="102" y="528" width="13" height="16" rx="2" fill="none" stroke="#9ca3af" strokeWidth="1.8" />
          <line x1="106" y1="534" x2="112" y2="534" stroke="#9ca3af" strokeWidth="1.2" />
          <line x1="106" y1="538" x2="112" y2="538" stroke="#9ca3af" strokeWidth="1.2" />
          <text x="108" y="558" fontSize="8" fill="#9ca3af" textAnchor="middle" fontFamily="system-ui, sans-serif">Reports</text>

          {/* Center Add Button */}
          <circle cx="150" cy="522" r="22" fill="#16a34a" />
          <line x1="142" y1="522" x2="158" y2="522" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <line x1="150" y1="514" x2="150" y2="530" stroke="white" strokeWidth="3" strokeLinecap="round" />

          {/* Updates */}
          <circle cx="192" cy="535" r="8" fill="none" stroke="#9ca3af" strokeWidth="1.8" />
          <path d="M192 531v5l3 2" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
          <text x="192" y="558" fontSize="8" fill="#9ca3af" textAnchor="middle" fontFamily="system-ui, sans-serif">Updates</text>

          {/* Profile */}
          <circle cx="240" cy="532" r="6" fill="none" stroke="#9ca3af" strokeWidth="1.8" />
          <path d="M231 546c0-5 4-8 9-8s9 3 9 8" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <text x="240" y="558" fontSize="8" fill="#9ca3af" textAnchor="middle" fontFamily="system-ui, sans-serif">Profile</text>

          {/* Home indicator */}
          <rect x="115" y="578" width="70" height="5" rx="2.5" fill="#e5e7eb" />
        </g>
      </svg>
    </div>
  );
}
