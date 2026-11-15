// 지금 뭐하니 — 공통 코드 (행동 목록, 미니미, 장면, 데이터 연결)
(function () {
  'use strict';

  // ───────── 가족 · 행동 · 마음 목록 ─────────
  const MEMBERS = {
    dad:   { name: '아빠', hair: '#3a2a20', shirt: '#4f8ff7', pants: '#33415f' },
    mom:   { name: '엄마', hair: '#5b3a29', shirt: '#ff8fab', pants: '#5a4a6a' },
    monet: { name: '모네', hair: '#2e211b', shirt: '#ffd166', pants: '#ef8fa6' },
  };

  const ACTIONS = [
    { key: 'toilet',   emoji: '🚽', label: '화장실',   say: '화장실에 있어요' },
    { key: 'meal',     emoji: '🍚', label: '식사',     say: '밥 먹는 중' },
    { key: 'meeting',  emoji: '💼', label: '회의',     say: '회의 중' },
    { key: 'coffee',   emoji: '☕', label: '커피',     say: '커피 마시는 중' },
    { key: 'work',     emoji: '💻', label: '혼자 일',  say: '혼자 일하는 중' },
    { key: 'subway',   emoji: '🚇', label: '지하철',   say: '지하철 타고 가는 중' },
    { key: 'bus',      emoji: '🚌', label: '버스',     say: '버스 타고 가는 중' },
    { key: 'train',    emoji: '🚄', label: '기차',     say: '기차 타고 가는 중' },
    { key: 'car',      emoji: '🚗', label: '차',       say: '차 타고 가는 중' },
    { key: 'shopping', emoji: '🛒', label: '쇼핑',     say: '쇼핑하는 중' },
    { key: 'walk',     emoji: '🚶', label: '걷기',     say: '걷는 중' },
    { key: 'home',     emoji: '🏠', label: '집에 가요', say: '집에 가는 중!' },
    { key: 'sleep',    emoji: '😴', label: '잠',       say: '자는 중' },
  ];

  const HEARTS = [
    { key: 'love',  emoji: '💗', label: '사랑해' },
    { key: 'hug',   emoji: '🤗', label: '꼭 안아줘' },
    { key: 'miss',  emoji: '🥺', label: '보고 싶어' },
    { key: 'cheer', emoji: '💪', label: '화이팅' },
    { key: 'night', emoji: '🌙', label: '잘 자' },
  ];

  const actionOf = (k) => ACTIONS.find((a) => a.key === k) || null;
  const heartOf = (k) => HEARTS.find((h) => h.key === k) || HEARTS[0];

  // ───────── 미니미 ─────────
  const SKIN = '#ffe0c7';
  function minimi(m) {
    const arm = (side, x) => `
      <g transform="translate(${x},-64)"><g class="arm${side}">
        <rect x="-5" y="0" width="10" height="30" rx="5" fill="${m.shirt}"/>
        <circle cx="0" cy="32" r="6.5" fill="${SKIN}"/>
        <g transform="translate(0,32)"><g class="prop${side}"></g></g>
      </g></g>`;
    const leg = (side, x, shoe) => `
      <g transform="translate(${x},-28)"><g class="leg${side}">
        <rect x="-6" y="0" width="12" height="28" rx="6" fill="${m.pants}"/>
        <ellipse cx="${shoe}" cy="27" rx="9" ry="5" fill="#4a3b33"/>
      </g></g>`;
    return `
      <g class="legs">${leg('L', -9, -2)}${leg('R', 9, 2)}</g>
      <g class="seat"><g class="upper">
        <rect x="-22" y="-72" width="44" height="48" rx="16" fill="${m.shirt}"/>
        <path d="M-8 -72 L0 -63 L8 -72" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        ${arm('L', -23)}${arm('R', 23)}
        <g transform="translate(0,-112)"><g class="head">
          <circle r="44" fill="${SKIN}"/>
          <path d="M-46 6 C-52 -38 -22 -54 0 -52 C24 -54 52 -38 46 6 C44 -10 36 -20 24 -24 C12 -14 -8 -12 -20 -24 C-32 -20 -42 -10 -46 6 Z" fill="${m.hair}"/>
          <path d="M-2 -50 q4 -16 18 -12 q-10 2 -10 12 z" fill="${m.hair}"/>
          <g transform="translate(0,6)"><g class="eyes">
            <ellipse cx="-15" cy="0" rx="3.8" ry="5.2" fill="#2b2b2b"/>
            <ellipse cx="15" cy="0" rx="3.8" ry="5.2" fill="#2b2b2b"/>
          </g></g>
          <path class="eyes-closed" d="M-21 6 q6 5 12 0 M9 6 q6 5 12 0" stroke="#2b2b2b" stroke-width="2.6" fill="none" stroke-linecap="round"/>
          <circle cx="-27" cy="18" r="7" fill="#ff9aa2" opacity=".55"/>
          <circle cx="27" cy="18" r="7" fill="#ff9aa2" opacity=".55"/>
          <path class="mouth" d="M-7 21 Q0 28 7 21" stroke="#c0605a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        </g></g>
      </g></g>`;
  }

  // 손에 드는 소품 (손 위치 기준 좌표)
  const PROPS = {
    spoon: `<rect x="-2" y="-26" width="4" height="22" rx="2" fill="#b9b9b9"/><ellipse cx="0" cy="-30" rx="6" ry="8" fill="#d6d6d6"/>`,
    mug: `<g transform="translate(0,-6)">
      <rect x="-11" y="-16" width="22" height="22" rx="4" fill="#fff" stroke="#8a5a3c" stroke-width="2.5"/>
      <path d="M11 -11 q9 0 9 6 q0 6 -9 6" stroke="#8a5a3c" fill="none" stroke-width="2.5"/>
      <path class="steam" d="M-4 -20 q-4 -6 0 -12" stroke="#bbb" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path class="steam" style="animation-delay:.9s" d="M4 -20 q4 -6 0 -12" stroke="#bbb" stroke-width="2" fill="none" stroke-linecap="round"/></g>`,
  };

  // ───────── 장면 도구 ─────────
  const W = 800;
  const rep = (n, fn) => { let s = ''; for (let i = 0; i < n; i++) s += fn(i, (i * W) / n); return s; };
  const strip = (content, sec) =>
    `<g class="scroll" style="animation-duration:${sec}s">${content}<g transform="translate(${W},0)">${content}</g></g>`;
  const win = (x, y, w, h, inner, r = 14) =>
    `<svg x="${x}" y="${y}" width="${w}" height="${h}" overflow="hidden">${inner}</svg>
     <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="none" stroke="#8a97a8" stroke-width="6"/>`;
  const tree = (x, y, s = 1, c = '#6cc070') =>
    `<g transform="translate(${x},${y}) scale(${s})"><rect x="-5" y="-30" width="10" height="30" fill="#8b5e3c"/>
      <circle cx="0" cy="-50" r="26" fill="${c}"/><circle cx="-15" cy="-36" r="17" fill="${c}"/><circle cx="15" cy="-36" r="17" fill="${c}"/></g>`;
  const bldg = (x, base, w, h, c) => {
    let wins = '';
    for (let yy = base - h + 14; yy < base - 18; yy += 26)
      for (let xx = x + 10; xx < x + w - 14; xx += 22) wins += `<rect x="${xx}" y="${yy}" width="10" height="12" rx="2" fill="#fff6c7" opacity=".85"/>`;
    return `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" rx="4" fill="${c}"/>${wins}`;
  };
  const cloud = (x, y, s = 1) =>
    `<g transform="translate(${x},${y}) scale(${s})" fill="#fff" opacity=".9"><circle r="18"/><circle cx="20" cy="4" r="14"/><circle cx="-20" cy="5" r="13"/></g>`;
  const mountains = (base, c) =>
    `<path d="M0 ${base} L90 ${base - 90} L170 ${base - 30} L270 ${base - 120} L380 ${base - 20} L470 ${base - 100} L560 ${base - 40} L660 ${base - 110} L800 ${base} Z" fill="${c}"/>`;
  const floor = (c, y = 380) => `<rect y="${y}" width="800" height="${450 - y}" fill="${c}"/>`;

  // 장면 정의: pose(미니미 동작), at([x,y,크기,회전]), bg(뒤), fg(앞), prop(손 소품)
  const SCENES = {
    idle: {
      pose: 'wave', at: [400, 380, 1.3],
      bg: () => `<rect width="800" height="450" fill="#eaf2ff"/>${cloud(160, 90, 1.4)}${cloud(620, 120)}${floor('#cfe3c6')}`,
    },
    toilet: {
      pose: 'sit dangle tilt', at: [400, 380, 1.25],
      bg: () => `<rect width="800" height="450" fill="#e3f4f8"/>
        ${rep(10, (i, x) => `<line x1="${x}" y1="0" x2="${x}" y2="380" stroke="#cde9f0" stroke-width="2"/>`)}
        ${rep(6, (i) => `<line x1="0" y1="${i * 64}" x2="800" y2="${i * 64}" stroke="#cde9f0" stroke-width="2"/>`)}
        ${floor('#bfe0e8')}
        <rect x="346" y="196" width="108" height="76" rx="12" fill="#fff" stroke="#c4dde5" stroke-width="3"/>
        <rect x="372" y="300" width="56" height="80" rx="6" fill="#fff" stroke="#c4dde5" stroke-width="3"/>
        <ellipse cx="400" cy="352" rx="74" ry="20" fill="#fff" stroke="#c4dde5" stroke-width="3"/>
        <g transform="translate(560,240)"><rect x="-4" y="-8" width="58" height="8" rx="3" fill="#b0bec5"/>
          <rect x="4" y="0" width="42" height="34" rx="8" fill="#fff" stroke="#ddd" stroke-width="3"/>
          <rect x="10" y="30" width="30" height="40" fill="#fff" stroke="#ddd" stroke-width="2"/></g>
        <g transform="translate(110,70)"><rect width="190" height="60" rx="14" fill="#fff" stroke="#9fd3df" stroke-width="3"/>
          <text x="95" y="39" text-anchor="middle" font-size="26" font-weight="700" fill="#3a8fa3">똑똑! 사용중</text></g>`,
    },
    meal: {
      pose: 'sit eat', prop: 'spoon', at: [400, 382, 1.3],
      bg: () => `<rect width="800" height="450" fill="#fff3e0"/>
        ${win(560, 60, 180, 140, `<rect width="180" height="140" fill="#bfe6ff"/>${cloud(60, 50)}${tree(130, 150, .8)}`)}
        <rect x="70" y="80" width="150" height="16" rx="4" fill="#d9a066"/>
        <circle cx="105" cy="68" r="14" fill="#ff8a65"/><circle cx="145" cy="66" r="16" fill="#ffd54f"/><rect x="170" y="52" width="22" height="28" rx="6" fill="#81c784"/>
        ${floor('#e8c9a0')}`,
      fg: () => `<rect x="200" y="338" width="400" height="16" rx="6" fill="#c98b55"/>
        <rect x="216" y="354" width="368" height="60" fill="#f6d7b0"/>
        <rect x="230" y="354" width="14" height="96" fill="#a86d3c"/><rect x="556" y="354" width="14" height="96" fill="#a86d3c"/>
        <path d="M300 338 q30 -40 60 0 z" fill="#fff"/><ellipse cx="330" cy="338" rx="34" ry="8" fill="#e57373"/>
        <path d="M440 338 q30 -30 60 0 z" fill="#ffb74d"/><ellipse cx="470" cy="338" rx="34" ry="8" fill="#8d6e63"/>
        <ellipse cx="400" cy="334" rx="18" ry="6" fill="#aed581"/>`,
    },
    meeting: {
      pose: 'point', at: [470, 380, 1.3],
      bg: () => `<rect width="800" height="450" fill="#eef1f7"/>
        <rect x="70" y="70" width="270" height="190" rx="10" fill="#fff" stroke="#9aa6b8" stroke-width="5"/>
        <rect x="110" y="190" width="30" height="50" fill="#64b5f6"/><rect x="160" y="160" width="30" height="80" fill="#81c784"/>
        <rect x="210" y="130" width="30" height="110" fill="#ffb74d"/><rect x="260" y="100" width="30" height="140" fill="#e57373"/>
        <path d="M110 170 L175 140 L225 110 L290 85" stroke="#5c6bc0" stroke-width="4" fill="none" stroke-linecap="round"/>
        <rect x="190" y="260" width="30" height="120" fill="#9aa6b8"/>
        <g transform="translate(560,170)"><rect width="150" height="64" rx="22" fill="#fff" stroke="#c5cbe0" stroke-width="3"/>
          <path d="M20 60 l-14 22 l30 -18 z" fill="#fff"/>
          <circle class="dot1" cx="45" cy="32" r="8" fill="#7986cb"/><circle class="dot2" cx="75" cy="32" r="8" fill="#7986cb"/><circle class="dot3" cx="105" cy="32" r="8" fill="#7986cb"/></g>
        ${floor('#d5dae6')}`,
    },
    coffee: {
      pose: 'sip', prop: 'mug', at: [320, 380, 1.3],
      bg: () => `<rect width="800" height="450" fill="#f6e7d8"/>
        ${win(470, 70, 270, 230, `<rect width="270" height="230" fill="#cdeaff"/>${cloud(70, 50)}${bldg(20, 230, 70, 120, '#b0bec5')}${bldg(110, 230, 60, 160, '#90a4ae')}${tree(220, 230, .9)}`)}
        <line x1="150" y1="0" x2="150" y2="70" stroke="#6d4c41" stroke-width="3"/><path d="M120 70 h60 l-12 -22 h-36 z" fill="#ffca28"/>
        <g transform="translate(110,380)"><rect x="-26" y="-50" width="52" height="50" rx="8" fill="#a1887f"/>
          <circle cx="0" cy="-74" r="30" fill="#81c784"/><circle cx="-22" cy="-62" r="20" fill="#66bb6a"/><circle cx="22" cy="-62" r="20" fill="#66bb6a"/></g>
        ${floor('#d7b896')}`,
    },
    work: {
      pose: 'sit type', at: [400, 384, 1.3],
      bg: () => `<rect width="800" height="450" fill="#e8f0ea"/>
        <rect x="80" y="110" width="170" height="12" rx="3" fill="#a1887f"/>
        <rect x="95" y="76" width="18" height="34" fill="#e57373"/><rect x="116" y="70" width="16" height="40" fill="#64b5f6"/><rect x="135" y="80" width="20" height="30" fill="#ffd54f"/>
        <g transform="translate(640,110)"><circle r="44" fill="#fff" stroke="#90a4ae" stroke-width="5"/>
          <line x1="0" y1="0" x2="0" y2="-28" stroke="#455a64" stroke-width="4" stroke-linecap="round"/>
          <g class="spin" style="animation-duration:6s"><line x1="0" y1="0" x2="22" y2="0" stroke="#e57373" stroke-width="3" stroke-linecap="round"/></g></g>
        ${floor('#c9d8cc')}`,
      fg: () => `<rect x="190" y="350" width="420" height="16" rx="6" fill="#8d6e63"/>
        <rect x="210" y="366" width="380" height="84" fill="#a1887f"/>
        <rect x="335" y="296" width="130" height="56" rx="6" fill="#b0bec5" stroke="#90a4ae" stroke-width="3"/>
        <circle cx="400" cy="324" r="8" fill="#eceff1"/>
        <rect x="520" y="318" width="28" height="32" rx="5" fill="#fff" stroke="#8a5a3c" stroke-width="2.5"/>`,
    },
    subway: {
      pose: 'strap', at: [400, 380, 1.3],
      bg: () => `<rect width="800" height="450" fill="#e9edf2"/>
        ${win(40, 90, 720, 160, `<rect width="720" height="160" fill="#2b2f3a"/>${strip(rep(4, (i, x) => `<rect x="${x + 40}" y="60" width="90" height="10" rx="5" fill="#ffe082"/>`), 1.2)}`, 18)}
        <rect y="262" width="800" height="14" fill="#3cb44b"/>
        <line x1="0" y1="58" x2="800" y2="58" stroke="#9aa6b8" stroke-width="8"/>
        ${[140, 280, 560, 690].map((x) => `<line x1="${x}" y1="58" x2="${x}" y2="110" stroke="#cfd8dc" stroke-width="5"/><circle cx="${x}" cy="122" r="12" fill="none" stroke="#cfd8dc" stroke-width="5"/>`).join('')}
        <line x1="430" y1="58" x2="430" y2="228" stroke="#cfd8dc" stroke-width="5"/><circle cx="430" cy="240" r="12" fill="none" stroke="#cfd8dc" stroke-width="5"/>
        <rect x="40" y="320" width="220" height="60" rx="10" fill="#81c784"/><rect x="540" y="320" width="220" height="60" rx="10" fill="#81c784"/>
        ${floor('#b0bec5')}`,
    },
    bus: {
      pose: 'sit ride', at: [400, 384, 1.3],
      bg: () => `<rect width="800" height="450" fill="#fdf3dc"/>
        ${win(40, 80, 720, 180, `<rect width="720" height="180" fill="#bfe6ff"/>${strip(rep(4, (i, x) => bldg(x + 20, 180, 80, 90 + (i % 2) * 40, i % 2 ? '#b0bec5' : '#ce93d8') + tree(x + 150, 180, .8)), 7)}`, 18)}
        <rect x="290" y="250" width="220" height="150" rx="26" fill="#4fc3f7"/>
        ${floor('#cfb991')}`,
      fg: () => `<rect x="280" y="352" width="240" height="40" rx="14" fill="#29b6f6"/>`,
    },
    train: {
      pose: 'sit ride', at: [400, 384, 1.3],
      bg: () => `<rect width="800" height="450" fill="#eef3fb"/>
        ${win(40, 70, 720, 190, `<rect width="720" height="190" fill="#bfe6ff"/>
          ${strip(mountains(190, '#9ccc65'), 24)}
          ${strip(rep(5, (i, x) => `<rect x="${x}" y="40" width="8" height="150" fill="#78909c"/>`), 1.3)}`, 40)}
        <rect x="300" y="236" width="200" height="170" rx="30" fill="#26a69a"/><rect x="330" y="236" width="140" height="34" rx="12" fill="#fff"/>
        ${floor('#9fa8da')}`,
      fg: () => `<rect x="290" y="352" width="220" height="40" rx="14" fill="#00897b"/>`,
    },
    car: {
      pose: 'sit drive', at: [380, 352, 1.0],
      bg: () => `<rect width="800" height="450" fill="#cdeaff"/>
        ${strip(cloud(200, 70) + cloud(600, 110, 1.3), 30)}
        ${strip(mountains(330, '#aed581'), 18)}
        ${strip(rep(4, (i, x) => tree(x + 60, 340, .9, i % 2 ? '#66bb6a' : '#43a047')), 4)}
        <rect y="340" width="800" height="110" fill="#78909c"/>
        ${strip(rep(5, (i, x) => `<rect x="${x}" y="420" width="70" height="8" rx="4" fill="#fff"/>`), .7)}`,
      fg: () => `<path d="M262 300 L314 196 L496 196 L560 300 Z" fill="#bfe6ff" opacity=".25"/>
        <path d="M262 300 L314 196 L496 196 L560 300" fill="none" stroke="#ef6b5b" stroke-width="14" stroke-linejoin="round"/>
        <line x1="404" y1="196" x2="404" y2="300" stroke="#ef6b5b" stroke-width="0"/>
        <path d="M232 296 L610 296 Q640 300 640 326 L640 360 Q640 382 618 382 L232 382 Q200 382 200 356 L200 326 Q200 296 232 296 Z" fill="#ef6b5b"/>
        <rect x="200" y="296" width="440" height="10" fill="#e25546"/>
        <rect x="420" y="318" width="34" height="8" rx="4" fill="#c64536"/>
        <circle cx="616" cy="318" r="10" fill="#fff59d"/>
        ${[300, 540].map((x) => `<g transform="translate(${x},384)"><circle r="36" fill="#37474f"/><circle r="16" fill="#cfd8dc"/>
          <g class="spin"><rect x="-3" y="-30" width="6" height="60" fill="#90a4ae"/><rect x="-30" y="-3" width="60" height="6" fill="#90a4ae"/></g><circle r="8" fill="#eceff1"/></g>`).join('')}`,
      cut: true,
    },
    shopping: {
      pose: 'walk push', at: [300, 380, 1.3],
      bg: () => `<rect width="800" height="450" fill="#fdeef2"/>
        ${strip(rep(2, (i, x) => `<g transform="translate(${x + 30},0)"><rect y="90" width="340" height="230" rx="8" fill="#fff" stroke="#f3c1cf" stroke-width="4"/>
          ${[150, 220, 290].map((y) => `<rect x="0" y="${y}" width="340" height="8" fill="#f3c1cf"/>`).join('')}
          ${rep(6, (j, xx) => `<rect x="${xx * 0.425 + 14}" y="112" width="34" height="38" rx="6" fill="${['#ef9a9a', '#ffcc80', '#a5d6a7', '#90caf9', '#ce93d8', '#fff59d'][j]}"/>
            <circle cx="${xx * 0.425 + 31}" cy="200" r="16" fill="${['#ff8a65', '#aed581', '#ffd54f', '#4dd0e1', '#f48fb1', '#b39ddb'][j]}"/>
            <rect x="${xx * 0.425 + 16}" y="248" width="30" height="42" rx="4" fill="${['#80cbc4', '#ffab91', '#e6ee9c', '#b0bec5', '#ffe082', '#9fa8da'][j]}"/>`)}</g>`), 10)}
        ${floor('#f8d7e0')}`,
      fg: () => `<g transform="translate(380,0)">
        <path d="M0 280 L160 280 L144 350 L18 350 Z" fill="#90caf9" opacity=".75" stroke="#1e88e5" stroke-width="4" stroke-linejoin="round"/>
        ${rep(4, (i) => `<line x1="${36 + i * 30}" y1="282" x2="${40 + i * 26}" y2="348" stroke="#1e88e5" stroke-width="2"/>`)}
        <path d="M0 280 L-30 256" stroke="#1e88e5" stroke-width="6" stroke-linecap="round"/>
        <rect x="60" y="250" width="40" height="34" rx="6" fill="#ffcc80"/><circle cx="118" cy="266" r="16" fill="#ef5350"/>
        <line x1="18" y1="350" x2="18" y2="366" stroke="#1e88e5" stroke-width="4"/><line x1="144" y1="350" x2="144" y2="366" stroke="#1e88e5" stroke-width="4"/>
        <circle cx="22" cy="372" r="9" fill="#455a64"/><circle cx="140" cy="372" r="9" fill="#455a64"/></g>`,
    },
    walk: {
      pose: 'walk', at: [400, 380, 1.3],
      bg: () => `<rect width="800" height="450" fill="#cdeaff"/>
        ${strip(cloud(150, 80) + cloud(520, 60, 1.3), 40)}
        ${strip(rep(5, (i, x) => bldg(x + 10, 330, 120, 120 + (i % 3) * 50, ['#b0bec5', '#ffcc80', '#ce93d8'][i % 3])), 14)}
        ${strip(rep(3, (i, x) => tree(x + 80, 350, 1)), 6)}
        <rect y="350" width="800" height="100" fill="#e0e0e0"/>
        ${strip(rep(8, (i, x) => `<line x1="${x}" y1="350" x2="${x - 30}" y2="450" stroke="#c7c7c7" stroke-width="3"/>`), 6)}`,
    },
    home: {
      pose: 'walk', at: [320, 380, 1.3],
      bg: () => `<rect width="800" height="450" fill="#ffd8b5"/><circle cx="660" cy="110" r="46" fill="#ffab73"/>
        ${strip(cloud(200, 90) + cloud(560, 60), 30)}
        ${strip(rep(3, (i, x) => tree(x + 60, 360, .8, '#8bc34a')), 9)}
        <g transform="translate(560,360)"><rect x="0" y="-130" width="180" height="130" fill="#fff3e0"/>
          <path d="M-20 -126 L90 -210 L200 -126 Z" fill="#e57373"/>
          <rect x="70" y="-70" width="44" height="70" rx="6" fill="#8d6e63"/>
          <rect x="18" y="-104" width="36" height="32" rx="4" fill="#fff59d"/><rect x="130" y="-104" width="36" height="32" rx="4" fill="#fff59d"/>
          <text x="90" y="-150" text-anchor="middle" font-size="34">💗</text></g>
        <rect y="360" width="800" height="90" fill="#c5e1a5"/>`,
    },
    sleep: {
      pose: 'sleep', at: [420, 318, 1.15, -90],
      bg: () => `<rect width="800" height="450" fill="#2a3157"/>
        ${win(520, 50, 180, 150, `<rect width="180" height="150" fill="#1b2140"/><circle cx="120" cy="60" r="30" fill="#fff59d"/><circle cx="134" cy="52" r="26" fill="#1b2140"/>
          ${[[30, 30], [60, 100], [90, 40], [40, 130], [160, 120]].map(([x, y], i) => `<circle class="twinkle" style="animation-delay:${i * .4}s" cx="${x}" cy="${y}" r="3" fill="#fff"/>`).join('')}`)}
        <rect x="200" y="250" width="30" height="150" rx="10" fill="#8d6e63"/>
        <rect x="200" y="330" width="420" height="40" rx="10" fill="#a1887f"/>
        <ellipse cx="290" cy="322" rx="54" ry="20" fill="#fff"/>
        <rect y="400" width="800" height="50" fill="#3c4470"/>`,
      fg: () => `<path d="M322 300 Q330 272 380 272 L600 272 Q620 272 620 296 L620 340 L322 340 Z" fill="#7986cb"/>
        <path d="M340 290 L610 290" stroke="#9fa8da" stroke-width="6"/>
        ${[0, 1, 2].map((i) => `<text class="zzz" style="animation-delay:${i}s" x="250" y="230" font-size="${26 + i * 6}" font-weight="700" fill="#c5cae9">Z</text>`).join('')}`,
    },
  };

  function sceneSVG(actionKey, memberKey) {
    const sc = SCENES[actionKey] || SCENES.idle;
    const m = MEMBERS[memberKey] || MEMBERS.dad;
    const [x, y, s, r = 0] = sc.at;
    const prop = sc.prop ? PROPS[sc.prop] : '';
    const body = minimi(m).replace('<g class="propR"></g>', `<g class="propR">${prop}</g>`);
    return `<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" class="scene">
      ${sc.bg()}
      <g transform="translate(${x},${y}) rotate(${r}) scale(${s})"><g class="mm ${sc.pose}">${body}</g></g>
      ${sc.fg ? sc.fg() : ''}
    </svg>`;
  }

  // ───────── 시간 표시 ─────────
  function ago(iso) {
    if (!iso) return '';
    const min = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
    if (min < 1) return '방금 전부터';
    if (min < 60) return `${min}분째`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h}시간 ${min % 60}분째`;
    return `${Math.floor(h / 24)}일째`;
  }
  const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.toISOString(); };

  // ───────── 데이터 연결 (Supabase, 없으면 데모) ─────────
  function makeApi() {
    const cfg = window.FAMILY_CONFIG || {};
    const hasKey = cfg.SUPABASE_KEY && !/PASTE_/.test(cfg.SUPABASE_KEY);
    if (hasKey && window.supabase && window.supabase.createClient) return supabaseApi(cfg);
    return demoApi();
  }

  function supabaseApi(cfg) {
    const sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_KEY);
    return {
      mode: 'live',
      async latestStatus(member) {
        const { data, error } = await sb.from('status').select('*').eq('member', member).order('created_at', { ascending: false }).limit(1);
        if (error) throw error;
        return data && data[0];
      },
      async setStatus(member, action) {
        const { error } = await sb.from('status').insert({ member, action });
        if (error) throw error;
      },
      async sendHeart(from, to, kind) {
        const { error } = await sb.from('hearts').insert({ from_member: from, to_member: to, kind });
        if (error) throw error;
      },
      async heartsToday(to) {
        const { data, error } = await sb.from('hearts').select('*').eq('to_member', to).gte('created_at', startOfToday()).order('created_at', { ascending: false }).limit(100);
        if (error) throw error;
        return data || [];
      },
      subscribe(onStatus, onHeart, onConn) {
        sb.channel('family-' + Math.random().toString(36).slice(2))
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'status' }, (p) => onStatus(p.new))
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'hearts' }, (p) => onHeart(p.new))
          .subscribe((st) => onConn && onConn(st));
      },
    };
  }

  // 데모: 같은 브라우저의 탭끼리만 주고받음 (서버 없음)
  function demoApi() {
    const KEY = 'jigeum-demo';
    let ch = null;
    try { ch = new BroadcastChannel(KEY); } catch (e) { /* 지원 안 함 */ }
    const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || { status: [], hearts: [] }; } catch (e) { return { status: [], hearts: [] }; } };
    const save = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* 무시 */ } };
    const listeners = [];
    const emit = (msg) => { listeners.forEach((fn) => fn(msg)); if (ch) ch.postMessage(msg); };
    if (ch) ch.onmessage = (e) => listeners.forEach((fn) => fn(e.data));
    let id = Date.now();
    return {
      mode: 'demo',
      async latestStatus(member) { return load().status.filter((s) => s.member === member).pop(); },
      async setStatus(member, action) {
        const row = { id: ++id, member, action, created_at: new Date().toISOString() };
        const d = load(); d.status.push(row); d.status = d.status.slice(-50); save(d); emit({ t: 'status', row });
      },
      async sendHeart(from, to, kind) {
        const row = { id: ++id, from_member: from, to_member: to, kind, created_at: new Date().toISOString() };
        const d = load(); d.hearts.push(row); d.hearts = d.hearts.slice(-200); save(d); emit({ t: 'heart', row });
      },
      async heartsToday(to) { const s = startOfToday(); return load().hearts.filter((h) => h.to_member === to && h.created_at >= s).reverse(); },
      subscribe(onStatus, onHeart, onConn) {
        listeners.push((m) => (m.t === 'status' ? onStatus(m.row) : onHeart(m.row)));
        if (onConn) onConn('DEMO');
      },
    };
  }

  // 화면 꺼짐 방지 (지원되는 브라우저에서만)
  async function keepAwake() {
    try {
      if ('wakeLock' in navigator) {
        await navigator.wakeLock.request('screen');
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') navigator.wakeLock.request('screen').catch(() => {});
        });
      }
    } catch (e) { /* 무시 */ }
  }

  window.Family = { MEMBERS, ACTIONS, HEARTS, actionOf, heartOf, sceneSVG, ago, makeApi, keepAwake };
})();
