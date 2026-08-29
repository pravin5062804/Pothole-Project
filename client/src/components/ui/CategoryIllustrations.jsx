/**
 * Premium SVG illustrations for each issue category.
 * Uses gradients, shadows, and layered shapes for a polished 3D-like look
 * matching the reference design.
 */

export function PotholeIllustration() {
  return (
    <svg viewBox="0 0 140 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[100px] h-[80px]">
      <defs>
        <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#6b7280" />
        </linearGradient>
        <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      {/* Road surface */}
      <rect x="0" y="52" width="140" height="40" rx="5" fill="url(#road)" />
      <rect x="0" y="52" width="140" height="10" rx="3" fill="#b0b5bd" />
      {/* Road lines */}
      <rect x="15" y="68" width="22" height="4" rx="2" fill="#eab308" opacity="0.8" />
      <rect x="58" y="68" width="22" height="4" rx="2" fill="#eab308" opacity="0.8" />
      <rect x="100" y="68" width="22" height="4" rx="2" fill="#eab308" opacity="0.8" />
      {/* Pothole */}
      <ellipse cx="70" cy="70" rx="20" ry="12" fill="#4b5563" />
      <ellipse cx="70" cy="69" rx="15" ry="8" fill="#374151" />
      <ellipse cx="70" cy="67" rx="10" ry="5" fill="#1f2937" />
      {/* Cracks radiating from pothole */}
      <path d="M50 62l-6-10" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
      <path d="M52 58l-10-5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M90 62l6-10" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
      <path d="M88 58l10-5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M65 56l-2-12" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M75 56l2-12" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
      {/* Warning cone left */}
      <polygon points="22,52 28,30 34,52" fill="url(#cone)" />
      <rect x="23" y="38" width="10" height="4" rx="1.5" fill="white" opacity="0.75" />
      <rect x="20" y="50" width="16" height="4" rx="2" fill="#ea580c" />
      {/* Warning cone right */}
      <polygon points="106,52 112,30 118,52" fill="url(#cone)" />
      <rect x="107" y="38" width="10" height="4" rx="1.5" fill="white" opacity="0.75" />
      <rect x="104" y="50" width="16" height="4" rx="2" fill="#ea580c" />
      {/* Warning sign */}
      <polygon points="70,4 82,24 58,24" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" />
      <text x="70" y="21" fontSize="13" textAnchor="middle" fill="#78350f" fontWeight="900">!</text>
      {/* Ground edge */}
      <rect x="0" y="90" width="140" height="6" rx="3" fill="#d1d5db" />
    </svg>
  );
}

export function GarbageIllustration() {
  return (
    <svg viewBox="0 0 140 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[100px] h-[80px]">
      <defs>
        <linearGradient id="bin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="binLid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>
      {/* Ground */}
      <ellipse cx="70" cy="96" rx="55" ry="6" fill="#e5e7eb" />
      {/* Main bin body */}
      <path d="M38 36l-4 58h72l-4-58H38z" fill="url(#bin)" />
      {/* Bin vertical lines */}
      <line x1="52" y1="40" x2="50" y2="90" stroke="#15803d" strokeWidth="1.5" opacity="0.3" />
      <line x1="70" y1="40" x2="70" y2="90" stroke="#15803d" strokeWidth="1.5" opacity="0.3" />
      <line x1="88" y1="40" x2="86" y2="90" stroke="#15803d" strokeWidth="1.5" opacity="0.3" />
      {/* Bin lid - tilted open */}
      <path d="M30 36h80l4-8H26l4 8z" fill="url(#binLid)" />
      <rect x="58" y="22" width="24" height="8" rx="4" fill="none" stroke="#15803d" strokeWidth="3" />
      {/* Overflow items poking out */}
      <circle cx="48" cy="28" r="8" fill="#fbbf24" /> {/* banana */}
      <rect x="60" y="16" width="14" height="16" rx="3" fill="#a78bfa" transform="rotate(-12 67 24)" /> {/* box */}
      <circle cx="88" cy="30" r="7" fill="#f87171" /> {/* apple */}
      <path d="M88 23v-4" stroke="#65a30d" strokeWidth="2" strokeLinecap="round" />
      {/* Trash bag next to bin */}
      <ellipse cx="115" cy="80" rx="16" ry="18" fill="#374151" />
      <path d="M107 62l6-3 5 2 5-2 6 3" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <ellipse cx="115" cy="80" rx="12" ry="14" fill="#4b5563" opacity="0.5" />
      {/* Small trash on ground */}
      <rect x="14" y="82" width="10" height="12" rx="2" fill="#93c5fd" transform="rotate(-15 19 88)" />
      <circle cx="22" cy="90" r="4" fill="#fca5a5" />
    </svg>
  );
}

