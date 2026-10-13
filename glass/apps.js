// GlassOS — icone e app integrate (Calcolatrice, Note, Meteo, Orologio, Personalizza)
'use strict';

const G = {
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" fill="#fff" stroke="none"/>',
  msg: '<path d="M12 3C6.5 3 2 6.8 2 11.4c0 2.6 1.4 4.9 3.7 6.4L5 21.5l4.2-2.4c.9.2 1.8.3 2.8.3 5.5 0 10-3.8 10-8.4S17.5 3 12 3z" fill="#fff" stroke="none"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z" fill="#fff"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  calc: '<circle cx="7" cy="7" r="2.2" fill="#fff" stroke="none"/><circle cx="17" cy="7" r="2.2" fill="#ff9f0a" stroke="none"/><circle cx="7" cy="17" r="2.2" fill="#fff" stroke="none"/><circle cx="17" cy="17" r="2.2" fill="#ff9f0a" stroke="none"/>',
  notes: '<path d="M5 3h14v18H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  sun: '<circle cx="9" cy="9" r="4" fill="#ffd60a" stroke="none"/><path d="M19 13h-1a6 6 0 1 0-6 8h7a4 4 0 0 0 0-8z" fill="#fff" stroke="none"/>',
  mail: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="m2 7 10 7 10-7"/>',
  map: '<path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4z"/><path d="M8 2v16M16 6v16"/>',
  play: '<rect x="2" y="5" width="20" height="14" rx="4" fill="#fff" stroke="none"/><path d="m10 9 5 3-5 3z" fill="#ff0033" stroke="none"/>',
  insta: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="#fff"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>',
  video: '<path d="m23 7-7 5 7 5z"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
  flash: '<path d="M8 2h8v5l-2 4v11h-4V11L8 7z"/><path d="M8 6h8"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  wifi: '<path d="M5 12.6a10 10 0 0 1 14 0M8.5 16.1a5 5 0 0 1 7 0M2 8.8a15 15 0 0 1 20 0"/><circle cx="12" cy="19.5" r="1" fill="currentColor"/>',
  bt: '<path d="m7 7 10 10-5 5V2l5 5L7 17"/>',
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  data: '<path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16"/>',
  rotate: '<rect x="7" y="10" width="10" height="8" rx="1.5"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  brush: '<path d="M9.1 11.1 18 2.2a2 2 0 0 1 2.8 2.8l-8.9 8.9"/><path d="M7 14c-1.7 0-3 1.3-3 3 0 1.3-1 2-2 2 1 1.4 2.6 2 4 2 2.2 0 4-1.8 4-4 0-1.7-1.3-3-3-3z"/>',
  sun2: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  vol: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
  contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/>',
  film: '<rect x="2" y="3" width="20" height="18" rx="2"/><path d="M7 3v18M17 3v18M2 9h5M17 9h5M2 15h5M17 15h5"/>',
};
const glyph = (k) => `<svg class="glyph" viewBox="0 0 24 24">${G[k] || ''}</svg>`;
const svg = (k, cls = '') => `<svg viewBox="0 0 24 24" class="${cls}">${G[k] || ''}</svg>`;

// icona Foto (fiore a petali colorati)
function photosIcon() {
  const cols = ['#ff9f0a', '#ffd60a', '#a4e04b', '#30d158', '#64d2ff', '#0a84ff', '#bf5af2', '#ff375f'];
  let p = '';
  cols.forEach((c, i) => { p += `<ellipse cx="12" cy="6.6" rx="3" ry="5.4" fill="${c}" opacity=".88" transform="rotate(${i * 45} 12 12)" style="mix-blend-mode:multiply"/>`; });
  return `<svg class="photos" viewBox="0 0 24 24">${p}</svg>`;
}
function calendarIcon() {
  const d = new Date();
  return `<div class="cal"><span class="cal-day">${d.toLocaleDateString('it-IT', { weekday: 'long' })}</span><span class="cal-num">${d.getDate()}</span></div>`;
}

const grad = (a, b) => `linear-gradient(180deg, ${a}, ${b})`;

