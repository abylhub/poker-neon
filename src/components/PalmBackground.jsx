// Cyberpunk Casino Background
export default function CyberpunkBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="center-glow" cx="50%" cy="45%" r="55%">
            <stop offset="0%"   stopColor="#8b00ff" stopOpacity="0.12"/>
            <stop offset="50%"  stopColor="#ff2d78" stopOpacity="0.06"/>
            <stop offset="100%" stopColor="#07050f" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="corner-glow-tl" cx="0%" cy="0%" r="50%">
            <stop offset="0%"   stopColor="#00cfff" stopOpacity="0.08"/>
            <stop offset="100%" stopColor="#07050f" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="corner-glow-br" cx="100%" cy="100%" r="50%">
            <stop offset="0%"   stopColor="#ff2d78" stopOpacity="0.07"/>
            <stop offset="100%" stopColor="#07050f" stopOpacity="0"/>
          </radialGradient>
          <filter id="blur-sm"><feGaussianBlur stdDeviation="2"/></filter>
          <filter id="blur-md"><feGaussianBlur stdDeviation="6"/></filter>
        </defs>

        {/* Base */}
        <rect width="1440" height="900" fill="#07050f"/>
        <rect width="1440" height="900" fill="url(#center-glow)"/>
        <rect width="1440" height="900" fill="url(#corner-glow-tl)"/>
        <rect width="1440" height="900" fill="url(#corner-glow-br)"/>

        {/* ── Micro grid ── */}
        {Array.from({length: 29}).map((_,i) => (
          <line key={`v${i}`} x1={i*50} y1="0" x2={i*50} y2="900" stroke="#ff2d78" strokeWidth="0.3" opacity="0.04"/>
        ))}
        {Array.from({length: 19}).map((_,i) => (
          <line key={`h${i}`} x1="0" y1={i*50} x2="1440" y2={i*50} stroke="#ff2d78" strokeWidth="0.3" opacity="0.04"/>
        ))}

        {/* ── Circuit traces ── */}
        <path d="M0 200 L80 200 L80 250 L200 250 L200 200 L350 200" stroke="#00cfff" strokeWidth="0.6" fill="none" opacity="0.12"/>
        <path d="M0 400 L120 400 L120 350 L300 350" stroke="#ffd700" strokeWidth="0.6" fill="none" opacity="0.1"/>
        <path d="M1440 300 L1360 300 L1360 350 L1240 350 L1240 280 L1100 280" stroke="#00cfff" strokeWidth="0.6" fill="none" opacity="0.12"/>
        <path d="M1440 550 L1320 550 L1320 500 L1180 500" stroke="#ffd700" strokeWidth="0.6" fill="none" opacity="0.1"/>
        <path d="M200 900 L200 800 L350 800 L350 750 L500 750" stroke="#ff2d78" strokeWidth="0.6" fill="none" opacity="0.1"/>
        <path d="M1000 900 L1000 820 L1100 820 L1100 760 L1250 760" stroke="#00ff9f" strokeWidth="0.6" fill="none" opacity="0.08"/>
        {/* Circuit dots */}
        {[[80,250],[200,250],[200,200],[1360,350],[1240,350],[1240,280],[200,800],[350,800],[350,750],[1000,820],[1100,820]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="2.5" fill="none" stroke="#00cfff" strokeWidth="0.8" opacity="0.2"/>
        ))}

        {/* ── Large translucent card suits ── */}
        {/* ♠ top-left */}
        <text x="60" y="260" fontSize="180" fill="#ff2d78" opacity="0.025" fontFamily="serif" transform="rotate(-15,60,200)">♠</text>
        {/* ♥ top-right */}
        <text x="1180" y="220" fontSize="160" fill="#ff2d78" opacity="0.025" fontFamily="serif" transform="rotate(10,1250,180)">♥</text>
        {/* ♦ bottom-left */}
        <text x="20" y="850" fontSize="200" fill="#ffd700" opacity="0.02" fontFamily="serif" transform="rotate(8,80,780)">♦</text>
        {/* ♣ bottom-right */}
        <text x="1200" y="900" fontSize="220" fill="#00cfff" opacity="0.02" fontFamily="serif" transform="rotate(-12,1300,820)">♣</text>
        {/* ♠ center faint */}
        <text x="600" y="560" fontSize="300" fill="#8b00ff" opacity="0.015" fontFamily="serif">♠</text>

        {/* ── Neon sign lines (horizontal accent) ── */}
        <line x1="0" y1="1" x2="1440" y2="1" stroke="#ffd700" strokeWidth="1" opacity="0.15"/>
        <line x1="0" y1="899" x2="1440" y2="899" stroke="#ffd700" strokeWidth="1" opacity="0.15"/>

        {/* ── Stars / particles ── */}
        {[
          [150,60,1.2],[280,35,0.8],[420,90,1],[600,45,1.4],[780,70,0.9],
          [950,40,1.1],[1100,80,0.8],[1300,55,1.3],[1400,90,0.7],
          [80,150],[350,130],[700,170],[1050,140],[1380,160],
          [200,700],[500,720],[800,690],[1100,710],[1350,730],
        ].map(([x,y,r=1],i)=>(
          <circle key={i} cx={x} cy={y} r={r} fill="#e8deff" opacity={0.15 + (i%5)*0.08}/>
        ))}

        {/* ── Playing card watermark — center ── */}
        {/* Top card — behind everything */}
        <g transform="translate(640,300)" opacity="0.03">
          <rect width="160" height="220" rx="8" fill="none" stroke="#ffd700" strokeWidth="1"/>
          <text x="12" y="30" fontSize="22" fill="#ffd700" fontFamily="serif">A</text>
          <text x="12" y="52" fontSize="14" fill="#ffd700" fontFamily="serif">♠</text>
          <text x="80" y="130" fontSize="60" fill="#ffd700" fontFamily="serif" textAnchor="middle">♠</text>
          <text x="148" y="205" fontSize="22" fill="#ffd700" fontFamily="serif" textAnchor="end" transform="rotate(180,80,110)">A</text>
        </g>

        {/* ── Edge glow strips ── */}
        <rect x="0" y="0" width="2" height="900" fill="url(#corner-glow-tl)" opacity="0.4"/>
        <rect x="1438" y="0" width="2" height="900" fill="url(#corner-glow-br)" opacity="0.4"/>
      </svg>
    </div>
  )
}