export function StreetlightIllustration() {
  return (
    <svg viewBox="0 0 140 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[100px] h-[80px]">
      <defs>
        <linearGradient id="pole" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d1d5db" />
          <stop offset="50%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#6b7280" />
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fde047" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Night sky hint */}
      <circle cx="25" cy="22" r="16" fill="#fef3c7" opacity="0.2" />
      <circle cx="28" cy="19" r="13" fill="white" opacity="0.1" />
      {/* Stars */}
      <circle cx="18" cy="40" r="1.5" fill="#fbbf24" opacity="0.5" />
      <circle cx="42" cy="14" r="1.8" fill="#fbbf24" opacity="0.4" />
      <circle cx="10" cy="55" r="1" fill="#fbbf24" opacity="0.3" />
      {/* Pole */}
      <rect x="68" y="30" width="10" height="65" rx="3" fill="url(#pole)" />
      {/* Base */}
      <rect x="60" y="92" width="26" height="8" rx="4" fill="#6b7280" />
      <rect x="64" y="88" width="18" height="6" rx="2" fill="#9ca3af" />
      {/* Curved arm */}
      <path d="M73 30c0-10 25-16 38-16" stroke="url(#pole)" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Lamp housing */}
      <path d="M102 8l16 10H94l8-10z" fill="#6b7280" />
      <rect x="96" y="18" width="16" height="8" rx="2" fill="#4b5563" />
      {/* Broken X */}
      <line x1="100" y1="14" x2="110" y2="24" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      <line x1="110" y1="14" x2="100" y2="24" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      {/* Sparks */}
      <path d="M96 10l-5-5" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      <path d="M114 10l5-5" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      <path d="M105 4l0-6" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      <circle cx="91" cy="5" r="2" fill="#fbbf24" />
      <circle cx="119" cy="5" r="2" fill="#fbbf24" />
      <circle cx="105" cy="-2" r="1.5" fill="#fbbf24" />
      {/* No-light indicator */}
      <circle cx="105" cy="20" r="12" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
    </svg>
  );
}