// Tutte le app conosciute. In modalita' launcher le app vere arrivano da Android
// (vedi os.js), queste restano come app integrate o come scorciatoie nel browser.
const BUILTIN = {
  'glass.calc':    { name: 'Calcolatrice', bg: grad('#3a3a3c', '#1c1c1e'), glyph: 'calc', open: () => CalcApp },
  'glass.notes':   { name: 'Note',         bg: grad('#ffe066', '#ffcc00'), glyph: 'notes', glyphColor: '#5b4a00', open: () => NotesApp },
  'glass.weather': { name: 'Meteo',        bg: grad('#4fb4ff', '#1567d3'), glyph: 'sun', open: () => WeatherApp },
  'glass.clock':   { name: 'Orologio',     bg: grad('#1c1c1e', '#000'), glyph: 'clock', open: () => ClockApp },
  'glass.settings':{ name: 'Personalizza', bg: grad('#a1a1a6', '#636366'), glyph: 'gear', open: () => SettingsApp },
};

// scorciatoie usate solo nella versione web (senza launcher installato)
const WEB_APPS = {
  'web.phone':   { name: 'Telefono',  bg: grad('#5df179', '#28c840'), glyph: 'phone', href: 'tel:' },
  'web.sms':     { name: 'Messaggi',  bg: grad('#5df179', '#28c840'), glyph: 'msg', href: 'sms:' },
  'web.browser': { name: 'Chrome',    bg: grad('#4fc3ff', '#0a6cff'), glyph: 'compass', href: 'https://www.google.com' },
  'web.camera':  { name: 'Fotocamera',bg: grad('#d1d1d6', '#8e8e93'), glyph: 'camera', href: 'intent:#Intent;action=android.media.action.STILL_IMAGE_CAMERA;end' },
  'web.photos':  { name: 'Foto',      bg: '#fff', special: 'photos', href: 'intent://photos.google.com/#Intent;scheme=https;package=com.google.android.apps.photos;end' },
  'web.calendar':{ name: 'Calendario',bg: '#fff', special: 'calendar', href: 'intent://calendar.google.com/#Intent;scheme=https;package=com.google.android.calendar;end' },
  'web.whatsapp':{ name: 'WhatsApp',  bg: grad('#5af07c', '#1fb855'), glyph: 'msg', href: 'intent://send/#Intent;scheme=whatsapp;package=com.whatsapp;end' },
  'web.insta':   { name: 'Instagram', bg: 'linear-gradient(45deg,#feda75,#fa7e1e 30%,#d62976 60%,#962fbf 80%,#4f5bd5)', glyph: 'insta', href: 'intent://www.instagram.com/#Intent;scheme=https;package=com.instagram.android;end' },
  'web.youtube': { name: 'YouTube',   bg: grad('#ff4040', '#e00000'), glyph: 'play', href: 'intent://www.youtube.com/#Intent;scheme=https;package=com.google.android.youtube;end' },
  'web.gmail':   { name: 'Mail',      bg: grad('#4fb4ff', '#0a6cff'), glyph: 'mail', href: 'intent://mail.google.com/#Intent;scheme=https;package=com.google.android.gm;end' },
  'web.maps':    { name: 'Mappe',     bg: grad('#7ee08a', '#2fb4ff'), glyph: 'map', href: 'intent://maps.google.com/#Intent;scheme=https;package=com.google.android.apps.maps;end' },
  'web.spotify': { name: 'Spotify',   bg: grad('#2a2a2a', '#000'), glyph: 'music', glyphColor: '#1ed760', href: 'intent://open.spotify.com/#Intent;scheme=https;package=com.spotify.music;end' },
  'web.store':   { name: 'Play Store',bg: grad('#4fb4ff', '#0a6cff'), glyph: 'bag', href: 'intent://play.google.com/store/apps#Intent;scheme=https;package=com.android.vending;end' },
  'web.crm':     { name: 'CRM Leoni', bg: grad('#5a96ff', '#965aff'), glyph: 'film', href: '../' },
};

