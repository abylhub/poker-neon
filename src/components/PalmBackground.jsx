export default function PalmBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', opacity: 0.55 }}
      >
        <defs>
          {/* Sky gradient */}
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0d0818" />
            <stop offset="55%"  stopColor="#150820" />
            <stop offset="78%"  stopColor="#2a0830" />
            <stop offset="90%"  stopColor="#4a0a35" />
            <stop offset="100%" stopColor="#200010" />
          </linearGradient>
          {/* Horizon glow */}
          <radialGradient id="sun" cx="50%" cy="100%" r="55%">
            <stop offset="0%"  stopColor="#ff2d78" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#9d00ff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0d0818" stopOpacity="0" />
          </radialGradient>
          {/* Palm dark fill */}
          <linearGradient id="palm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0a0015" />
            <stop offset="100%" stopColor="#060010" />
          </linearGradient>
          {/* Reflection gradient */}
          <linearGradient id="refl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#ff2d78" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ff2d78" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="1440" height="900" fill="url(#sky)" />

        {/* Horizon glow — sun */}
        <rect width="1440" height="900" fill="url(#sun)" />

        {/* Horizon line */}
        <line x1="0" y1="680" x2="1440" y2="680" stroke="#ff2d78" strokeWidth="1" opacity="0.25" />

        {/* Grid lines on ground — retro perspective */}
        {[690, 710, 735, 770, 820, 900].map((y, i) => (
          <line key={i} x1="0" y1={y} x2="1440" y2={y} stroke="#ff2d78" strokeWidth="0.5" opacity={0.06 + i * 0.015} />
        ))}
        {/* Vertical grid lines converging */}
        {[-200, -100, 0, 100, 200, 320, 440, 560, 680, 800, 920, 1040, 1160, 1280, 1380, 1480, 1600].map((x, i) => (
          <line key={i} x1={720} y1={680} x2={x} y2={900} stroke="#ff2d78" strokeWidth="0.5" opacity="0.08" />
        ))}

        {/* Water reflection */}
        <rect x="0" y="680" width="1440" height="220" fill="url(#refl)" />

        {/* ── PALM TREE helper: trunk + fronds ─────────────────── */}

        {/* Palm 1 — far left */}
        <g transform="translate(60, 680)" opacity="0.9">
          {/* trunk */}
          <path d="M0,0 C-3,-80 5,-160 2,-260 C0,-300 -2,-330 0,-360" stroke="#0a0015" strokeWidth="10" fill="none" strokeLinecap="round"/>
          {/* fronds */}
          <path d="M2,-360 C-60,-400 -120,-380 -150,-350" stroke="#0a0015" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M2,-360 C-40,-420 -60,-450 -40,-480" stroke="#0a0015" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M2,-360 C20,-420 60,-440 80,-430" stroke="#0a0015" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M2,-360 C40,-390 90,-370 110,-350" stroke="#0a0015" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M2,-360 C-10,-380 -30,-360 -50,-340" stroke="#0a0015" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M2,-360 C10,-395 30,-415 20,-440" stroke="#0a0015" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
          {/* trunk silhouette fill */}
          <path d="M-5,0 C-8,-80 0,-160 -3,-260 C-5,-300 -7,-330 -5,-360 L7,-360 C5,-330 3,-300 5,-260 C8,-160 2,-80 5,0 Z" fill="#0a0015"/>
        </g>

        {/* Palm 2 — left */}
        <g transform="translate(200, 680)" opacity="0.95">
          <path d="M0,0 C4,-90 -3,-180 1,-290 C3,-330 2,-360 0,-400" stroke="#08001a" strokeWidth="13" fill="none" strokeLinecap="round"/>
          <path d="M0,-400 C-80,-445 -160,-420 -200,-380" stroke="#08001a" strokeWidth="6" fill="none" strokeLinecap="round"/>
          <path d="M0,-400 C-50,-460 -70,-500 -45,-530" stroke="#08001a" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M0,-400 C30,-460 80,-480 110,-465" stroke="#08001a" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M0,-400 C60,-430 120,-410 150,-380" stroke="#08001a" strokeWidth="6" fill="none" strokeLinecap="round"/>
          <path d="M0,-400 C10,-445 40,-470 35,-500" stroke="#08001a" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M0,-400 C-20,-430 -50,-420 -70,-400" stroke="#08001a" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M0,-400 C20,-440 60,-450 75,-440" stroke="#08001a" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
          <path d="M-6,0 C-2,-90 -9,-180 -5,-290 C-3,-330 -4,-360 -6,-400 L6,-400 C4,-360 5,-330 7,-290 C11,-180 4,-90 6,0 Z" fill="#08001a"/>
        </g>

        {/* Palm 3 — center-left, shorter */}
        <g transform="translate(420, 680)" opacity="0.7">
          <path d="M0,0 C2,-60 -2,-120 1,-200 C2,-230 0,-250 0,-280" stroke="#0a0015" strokeWidth="9" fill="none" strokeLinecap="round"/>
          <path d="M0,-280 C-50,-310 -100,-295 -125,-270" stroke="#0a0015" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
          <path d="M0,-280 C-25,-320 -35,-345 -15,-365" stroke="#0a0015" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M0,-280 C25,-320 65,-330 80,-315" stroke="#0a0015" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M0,-280 C40,-300 75,-290 90,-270" stroke="#0a0015" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
          <path d="M0,-280 C5,-310 20,-330 15,-350" stroke="#0a0015" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M-4,0 C-2,-60 -6,-120 -3,-200 C-2,-230 -4,-250 -4,-280 L4,-280 C4,-250 6,-230 7,-200 C10,-120 4,-60 4,0 Z" fill="#0a0015"/>
        </g>

        {/* Palm 4 — right side */}
        <g transform="translate(1240, 680)" opacity="0.95">
          <path d="M0,0 C-4,-90 3,-180 -1,-290 C-3,-330 -2,-360 0,-400" stroke="#08001a" strokeWidth="13" fill="none" strokeLinecap="round"/>
          <path d="M0,-400 C80,-445 160,-420 200,-380" stroke="#08001a" strokeWidth="6" fill="none" strokeLinecap="round"/>
          <path d="M0,-400 C50,-460 70,-500 45,-530" stroke="#08001a" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M0,-400 C-30,-460 -80,-480 -110,-465" stroke="#08001a" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M0,-400 C-60,-430 -120,-410 -150,-380" stroke="#08001a" strokeWidth="6" fill="none" strokeLinecap="round"/>
          <path d="M0,-400 C-10,-445 -40,-470 -35,-500" stroke="#08001a" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M0,-400 C20,-430 50,-420 70,-400" stroke="#08001a" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M-6,0 C-2,-90 -9,-180 -5,-290 C-3,-330 -4,-360 -6,-400 L6,-400 C4,-360 5,-330 7,-290 C11,-180 4,-90 6,0 Z" fill="#08001a"/>
        </g>

        {/* Palm 5 — far right */}
        <g transform="translate(1380, 680)" opacity="0.9">
          <path d="M0,0 C3,-80 -5,-160 -2,-260 C0,-300 2,-330 0,-360" stroke="#0a0015" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M0,-360 C60,-400 120,-380 150,-350" stroke="#0a0015" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M0,-360 C40,-420 60,-450 40,-480" stroke="#0a0015" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M0,-360 C-20,-420 -60,-440 -80,-430" stroke="#0a0015" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M0,-360 C-40,-390 -90,-370 -110,-350" stroke="#0a0015" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M0,-360 C10,-380 30,-360 50,-340" stroke="#0a0015" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M-5,0 C-8,-80 0,-160 -3,-260 C-5,-300 -7,-330 -5,-360 L7,-360 C5,-330 3,-300 5,-260 C8,-160 2,-80 5,0 Z" fill="#0a0015"/>
        </g>

        {/* Palm 6 — center-right, tall background */}
        <g transform="translate(980, 680)" opacity="0.5">
          <path d="M0,0 C2,-100 -3,-200 1,-320 C3,-370 2,-410 0,-460" stroke="#060012" strokeWidth="11" fill="none" strokeLinecap="round"/>
          <path d="M0,-460 C-90,-510 -180,-480 -220,-440" stroke="#060012" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
          <path d="M0,-460 C-55,-530 -75,-575 -50,-605" stroke="#060012" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
          <path d="M0,-460 C55,-530 110,-545 135,-525" stroke="#060012" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
          <path d="M0,-460 C80,-500 150,-475 180,-445" stroke="#060012" strokeWidth="5.5" fill="none" strokeLinecap="round"/>
          <path d="M0,-460 C15,-510 50,-540 40,-570" stroke="#060012" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M-5,0 C-3,-100 -8,-200 -4,-320 C-2,-370 -3,-410 -5,-460 L5,-460 C3,-410 4,-370 6,-320 C10,-200 3,-100 5,0 Z" fill="#060012"/>
        </g>

        {/* Neon reflections on ground */}
        <ellipse cx="720" cy="760" rx="400" ry="20" fill="#ff2d78" opacity="0.04" />
        <ellipse cx="720" cy="800" rx="250" ry="12" fill="#9d00ff" opacity="0.03" />

        {/* Stars */}
        {[
          [100,80],[200,50],[350,120],[500,60],[700,90],[900,40],[1100,110],[1250,70],[1380,95],
          [150,200],[450,180],[750,160],[1050,190],[1300,170],
          [80,300],[300,280],[600,320],[950,290],[1200,310],[1400,260],
        ].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.5 : 1} fill="#f0e6ff" opacity={0.3 + (i % 4) * 0.15} />
        ))}

        {/* Distant city/neon sign glow on horizon */}
        <ellipse cx="400"  cy="682" rx="60" ry="8" fill="#ff2d78" opacity="0.08" />
        <ellipse cx="1050" cy="682" rx="80" ry="8" fill="#00d4ff" opacity="0.07" />
        <ellipse cx="720"  cy="682" rx="120" ry="10" fill="#9d00ff" opacity="0.07" />
      </svg>
    </div>
  )
}