export function DrainageIllustration() {
  return (
    <svg viewBox="0 0 140 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[100px] h-[80px]">
      <defs>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#d1d5db" />
        </linearGradient>
      </defs>
      {/* Ground/pavement */}
      <rect x="5" y="44" width="130" height="16" rx="3" fill="url(#ground)" />
      {/* Drain grate frame */}
      <rect x="30" y="46" width="80" height="12" rx="2" fill="#374151" stroke="#1f2937" strokeWidth="1" />
      {/* Grate bars */}
      <line x1="42" y1="46" x2="42" y2="58" stroke="#1f2937" strokeWidth="3" />
      <line x1="54" y1="46" x2="54" y2="58" stroke="#1f2937" strokeWidth="3" />
      <line x1="66" y1="46" x2="66" y2="58" stroke="#1f2937" strokeWidth="3" />
      <line x1="78" y1="46" x2="78" y2="58" stroke="#1f2937" strokeWidth="3" />
      <line x1="90" y1="46" x2="90" y2="58" stroke="#1f2937" strokeWidth="3" />
      <line x1="102" y1="46" x2="102" y2="58" stroke="#1f2937" strokeWidth="3" />
      {/* Underground pipe */}
      <path d="M42 60v26c0 6 5 10 10 10h36c5 0 10-4 10-10V60" stroke="#6b7280" strokeWidth="4" fill="none" />
      <path d="M42 60v26c0 6 5 10 10 10h36c5 0 10-4 10-10V60" stroke="#9ca3af" strokeWidth="2" fill="none" opacity="0.3" />
      {/* Water flooding on top */}
      <ellipse cx="70" cy="42" rx="50" ry="7" fill="#93c5fd" opacity="0.45" />
      <ellipse cx="70" cy="40" rx="38" ry="5" fill="#60a5fa" opacity="0.35" />
      <ellipse cx="70" cy="38" rx="25" ry="3" fill="#3b82f6" opacity="0.25" />
      {/* Ripple rings */}
      <ellipse cx="70" cy="38" rx="22" ry="3" fill="none" stroke="#3b82f6" strokeWidth="0.8" opacity="0.4" />
      <ellipse cx="70" cy="36" rx="32" ry="3" fill="none" stroke="#3b82f6" strokeWidth="0.6" opacity="0.25" />
      {/* Water drops */}
      <path d="M25 32c0 4-3 7-3 7s-3-3-3-7a3 3 0 016 0z" fill="url(#water)" />
      <path d="M120 28c0 4-3 7-3 7s-3-3-3-7a3 3 0 016 0z" fill="url(#water)" />
      <path d="M48 24c0 3-2 5-2 5s-2-2-2-5a2 2 0 014 0z" fill="#93c5fd" />
      <path d="M96 22c0 3-2 5-2 5s-2-2-2-5a2 2 0 014 0z" fill="#93c5fd" />
      {/* Splash lines */}
      <path d="M20 38c-4-5-3-8 0-8" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M120 38c4-5 3-8 0-8" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function WaterSupplyIllustration() {
  return (
    <svg viewBox="0 0 140 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[100px] h-[80px]">
      <defs>
        <linearGradient id="pipe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d1d5db" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>
        <linearGradient id="waterDrop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      {/* Wall/background */}
      <rect x="5" y="8" width="80" height="80" rx="4" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" />
      {/* Horizontal pipe */}
      <rect x="5" y="34" width="65" height="18" rx="4" fill="url(#pipe)" />
      <rect x="5" y="34" width="65" height="6" rx="2" fill="#e5e7eb" opacity="0.6" />
      {/* Pipe joint */}
      <rect x="62" y="28" width="18" height="30" rx="4" fill="#6b7280" />
      <rect x="64" y="30" width="14" height="26" rx="3" fill="#9ca3af" />
      {/* Valve wheel */}
      <circle cx="71" cy="43" r="10" fill="none" stroke="#4b5563" strokeWidth="3" />
      <line x1="71" y1="33" x2="71" y2="53" stroke="#4b5563" strokeWidth="2.5" />
      <line x1="61" y1="43" x2="81" y2="43" stroke="#4b5563" strokeWidth="2.5" />
      {/* Faucet arm */}
      <path d="M80 40h25c4 0 8 3 8 8v6c0 3-2 4-4 4h-8" stroke="url(#pipe)" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M80 40h25c4 0 8 3 8 8v6c0 3-2 4-4 4h-8" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
      {/* Leak burst - main stream */}
      <path d="M104 58c0 8-4 14-4 14s-4-6-4-14a4 4 0 018 0z" fill="url(#waterDrop)" />
      {/* Side leaks */}
      <path d="M93 62c0 5-2 9-2 9s-2-4-2-9a2 2 0 014 0z" fill="#60a5fa" opacity="0.8" />
      <path d="M115 60c0 5-2 9-2 9s-2-4-2-9a2 2 0 014 0z" fill="#93c5fd" opacity="0.7" />
      {/* Drips */}
      <circle cx="100" cy="82" r="2.5" fill="#3b82f6" opacity="0.7" />
      <circle cx="91" cy="88" r="2" fill="#60a5fa" opacity="0.5" />
      <circle cx="113" cy="85" r="2" fill="#93c5fd" opacity="0.6" />
      <circle cx="96" cy="92" r="1.5" fill="#60a5fa" opacity="0.4" />
      {/* Puddle */}
      <ellipse cx="100" cy="100" rx="28" ry="6" fill="#bfdbfe" opacity="0.5" />
      <ellipse cx="100" cy="99" rx="18" ry="4" fill="#93c5fd" opacity="0.35" />
    </svg>
  );
}

export function OthersIllustration() {
  return (
    <svg viewBox="0 0 140 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[100px] h-[80px]">
      <defs>
        <linearGradient id="clipboard" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f3f4f6" />
        </linearGradient>
      </defs>
      {/* Clipboard body */}
      <rect x="25" y="18" width="70" height="80" rx="8" fill="url(#clipboard)" stroke="#d1d5db" strokeWidth="2" />
      {/* Clipboard clip */}
      <rect x="45" y="10" width="30" height="18" rx="6" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="2" />
      <circle cx="60" cy="19" r="4" fill="#9ca3af" />
      {/* Checklist items */}
      <rect x="38" y="40" width="10" height="10" rx="3" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" />
      <path d="M41 45l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="54" y="42" width="32" height="5" rx="2.5" fill="#d1d5db" />
      
      <rect x="38" y="56" width="10" height="10" rx="3" fill="#fff7ed" stroke="#f97316" strokeWidth="1.5" />
      <path d="M41 61l2 2 4-4" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="54" y="58" width="28" height="5" rx="2.5" fill="#d1d5db" />
      
      <rect x="38" y="72" width="10" height="10" rx="3" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
      <path d="M41 77l2 2 4-4" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="54" y="74" width="30" height="5" rx="2.5" fill="#d1d5db" />
      
      {/* Question mark badge */}
      <circle cx="108" cy="28" r="18" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
      <text x="108" y="35" fontSize="20" textAnchor="middle" fill="#16a34a" fontWeight="800">?</text>
      {/* Dots decoration */}
      <circle cx="38" cy="92" r="2.5" fill="#9ca3af" opacity="0.5" />
      <circle cx="48" cy="92" r="2.5" fill="#9ca3af" opacity="0.5" />
      <circle cx="58" cy="92" r="2.5" fill="#9ca3af" opacity="0.5" />
    </svg>
  );
}