function iconHTML(app) {
  if (!app) return '';
  let inner = '';
  if (app.img) inner = `<img src="${app.img}" alt="" draggable="false" loading="lazy">`;
  else if (app.special === 'photos') inner = photosIcon();
  else if (app.special === 'calendar') inner = calendarIcon();
  else if (app.glyph) inner = glyph(app.glyph).replace('class="glyph"', `class="glyph"${app.glyphColor ? ` style="stroke:${app.glyphColor}"` : ''}`);
  else inner = `<span class="letter">${(app.name || '?').trim().charAt(0).toUpperCase()}</span>`;
  const bg = app.img ? 'transparent' : (app.bg || grad('#8e8e93', '#48484a'));
  return `<div class="icon${app.img ? ' real' : ''}" style="background:${bg}">${inner}</div>`;
}

/* ===================== Calcolatrice ===================== */
const CalcApp = {
  bg: '#000', fg: '#fff',
  mount(el) {
    let cur = '0', prev = null, op = null, fresh = true;
    el.innerHTML = `<div class="calc">
      <div class="calc-out" id="calc-out">0</div>
      <div class="calc-keys">${[
        ['AC', 'f'], ['±', 'f'], ['%', 'f'], ['÷', 'o'],
        ['7'], ['8'], ['9'], ['×', 'o'],
        ['4'], ['5'], ['6'], ['−', 'o'],
        ['1'], ['2'], ['3'], ['+', 'o'],
        ['0', 'z'], [','], ['=', 'o'],
      ].map(([k, c]) => `<button class="ck ${c || ''}" data-k="${k}">${k}</button>`).join('')}</div></div>`;
    const out = el.querySelector('#calc-out');
    const fmt = (s) => {
      const n = parseFloat(s.replace(',', '.'));
      if (s.endsWith(',') || /,\d*0$/.test(s)) return s;
      if (!isFinite(n)) return 'Errore';
      return n.toLocaleString('it-IT', { maximumFractionDigits: 8 });
    };
    const show = () => {
      out.textContent = fmt(cur);
      out.style.fontSize = out.textContent.length > 9 ? (out.textContent.length > 12 ? '44px' : '58px') : '84px';
      el.querySelector('[data-k="AC"]').textContent = cur !== '0' ? 'C' : 'AC';
      el.querySelectorAll('.ck.o').forEach(b => b.classList.toggle('sel', b.dataset.k === op && fresh));
    };
    const num = () => parseFloat(cur.replace(',', '.'));
    const calc = () => {
      if (op == null || prev == null) return;
      const b = num(); let r;
      if (op === '+') r = prev + b; if (op === '−') r = prev - b;
      if (op === '×') r = prev * b; if (op === '÷') r = prev / b;
      cur = String(+r.toPrecision(12)).replace('.', ',');
    };
    el.querySelector('.calc-keys').addEventListener('click', (e) => {
      const k = e.target.dataset.k; if (!k) return;
      navigator.vibrate && navigator.vibrate(4);
      if (/\d/.test(k)) { cur = fresh || cur === '0' ? k : (cur.replace(/\D/g, '').length < 9 ? cur + k : cur); fresh = false; }
      else if (k === ',') { if (fresh) { cur = '0,'; fresh = false; } else if (!cur.includes(',')) cur += ','; }
      else if (k === 'AC' || k === 'C') { if (cur !== '0') cur = '0'; else { prev = null; op = null; } fresh = true; }
      else if (k === '±') cur = cur.startsWith('-') ? cur.slice(1) : (cur === '0' ? cur : '-' + cur);
      else if (k === '%') cur = String(num() / 100).replace('.', ',');
      else if (k === '=') { calc(); prev = null; op = null; fresh = true; }
      else { if (!fresh) calc(); prev = num(); op = k; fresh = true; }
      show();
    });
    show();
  },
};

