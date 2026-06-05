import { getPlayers, savePlayers } from './store.js'

const makeAvatar = (suit, c1, c2, bg, eye, shape) => {
  const shapes = {
    // Alibek — Cyberpunk soldier
    soldier: `<ellipse cx="100" cy="100" rx="52" ry="60" fill="#1c2e1c"/>
      <path d="M50 85 Q100 30 150 85" fill="#0a1a0a" stroke="${c1}" stroke-width="2"/>
      <line x1="100" y1="40" x2="100" y2="15" stroke="${c1}" stroke-width="1.5"/>
      <circle cx="100" cy="13" r="4" fill="${c1}"/>
      <rect x="55" y="85" width="90" height="28" rx="6" fill="${c1}" opacity="0.12" stroke="${c1}" stroke-width="1.5"/>
      <ellipse cx="78" cy="99" rx="12" ry="8" fill="${c1}" opacity="0.85"/>
      <ellipse cx="122" cy="99" rx="12" ry="8" fill="${c1}" opacity="0.85"/>
      <ellipse cx="78" cy="99" rx="6" ry="4" fill="white" opacity="0.9"/>
      <ellipse cx="122" cy="99" rx="6" ry="4" fill="white" opacity="0.9"/>
      <line x1="55" y1="99" x2="145" y2="99" stroke="${c1}" stroke-width="0.5" opacity="0.5"/>
      <rect x="65" y="118" width="70" height="22" rx="5" fill="#0d1a0d" stroke="${c1}" stroke-width="0.8" opacity="0.6"/>
      <line x1="75" y1="124" x2="125" y2="124" stroke="${c1}" stroke-width="1" opacity="0.4"/>
      <line x1="75" y1="130" x2="125" y2="130" stroke="${c1}" stroke-width="1" opacity="0.4"/>`,
    // Abylay — Oni mask
    oni: `<ellipse cx="100" cy="108" rx="56" ry="62" fill="#2a0a20"/>
      <path d="M70 60 L60 15 L85 55 Z" fill="${c1}" opacity="0.8" stroke="${c1}" stroke-width="1"/>
      <path d="M130 60 L140 15 L115 55 Z" fill="${c1}" opacity="0.8" stroke="${c1}" stroke-width="1"/>
      <path d="M100 55 L108 75 L100 70 L92 75 Z" fill="${c1}" opacity="0.7"/>
      <path d="M52 90 Q75 78 98 88" fill="none" stroke="${c1}" stroke-width="3" stroke-linecap="round"/>
      <path d="M148 90 Q125 78 102 88" fill="none" stroke="${c1}" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="75" cy="102" rx="10" ry="7" fill="${c1}" opacity="0.9"/>
      <ellipse cx="125" cy="102" rx="10" ry="7" fill="${c1}" opacity="0.9"/>
      <ellipse cx="75" cy="102" rx="5" ry="3.5" fill="#fff" opacity="0.9"/>
      <ellipse cx="125" cy="102" rx="5" ry="3.5" fill="#fff" opacity="0.9"/>
      <path d="M68 133 Q100 155 132 133" fill="#1a0510" stroke="${c1}" stroke-width="2"/>
      <rect x="80" y="133" width="8" height="10" rx="2" fill="${c1}" opacity="0.8"/>
      <rect x="93" y="133" width="14" height="12" rx="2" fill="${c1}" opacity="0.8"/>
      <rect x="112" y="133" width="8" height="10" rx="2" fill="${c1}" opacity="0.8"/>
      <line x1="52" y1="110" x2="68" y2="120" stroke="${c1}" stroke-width="2" opacity="0.6"/>
      <line x1="148" y1="110" x2="132" y2="120" stroke="${c1}" stroke-width="2" opacity="0.6"/>`,
    // Almas — Hacker
    hacker: `<ellipse cx="100" cy="98" rx="50" ry="55" fill="#1a2b1a"/>
      <rect x="52" y="82" width="43" height="22" rx="4" fill="#001a00" stroke="${c1}" stroke-width="2"/>
      <rect x="105" y="82" width="43" height="22" rx="4" fill="#001a00" stroke="${c1}" stroke-width="2"/>
      <line x1="95" y1="93" x2="105" y2="93" stroke="${c1}" stroke-width="2"/>
      <line x1="56" y1="88" x2="92" y2="88" stroke="${c1}" stroke-width="0.7" opacity="0.5"/>
      <line x1="56" y1="93" x2="92" y2="93" stroke="${c1}" stroke-width="0.7" opacity="0.5"/>
      <line x1="56" y1="98" x2="92" y2="98" stroke="${c1}" stroke-width="0.7" opacity="0.5"/>
      <line x1="109" y1="88" x2="145" y2="88" stroke="${c1}" stroke-width="0.7" opacity="0.5"/>
      <line x1="109" y1="93" x2="145" y2="93" stroke="${c1}" stroke-width="0.7" opacity="0.5"/>
      <line x1="109" y1="98" x2="145" y2="98" stroke="${c1}" stroke-width="0.7" opacity="0.5"/>
      <rect x="69" y="88" width="7" height="10" rx="1" fill="${c1}" opacity="0.9"/>
      <rect x="122" y="88" width="7" height="10" rx="1" fill="${c1}" opacity="0.9"/>
      <path d="M82 128 Q95 138 112 130" fill="none" stroke="${c1}" stroke-width="2" stroke-linecap="round"/>`,
    // Yerbol — Fire king
    fire: `<ellipse cx="100" cy="112" rx="52" ry="56" fill="#2a1205"/>
      <path d="M65 70 Q60 40 75 25 Q78 50 88 55 Q88 30 100 10 Q112 30 112 55 Q122 50 125 25 Q140 40 135 70Z" fill="#ff4400" opacity="0.9"/>
      <path d="M72 70 Q68 48 79 38 Q81 52 88 56 Q91 38 100 20 Q109 38 112 56 Q119 52 121 38 Q132 48 128 70Z" fill="#ffaa00" opacity="0.8"/>
      <path d="M80 70 Q83 55 90 58 Q94 48 100 35 Q106 48 110 58 Q117 55 120 70Z" fill="#ffee00" opacity="0.6"/>
      <rect x="53" y="68" width="94" height="12" rx="3" fill="#1a0500" stroke="${c1}" stroke-width="1.5"/>
      <path d="M58 94 Q73 86 88 92" fill="none" stroke="${c1}" stroke-width="3" stroke-linecap="round"/>
      <path d="M142 94 Q127 86 112 92" fill="none" stroke="${c1}" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="78" cy="105" rx="14" ry="10" fill="#ff3300" opacity="0.9"/>
      <ellipse cx="122" cy="105" rx="14" ry="10" fill="#ff3300" opacity="0.9"/>
      <ellipse cx="78" cy="105" rx="8" ry="6" fill="#ffaa00" opacity="0.9"/>
      <ellipse cx="122" cy="105" rx="8" ry="6" fill="#ffaa00" opacity="0.9"/>
      <path d="M72 132 Q100 148 128 132" fill="none" stroke="${c1}" stroke-width="2.5"/>`,
    // Mels — Space mage
    mage: `<path d="M100 10 L130 75 L70 75 Z" fill="#1a0a2e" stroke="${c1}" stroke-width="2"/>
      <ellipse cx="100" cy="75" rx="38" ry="8" fill="#1a0a2e" stroke="${c1}" stroke-width="1.5"/>
      <circle cx="100" cy="35" r="4" fill="${c1}" opacity="0.8"/>
      <circle cx="112" cy="55" r="2" fill="#00f5ff" opacity="0.6"/>
      <ellipse cx="100" cy="118" rx="48" ry="52" fill="#1a0a2e" stroke="${c1}" stroke-width="1.5" opacity="0.8"/>
      <path d="M65 150 Q100 175 135 150 Q130 185 100 195 Q70 185 65 150Z" fill="#12082a" stroke="${c1}" stroke-width="1" opacity="0.5"/>
      <ellipse cx="80" cy="110" rx="13" ry="9" fill="${c1}" opacity="0.8"/>
      <ellipse cx="120" cy="110" rx="13" ry="9" fill="${c1}" opacity="0.8"/>
      <circle cx="80" cy="110" r="5" fill="#e0c0ff" opacity="0.9"/>
      <circle cx="120" cy="110" r="5" fill="#e0c0ff" opacity="0.9"/>
      <path d="M63 98 Q80 90 96 98" fill="none" stroke="${c1}" stroke-width="2"/>
      <path d="M137 98 Q120 90 104 98" fill="none" stroke="${c1}" stroke-width="2"/>
      <path d="M78 148 Q100 160 122 148" fill="none" stroke="${c1}" stroke-width="2"/>`,
    // Daulet — Sea captain
    captain: `<ellipse cx="100" cy="115" rx="52" ry="55" fill="#0d2a2a"/>
      <path d="M52 78 L60 55 L100 48 L140 55 L148 78Z" fill="#0a2020" stroke="${c1}" stroke-width="1.5"/>
      <rect x="45" y="78" width="110" height="14" rx="3" fill="#0a2020" stroke="${c1}" stroke-width="2"/>
      <path d="M87 65 L100 55 L113 65 L109 72 L100 69 L91 72Z" fill="${c1}" opacity="0.8"/>
      <ellipse cx="75" cy="106" rx="16" ry="12" fill="#030f10" stroke="${c1}" stroke-width="2"/>
      <line x1="62" y1="99" x2="88" y2="113" stroke="${c1}" stroke-width="1.5" opacity="0.6"/>
      <line x1="88" y1="99" x2="62" y2="113" stroke="${c1}" stroke-width="1.5" opacity="0.6"/>
      <ellipse cx="122" cy="106" rx="14" ry="10" fill="#003322" stroke="${c1}" stroke-width="1.5"/>
      <ellipse cx="122" cy="106" rx="8" ry="6" fill="${c1}" opacity="0.8"/>
      <ellipse cx="122" cy="106" rx="4" ry="4" fill="#e0ffee" opacity="0.9"/>
      <path d="M108 94 Q122 87 136 94" fill="none" stroke="${c1}" stroke-width="2.5"/>
      <path d="M72 132 Q88 122 100 128 Q112 122 128 132" fill="none" stroke="${c1}" stroke-width="3"/>
      <path d="M72 135 Q100 155 128 135 Q125 165 100 170 Q75 165 72 135Z" fill="#0a2020" stroke="${c1}" stroke-width="1" opacity="0.6"/>`,
    // Aibala — Neon queen
    queen: `<path d="M48 75 L60 40 L80 65 L100 35 L120 65 L140 40 L152 75 Z" fill="#2a0515" stroke="${c1}" stroke-width="2.5"/>
      <circle cx="60" cy="40" r="5" fill="${c1}" opacity="0.9"/>
      <circle cx="100" cy="35" r="7" fill="${c1}" opacity="0.9"/>
      <circle cx="140" cy="40" r="5" fill="${c1}" opacity="0.9"/>
      <rect x="47" y="73" width="106" height="10" rx="2" fill="#2a0515" stroke="${c1}" stroke-width="1.5"/>
      <ellipse cx="100" cy="120" rx="50" ry="54" fill="#200a18" stroke="${c1}" stroke-width="1.8" opacity="0.8"/>
      <path d="M62 100 Q78 91 93 98" fill="none" stroke="${c1}" stroke-width="2.5"/>
      <path d="M138 100 Q122 91 107 98" fill="none" stroke="${c1}" stroke-width="2.5"/>
      <ellipse cx="77" cy="113" rx="13" ry="9" fill="${c1}" opacity="0.8"/>
      <ellipse cx="123" cy="113" rx="13" ry="9" fill="${c1}" opacity="0.8"/>
      <ellipse cx="77" cy="113" rx="7" ry="6" fill="#fff0f5" opacity="0.9"/>
      <ellipse cx="123" cy="113" rx="7" ry="6" fill="#fff0f5" opacity="0.9"/>
      <path d="M82 140 Q100 150 118 140" fill="${c1}" opacity="0.7"/>
      <circle cx="50" cy="118" r="5" fill="${c1}" opacity="0.7"/>
      <circle cx="150" cy="118" r="5" fill="${c1}" opacity="0.7"/>`,
    // Nigara — Desert shaman
    shaman: `<path d="M48 85 Q100 20 152 85" fill="#1a0f00" stroke="${c1}" stroke-width="2"/>
      <circle cx="100" cy="30" r="7" fill="${c1}" opacity="0.9"/>
      <circle cx="75" cy="55" r="4" fill="${c1}" opacity="0.7"/>
      <circle cx="125" cy="55" r="4" fill="${c1}" opacity="0.7"/>
      <ellipse cx="100" cy="115" rx="50" ry="52" fill="#1a0f00" stroke="${c1}" stroke-width="1.5" opacity="0.7"/>
      <path d="M62 112 Q75 104 90 112 Q75 120 62 112Z" fill="${c1}" opacity="0.9"/>
      <path d="M110 112 Q125 104 138 112 Q125 120 110 112Z" fill="${c1}" opacity="0.9"/>
      <ellipse cx="76" cy="112" rx="6" ry="5" fill="#fff8e0" opacity="0.9"/>
      <ellipse cx="124" cy="112" rx="6" ry="5" fill="#fff8e0" opacity="0.9"/>
      <line x1="56" y1="112" x2="50" y2="110" stroke="${c1}" stroke-width="1.5" opacity="0.6"/>
      <line x1="144" y1="112" x2="150" y2="110" stroke="${c1}" stroke-width="1.5" opacity="0.6"/>
      <path d="M95 127 Q100 123 105 127" fill="none" stroke="${c1}" stroke-width="2"/>
      <circle cx="100" cy="127" r="3" fill="none" stroke="${c1}" stroke-width="1.5"/>
      <path d="M78 138 Q100 150 122 138" fill="${c1}" opacity="0.7"/>
      <circle cx="65" cy="125" r="2" fill="${c1}" opacity="0.6"/>
      <circle cx="135" cy="125" r="2" fill="${c1}" opacity="0.6"/>`,
    // Tanat — Ice warrior
    ice: `<ellipse cx="100" cy="100" rx="52" ry="58" fill="#051525" stroke="${c1}" stroke-width="2" opacity="0.8"/>
      <path d="M25 185 Q30 155 60 145 L100 140 L140 145 Q170 155 175 185Z" fill="#051525" stroke="${c1}" stroke-width="1.5" opacity="0.7"/>
      <path d="M45 155 L35 130 L52 150Z" fill="${c1}" opacity="0.4"/>
      <path d="M155 155 L165 130 L148 150Z" fill="${c1}" opacity="0.4"/>
      <path d="M50 90 L75 95" stroke="${c1}" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
      <path d="M150 90 L125 95" stroke="${c1}" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
      <ellipse cx="78" cy="97" rx="14" ry="9" fill="#003348" stroke="${c1}" stroke-width="1.5"/>
      <ellipse cx="122" cy="97" rx="14" ry="9" fill="#003348" stroke="${c1}" stroke-width="1.5"/>
      <ellipse cx="78" cy="97" rx="8" ry="5.5" fill="${c1}" opacity="0.7"/>
      <ellipse cx="122" cy="97" rx="8" ry="5.5" fill="${c1}" opacity="0.7"/>
      <circle cx="78" cy="97" r="3.5" fill="#c0eeff" opacity="0.9"/>
      <circle cx="122" cy="97" r="3.5" fill="#c0eeff" opacity="0.9"/>
      <path d="M58 84 L78 88" stroke="${c1}" stroke-width="3" stroke-linecap="round"/>
      <path d="M142 84 L122 88" stroke="${c1}" stroke-width="3" stroke-linecap="round"/>
      <path d="M88 122 Q100 118 112 122" fill="none" stroke="${c1}" stroke-width="1.5" opacity="0.7"/>
      <path d="M96 148 L100 165 L104 148" fill="${c1}" opacity="0.3"/>`,
    // Sultan — Emperor
    emperor: `<ellipse cx="100" cy="100" rx="52" ry="58" fill="#1a0000" stroke="${c1}" stroke-width="2" opacity="0.8"/>
      <path d="M15 200 Q20 160 55 150 L100 145 L145 150 Q180 160 185 200Z" fill="#1a0000" stroke="${c1}" stroke-width="1.5" opacity="0.9"/>
      <path d="M55 72 L65 45 L80 62 L100 40 L120 62 L135 45 L145 72Z" fill="#1a0000" stroke="${c1}" stroke-width="2.5"/>
      <circle cx="65" cy="45" r="4" fill="${c1}"/>
      <circle cx="100" cy="40" r="6" fill="${c1}"/>
      <circle cx="135" cy="45" r="4" fill="${c1}"/>
      <rect x="53" y="70" width="94" height="10" rx="2" fill="#1a0000" stroke="${c1}" stroke-width="1.5"/>
      <path d="M60 98 Q78 88 96 98 Q78 107 60 98Z" fill="${c1}" opacity="0.9"/>
      <path d="M104 98 Q122 88 140 98 Q122 107 104 98Z" fill="${c1}" opacity="0.9"/>
      <ellipse cx="78" cy="98" rx="7" ry="5.5" fill="#ff8888" opacity="0.9"/>
      <ellipse cx="122" cy="98" rx="7" ry="5.5" fill="#ff8888" opacity="0.9"/>
      <circle cx="78" cy="98" r="3" fill="#111"/>
      <circle cx="122" cy="98" r="3" fill="#111"/>
      <path d="M55 85 Q78 77 96 86" fill="none" stroke="${c1}" stroke-width="3" stroke-linecap="round"/>
      <path d="M145 85 Q122 77 104 86" fill="none" stroke="${c1}" stroke-width="3" stroke-linecap="round"/>
      <line x1="55" y1="88" x2="68" y2="108" stroke="${c1}" stroke-width="1.5" opacity="0.6"/>
      <path d="M76 132 L124 132" stroke="${c1}" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
      <path d="M85 140 Q100 155 115 140 Q110 165 100 168 Q90 165 85 140Z" fill="#1a0000" stroke="${c1}" stroke-width="1" opacity="0.5"/>`,
  }

  const body = shapes[shape] || shapes.soldier
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="${bg}" rx="0"/>
  <rect width="200" height="200" fill="none" stroke="${c1}" stroke-width="1" opacity="0.2"/>
  ${body}
  <text x="100" y="185" text-anchor="middle" font-size="13" fill="${c1}" font-family="serif" opacity="0.85">${suit}</text>
  <text x="14" y="22" text-anchor="middle" font-size="10" fill="${c1}" font-family="serif" opacity="0.4">${suit}</text>
  <line x1="0" y1="199" x2="200" y2="199" stroke="${c1}" stroke-width="2" opacity="0.5"/>
</svg>`
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))
}

const PLAYERS_DATA = [
  { name:'Alibek', suit:'♠', c1:'#00f5ff', c2:'#ff00ff', bg:'#050a18', shape:'soldier' },
  { name:'Abylay', suit:'♦', c1:'#ff00ff', c2:'#00f5ff', bg:'#130515', shape:'oni' },
  { name:'Almas',  suit:'♣', c1:'#7fff00', c2:'#00f5ff', bg:'#011005', shape:'hacker' },
  { name:'Yerbol', suit:'♥', c1:'#ff6b00', c2:'#ff3300', bg:'#120500', shape:'fire' },
  { name:'Mels',   suit:'♠', c1:'#b44fff', c2:'#00f5ff', bg:'#080515', shape:'mage' },
  { name:'Daulet', suit:'♦', c1:'#00ffaa', c2:'#00f5ff', bg:'#020f10', shape:'captain' },
  { name:'Aibala', suit:'♥', c1:'#ff4488', c2:'#ff00ff', bg:'#150510', shape:'queen' },
  { name:'Nigara', suit:'♣', c1:'#ffdd00', c2:'#ff6b00', bg:'#110a00', shape:'shaman' },
  { name:'Tanat',  suit:'♠', c1:'#00ccff', c2:'#b44fff', bg:'#020a12', shape:'ice' },
  { name:'Sultan', suit:'♦', c1:'#ff3333', c2:'#ff6b00', bg:'#0f0000', shape:'emperor' },
]

export function seedIfEmpty() {
  const existing = getPlayers()
  if (existing.length > 0) return // уже есть данные

  // Только игроки — без сезона и игр
  const players = PLAYERS_DATA.map(d => ({
    id: crypto.randomUUID(),
    name: d.name,
    photoBase64: makeAvatar(d.suit, d.c1, d.c2, d.bg, d.c1, d.shape),
    createdAt: Date.now(),
  }))
  savePlayers(players)
}