/* ===================== Note ===================== */
const NotesApp = {
  bg: 'var(--notes-bg)', fg: 'var(--text)',
  mount(el) {
    const load = () => { try { return JSON.parse(localStorage.getItem('glass.notes') || '[]'); } catch { return []; } };
    const save = (n) => { try { localStorage.setItem('glass.notes', JSON.stringify(n)); } catch {} };
    let notes = load();
    const list = () => {
      el.innerHTML = `<div class="a-title" style="display:flex;justify-content:space-between;align-items:center">Note
        <button class="a-btn" id="n-new" style="color:#e6b800;font-size:30px">${svg('notes', 'n-ico')}</button></div>
        ${notes.length ? `<div class="a-group">${notes.map((n, i) => `<div class="a-row" data-i="${i}"><div class="grow">
          <div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(n.t.split('\n')[0] || 'Nuova nota')}</div>
          <div class="sub" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${new Date(n.d).toLocaleDateString('it-IT')} &nbsp;${esc(n.t.split('\n')[1] || '')}</div></div></div>`).join('')}</div>`
          : '<div style="text-align:center;color:var(--text-2);margin-top:30vh">Nessuna nota</div>'}`;
      el.querySelector('#n-new').onclick = () => { notes.unshift({ t: '', d: Date.now() }); save(notes); edit(0); };
      el.querySelectorAll('[data-i]').forEach(r => r.onclick = () => edit(+r.dataset.i));
    };
    const edit = (i) => {
      el.innerHTML = `<div style="display:flex;justify-content:space-between;padding:4px 16px 8px">
        <button class="a-btn" id="n-back" style="color:#e6b800">‹ Note</button>
        <button class="a-btn danger" id="n-del">Elimina</button></div>
        <textarea id="n-txt" placeholder="Scrivi qui…" style="width:100%;height:calc(100% - 60px);background:none;border:0;outline:0;padding:0 18px 80px;font-size:17px;line-height:1.4;resize:none">${esc(notes[i].t)}</textarea>`;
      const ta = el.querySelector('#n-txt');
      ta.oninput = () => { notes[i].t = ta.value; notes[i].d = Date.now(); save(notes); };
      el.querySelector('#n-back').onclick = () => { notes = notes.filter(n => n.t.trim()); save(notes); list(); };
      el.querySelector('#n-del').onclick = () => { notes.splice(i, 1); save(notes); list(); };
      if (!notes[i].t) setTimeout(() => ta.focus(), 400);
    };
    list();
  },
};

/* ===================== Meteo ===================== */
const WMO = {
  0: ['Sereno', '☀️'], 1: ['Prevalentemente sereno', '🌤️'], 2: ['Parzialmente nuvoloso', '⛅'], 3: ['Nuvoloso', '☁️'],
  45: ['Nebbia', '🌫️'], 48: ['Nebbia', '🌫️'], 51: ['Pioviggine', '🌦️'], 53: ['Pioviggine', '🌦️'], 55: ['Pioviggine', '🌦️'],
  61: ['Pioggia debole', '🌧️'], 63: ['Pioggia', '🌧️'], 65: ['Pioggia forte', '🌧️'], 71: ['Neve debole', '🌨️'], 73: ['Neve', '🌨️'],
  75: ['Neve forte', '❄️'], 80: ['Rovesci', '🌦️'], 81: ['Rovesci', '🌧️'], 82: ['Rovesci forti', '⛈️'], 95: ['Temporale', '⛈️'], 96: ['Temporale', '⛈️'], 99: ['Temporale', '⛈️'],
};
const wmo = (c) => WMO[c] || ['—', '🌡️'];

const Weather = {
  data: null, place: null,
  async get(force) {
    const cached = (() => { try { return JSON.parse(localStorage.getItem('glass.weather') || 'null'); } catch { return null; } })();
    if (!force && cached && Date.now() - cached.at < 30 * 60e3) { this.data = cached.data; this.place = cached.place; return this; }
    let lat = 45.1333, lon = 10.0227, place = 'Cremona';
    try {
      const pos = await new Promise((ok, ko) => navigator.geolocation.getCurrentPosition(ok, ko, { timeout: 6000, maximumAge: 3600e3 }));
      lat = pos.coords.latitude; lon = pos.coords.longitude; place = 'La tua posizione';
      try {
        const g = await (await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&zoom=10&lat=${lat}&lon=${lon}&accept-language=it`)).json();
        place = g.address.city || g.address.town || g.address.village || place;
      } catch {}
    } catch {}
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,apparent_temperature,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
    this.data = await (await fetch(url)).json(); this.place = place;
    try { localStorage.setItem('glass.weather', JSON.stringify({ at: Date.now(), data: this.data, place })); } catch {}
    return this;
  },
};

const WeatherApp = {
  bg: 'linear-gradient(180deg,#3b8de0,#6fb6f2 55%,#a9d4f5)', fg: '#fff',
  async mount(el) {
    el.innerHTML = '<div style="text-align:center;margin-top:40vh;opacity:.8">Caricamento meteo…</div>';
    try { await Weather.get(); } catch { el.innerHTML = '<div style="text-align:center;margin-top:40vh">Meteo non disponibile offline</div>'; return; }
    const d = Weather.data, c = d.current, [cond, ico] = wmo(c.weather_code);
    const nowH = new Date().getHours();
    const start = d.hourly.time.findIndex(t => new Date(t).getHours() === nowH && new Date(t).toDateString() === new Date().toDateString());
    const hours = d.hourly.time.slice(Math.max(start, 0), Math.max(start, 0) + 24);
    el.innerHTML = `<div class="wx">
      <div class="wx-head"><div class="wx-place">${esc(Weather.place)}</div><div class="wx-temp">${Math.round(c.temperature_2m)}°</div>
      <div class="wx-cond">${cond}</div><div>Max ${Math.round(d.daily.temperature_2m_max[0])}°  Min ${Math.round(d.daily.temperature_2m_min[0])}°</div></div>
      <div class="wx-card glass"><div class="wx-cap">PREVISIONI ORARIE</div><div class="wx-hours">${hours.map((t, i) => {
        const k = Math.max(start, 0) + i;
        return `<div><small>${i ? new Date(t).getHours() : 'Ora'}</small><span>${wmo(d.hourly.weather_code[k])[1]}</span><b>${Math.round(d.hourly.temperature_2m[k])}°</b></div>`; }).join('')}</div></div>
      <div class="wx-card glass"><div class="wx-cap">PREVISIONI A 7 GIORNI</div>${d.daily.time.map((t, i) =>
        `<div class="wx-day"><span>${i ? new Date(t).toLocaleDateString('it-IT', { weekday: 'short' }) : 'Oggi'}</span><span>${wmo(d.daily.weather_code[i])[1]}</span>
        <span class="mn">${Math.round(d.daily.temperature_2m_min[i])}°</span><i></i><span>${Math.round(d.daily.temperature_2m_max[i])}°</span></div>`).join('')}</div>
      <div class="wx-grid"><div class="wx-card glass"><div class="wx-cap">PERCEPITA</div><b>${Math.round(c.apparent_temperature)}°</b></div>
      <div class="wx-card glass"><div class="wx-cap">UMIDITÀ</div><b>${c.relative_humidity_2m}%</b></div>
      <div class="wx-card glass"><div class="wx-cap">VENTO</div><b>${Math.round(c.wind_speed_10m)} km/h</b></div>
      <div class="wx-card glass"><div class="wx-cap">ADESSO</div><b>${ico}</b></div></div></div>`;
  },
};

/* ===================== Orologio (cronometro + timer) ===================== */
const ClockApp = {
  bg: '#000', fg: '#fff',
  mount(el) {
    const S = OS.clock;
    el.innerHTML = `<div class="a-title">Orologio</div>
      <div class="seg" style="margin:0 16px 30px" id="clk-seg"><button data-t="sw" class="on">Cronometro</button><button data-t="tm">Timer</button></div>
      <div id="clk-view"></div>`;
    const view = el.querySelector('#clk-view');
    let tab = 'sw', raf;
    const fmtMs = (ms) => { const m = Math.floor(ms / 60000), s = Math.floor(ms / 1000) % 60, c = Math.floor(ms / 10) % 100; return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(c).padStart(2, '0')}`; };
    const fmtS = (s) => { const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, x = Math.floor(s % 60); return (h ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(x).padStart(2, '0'); };
    const render = () => {
      cancelAnimationFrame(raf);
      if (tab === 'sw') {
        view.innerHTML = `<div class="clk-big" id="clk-t">00:00,00</div>
          <div class="clk-btns"><button class="clk-b gray" id="clk-l"></button><button class="clk-b" id="clk-s"></button></div>
          <div class="a-group" id="clk-laps" style="background:none"></div>`;
        const t = view.querySelector('#clk-t'), bl = view.querySelector('#clk-l'), bs = view.querySelector('#clk-s');
        const elapsed = () => S.sw.acc + (S.sw.run ? Date.now() - S.sw.start : 0);
        const upd = () => {
          bs.textContent = S.sw.run ? 'Stop' : 'Avvia'; bs.className = 'clk-b ' + (S.sw.run ? 'red' : 'green');
          bl.textContent = S.sw.run || !elapsed() ? 'Giro' : 'Azzera';
          view.querySelector('#clk-laps').innerHTML = S.sw.laps.map((l, i) => `<div class="a-row"><span class="grow">Giro ${S.sw.laps.length - i}</span><span style="font-variant-numeric:tabular-nums">${fmtMs(l)}</span></div>`).join('');
        };
        const loop = () => { t.textContent = fmtMs(elapsed()); raf = requestAnimationFrame(loop); };
        bs.onclick = () => { if (S.sw.run) { S.sw.acc += Date.now() - S.sw.start; S.sw.run = false; } else { S.sw.start = Date.now(); S.sw.run = true; } upd(); };
        bl.onclick = () => { if (S.sw.run) S.sw.laps.unshift(elapsed()); else { S.sw.acc = 0; S.sw.laps = []; } upd(); };
        upd(); loop();
      } else {
        const running = S.tm.end > Date.now();
        view.innerHTML = running
          ? `<div class="clk-big" id="clk-t"></div><div class="clk-btns"><button class="clk-b gray" id="clk-x">Annulla</button></div>`
          : `<div class="clk-pick">${[['h', 23, 'ore'], ['m', 59, 'min'], ['s', 59, 's']].map(([k, max, l]) =>
              `<label><input type="number" min="0" max="${max}" value="${k === 'm' ? 5 : 0}" id="tm-${k}"><span>${l}</span></label>`).join('')}</div>
             <div class="clk-btns"><span></span><button class="clk-b green" id="clk-go">Avvia</button></div>`;
        if (running) {
          const t = view.querySelector('#clk-t');
          const loop = () => { const left = (S.tm.end - Date.now()) / 1000; if (left <= 0) return render(); t.textContent = fmtS(Math.ceil(left)); raf = requestAnimationFrame(loop); };
          view.querySelector('#clk-x').onclick = () => { OS.stopTimer(); render(); };
          loop();
        } else {
          view.querySelector('#clk-go').onclick = () => {
            const v = (k) => Math.max(0, +view.querySelector('#tm-' + k).value || 0);
            const sec = v('h') * 3600 + v('m') * 60 + v('s'); if (sec > 0) { OS.startTimer(sec); render(); }
          };
        }
      }
    };
    el.querySelector('#clk-seg').onclick = (e) => {
      if (!e.target.dataset.t) return; tab = e.target.dataset.t;
      el.querySelectorAll('#clk-seg button').forEach(b => b.classList.toggle('on', b === e.target)); render();
    };
    render();
    return () => cancelAnimationFrame(raf);
  },
};

/* ===================== Personalizza (impostazioni del tema) ===================== */
const SettingsApp = {
  bg: 'var(--settings-bg)', fg: 'var(--text)',
  mount(el) {
    const s = OS.settings;
    const sw = (k) => `<button class="switch ${s[k] ? 'on' : ''}" data-sw="${k}"></button>`;
    const seg = (k, opts) => `<div class="seg" data-seg="${k}">${opts.map(([v, l]) => `<button data-v="${v}" class="${s[k] === v ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    const native = OS.native;
    el.innerHTML = `<div class="a-title">Personalizza</div>
      <div class="a-group-title">Sfondo</div>
      <div class="a-group"><div class="wall-grid">${OS.wallpapers.map((w, i) =>
        `<button data-wall="${i}" class="${s.wall === i ? 'on' : ''}" style="background-image:${w.css}"></button>`).join('')}
        ${s.customWall ? `<button data-wall="custom" class="${s.wall === 'custom' ? 'on' : ''}" style="background-image:url(${s.customWall})"></button>` : ''}
        <button class="add" id="wall-add">+</button></div></div>
      <div class="a-group-title">Aspetto</div>
      <div class="a-group">
        <div class="a-row">${seg('theme', [['auto', 'Auto'], ['dark', 'Scuro'], ['light', 'Chiaro']])}</div>
        <div class="a-row"><span class="grow">Vetro</span></div>
        <div class="a-row" style="padding-top:0">${seg('glass', [['clear', 'Trasparente'], ['tinted', 'Colorato']])}</div>
        <div class="a-row"><span class="grow">Icone</span></div>
        <div class="a-row" style="padding-top:0">${seg('icons', [['color', 'Colorate'], ['clear', 'Vetro']])}</div>
        <div class="a-row"><span>Sfocatura</span><input type="range" min="4" max="30" value="${s.blur}" id="set-blur"></div>
        <div class="a-row"><span class="grow">Rifrazione liquida</span>${sw('refract')}</div>
        <div class="a-row"><span class="grow">Dynamic Island</span>${sw('island')}</div>
      </div>
      <p class="a-note">La rifrazione deforma lo sfondo ai bordi del vetro come una lente. Se il telefono rallenta, disattivala.</p>
      <div class="a-group-title">Home</div>
      <div class="a-group">
        <div class="a-row"><span class="grow">Widget meteo e calendario</span>${sw('widgets')}</div>
        <div class="a-row"><span class="grow">Etichette sotto le icone</span>${sw('labels')}</div>
        ${native ? `<div class="a-row"><span class="grow">Barra di stato stile iPhone</span>${sw('fakeStatus')}</div>` : ''}
        <div class="a-row"><button class="a-btn" id="set-edit">Modifica la Home…</button></div>
        <div class="a-row"><button class="a-btn" id="set-reset-layout">Riordina le app automaticamente</button></div>
      </div>
      ${native ? `<div class="a-group-title">Telefono</div><div class="a-group">
        <div class="a-row"><button class="a-btn" id="set-home">Scegli launcher predefinito…</button></div>
        <div class="a-row"><button class="a-btn" id="set-android">Impostazioni di Android</button></div></div>
        <p class="a-note">Per usare GlassOS come tema del telefono, sceglilo come app Home predefinita.</p>` : `
      <div class="a-group-title">Schermata di blocco</div>
      <div class="a-group"><div class="a-row"><span class="grow">Codice (4 cifre)</span><input type="password" inputmode="numeric" maxlength="4" placeholder="nessuno" value="${s.pin || ''}" id="set-pin"></div></div>`}
      <div class="a-group" style="margin-top:8px"><div class="a-row"><span class="grow">Versione</span><span class="sub">GlassOS ${OS.version}${native ? ' · launcher' : ' · web'}</span></div></div>
      <div style="height:60px"></div>`;

    el.querySelectorAll('[data-sw]').forEach(b => b.onclick = () => { const k = b.dataset.sw; OS.set(k, !s[k]); b.classList.toggle('on', s[k]); });
    el.querySelectorAll('[data-seg]').forEach(g => g.onclick = (e) => {
      const v = e.target.dataset.v; if (!v) return; OS.set(g.dataset.seg, v);
      g.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === e.target));
    });
    el.querySelectorAll('[data-wall]').forEach(b => b.onclick = () => {
      const v = b.dataset.wall; OS.set('wall', v === 'custom' ? 'custom' : +v);
      el.querySelectorAll('[data-wall]').forEach(x => x.classList.toggle('on', x === b));
    });
    el.querySelector('#wall-add').onclick = () => OS.pickWallpaper(() => SettingsApp.mount(el));
    el.querySelector('#set-blur').oninput = (e) => OS.set('blur', +e.target.value);
    el.querySelector('#set-edit').onclick = () => { OS.closeApp(); setTimeout(() => OS.startJiggle(), 450); };
    el.querySelector('#set-reset-layout').onclick = () => { OS.resetLayout(); OS.toast('Home riordinata'); };
    const pin = el.querySelector('#set-pin');
    if (pin) pin.onchange = () => { const v = pin.value.replace(/\D/g, ''); OS.set('pin', v.length === 4 ? v : ''); OS.toast(v.length === 4 ? 'Codice impostato' : 'Codice rimosso'); };
    if (native) {
      el.querySelector('#set-home').onclick = () => native.openHomeSettings();
      el.querySelector('#set-android').onclick = () => native.openSettings('');
    }
  },
};

function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
