// GlassOS — nucleo: home, dock, gesti, centro di controllo, Liquid Glass.
// Funziona sia come launcher Android (window.GlassNative presente) sia nel browser.
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const native = window.GlassNative || null;
const nat = (fn, ...a) => { try { return native && native[fn] ? native[fn](...a) : undefined; } catch (e) { console.warn(fn, e); } };

/* ---------------- sfondi (SVG generati, niente immagini esterne) ---------------- */
const svgUrl = (s) => `url('data:image/svg+xml,${encodeURIComponent(s).replace(/'/g, '%27')}')`;
const blobs = (bg, items) => svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice"><defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="38"/></filter></defs><rect width="390" height="844" fill="${bg}"/><g filter="url(#b)">${items}</g></svg>`);
const WALLPAPERS = [
  { name: 'Aurora', css: blobs('#1b0f3a', '<circle cx="80" cy="180" r="170" fill="#ff4fa3"/><circle cx="330" cy="330" r="190" fill="#7b5cff"/><circle cx="120" cy="620" r="210" fill="#18c8ff"/><circle cx="340" cy="780" r="150" fill="#ffb84d"/>') },
  { name: 'Tramonto', css: blobs('#2a0b1f', '<circle cx="320" cy="140" r="180" fill="#ffcc4d"/><circle cx="60" cy="380" r="200" fill="#ff5e62"/><circle cx="300" cy="640" r="220" fill="#b0306a"/><circle cx="60" cy="820" r="160" fill="#5b2a86"/>') },
  { name: 'Oceano', css: blobs('#031a2c', '<circle cx="60" cy="160" r="170" fill="#00d2ff"/><circle cx="340" cy="420" r="210" fill="#0061ff"/><circle cx="90" cy="700" r="200" fill="#00f5a0"/><circle cx="330" cy="830" r="140" fill="#3a7bd5"/>') },
  { name: 'Prato', css: blobs('#0c2312', '<circle cx="300" cy="150" r="170" fill="#d4fc79"/><circle cx="70" cy="420" r="200" fill="#38b26f"/><circle cx="320" cy="700" r="210" fill="#96e6a1"/><circle cx="40" cy="830" r="150" fill="#0f6e5a"/>') },
  { name: 'Notte', css: blobs('#05060f', '<circle cx="90" cy="200" r="150" fill="#283c86"/><circle cx="330" cy="520" r="200" fill="#45108a"/><circle cx="80" cy="780" r="190" fill="#1f1c5c"/>') },
  { name: 'Alba', css: blobs('#fbe9e0', '<circle cx="80" cy="170" r="170" fill="#ffd1dc"/><circle cx="330" cy="380" r="200" fill="#c7b8ff"/><circle cx="100" cy="660" r="210" fill="#a8e6ff"/><circle cx="330" cy="820" r="150" fill="#ffe29a"/>') },
  { name: 'Onde', css: svgUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f2027"/><stop offset="1" stop-color="#2c5364"/></linearGradient></defs><rect width="390" height="844" fill="url(#g)"/>' +
    [['#ff6a88', 420], ['#ff99ac', 520], ['#fcb69f', 620], ['#ffecd2', 720]].map(([c, y], i) => `<path d="M0 ${y} C 120 ${y - 90 - i * 10}, 260 ${y + 90}, 390 ${y - 40} V844 H0Z" fill="${c}" opacity=".85"/>`).join('') + '</svg>') },
  { name: 'Grafite', css: blobs('#111', '<circle cx="90" cy="200" r="160" fill="#555"/><circle cx="320" cy="500" r="190" fill="#333"/><circle cx="80" cy="760" r="180" fill="#666"/>') },
];

/* ---------------- stato ---------------- */
const DEFAULTS = {
  wall: 0, customWall: '', theme: 'dark', glass: 'clear', icons: 'color', blur: 14,
  refract: true, island: true, widgets: true, labels: true, fakeStatus: true, pin: '',
};
const store = {
  get(k, d) { try { const v = localStorage.getItem('glass.' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('glass.' + k, JSON.stringify(v)); return true; } catch { return false; } },
};

const OS = {
  version: '1.0',
  native,
  wallpapers: WALLPAPERS,
  settings: Object.assign({}, DEFAULTS, store.get('settings', {})),
  layout: store.get('layout', null),     // { order: [id…], dock: [id…] }
  apps: {},                              // id -> descrizione app
  clock: { sw: { run: false, start: 0, acc: 0, laps: [] }, tm: { end: 0 } },
  currentApp: null,
};
window.OS = OS;

OS.set = (k, v) => { OS.settings[k] = v; store.set('settings', OS.settings); applySettings(); if (['widgets', 'labels'].includes(k)) renderHome(); };

OS.toast = (msg) => {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2200);
};
const haptic = (ms = 8) => { if (native) nat('vibrate', ms); else if (navigator.vibrate) navigator.vibrate(ms); };

/* ---------------- impostazioni grafiche ---------------- */
function applySettings() {
  const s = OS.settings, b = document.body;
  const dark = s.theme === 'auto' ? matchMedia('(prefers-color-scheme: dark)').matches : s.theme === 'dark';
  b.classList.toggle('light', !dark);
  b.classList.toggle('tinted', s.glass === 'tinted');
  b.classList.toggle('icons-clear', s.icons === 'clear');
  b.classList.toggle('refract', !!s.refract);
  b.classList.toggle('no-island', !s.island);
  b.classList.toggle('no-labels', !s.labels);
  b.classList.toggle('no-status', !!native && !s.fakeStatus);
  document.documentElement.style.setProperty('--blur', s.blur + 'px');
  const w = s.wall === 'custom' && s.customWall ? `url(${s.customWall})` : (WALLPAPERS[s.wall] || WALLPAPERS[0]).css;
  $('#wallpaper').style.backgroundImage = w;
  nat('setStatusBarVisible', !s.fakeStatus);
  refreshLiquid();
}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applySettings);

OS.pickWallpaper = (done) => {
  const inp = document.createElement('input');
  inp.type = 'file'; inp.accept = 'image/*';
  inp.onchange = () => {
    const f = inp.files[0]; if (!f) return;
    const img = new Image();
    img.onload = () => {
      // ridimensiona per stare nello spazio di localStorage
      const max = 1280, k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = img.width * k; c.height = img.height * k;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      let q = .85, url = c.toDataURL('image/jpeg', q);
      while (url.length > 1.8e6 && q > .3) { q -= .15; url = c.toDataURL('image/jpeg', q); }
      OS.settings.customWall = url; OS.settings.wall = 'custom';
      if (!store.set('settings', OS.settings)) OS.toast('Immagine troppo grande');
      applySettings(); done && done();
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(f);
  };
  inp.click();
};

/* ---------------- Liquid Glass: rifrazione con filtro SVG ---------------- */
// Per ogni elemento .liquid genera una mappa di spostamento a forma di
// rettangolo arrotondato: vicino ai bordi lo sfondo viene "piegato" verso
// l'interno come in una lente spessa.
const mapCache = new Map();
function displacementMap(w, h, r) {
  const key = `${w}x${h}x${r}`;
  if (mapCache.has(key)) return mapCache.get(key);
  const sc = .5, W = Math.max(2, Math.round(w * sc)), H = Math.max(2, Math.round(h * sc)), R = r * sc;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d'), img = ctx.createImageData(W, H), d = img.data;
  const band = Math.min(R * 1.1, Math.min(W, H) / 2) || 1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const px = x + .5 - W / 2, py = y + .5 - H / 2;
    const qx = Math.abs(px) - (W / 2 - R), qy = Math.abs(py) - (H / 2 - R);
    const ox = Math.max(qx, 0), oy = Math.max(qy, 0);
    const dist = Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - R; // <0 dentro
    let nx = 0, ny = 0;
    if (qx > 0 && qy > 0) { const l = Math.hypot(qx, qy) || 1; nx = qx / l * Math.sign(px); ny = qy / l * Math.sign(py); }
    else if (qx > qy) nx = Math.sign(px); else ny = Math.sign(py);
    const t = Math.min(1, Math.max(0, -dist / band));
    const k = Math.pow(1 - t, 2.2);              // forte sul bordo, nullo al centro
    const i = (y * W + x) * 4;
    d[i] = 128 - nx * k * 127; d[i + 1] = 128 - ny * k * 127; d[i + 2] = 128; d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const url = c.toDataURL();
  mapCache.set(key, url);
  return url;
}
let lgSeq = 0;
function liquify(el) {
  if (!OS.settings.refract) { el.style.removeProperty('--lg'); return; }
  const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
  if (!w || !h) return;
  const r = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, w / 2, h / 2);
  if (!el._lgId) el._lgId = 'lg' + (++lgSeq);
  const id = el._lgId, scale = Math.min(26, Math.max(10, Math.min(w, h) * .22));
  let f = document.getElementById(id);
  if (!f) { f = document.createElementNS('http://www.w3.org/2000/svg', 'filter'); f.id = id; $('#lg-defs defs').appendChild(f); }
  f.setAttribute('x', 0); f.setAttribute('y', 0); f.setAttribute('width', w); f.setAttribute('height', h);
  f.setAttribute('filterUnits', 'userSpaceOnUse'); f.setAttribute('color-interpolation-filters', 'sRGB');
  f.innerHTML = `<feImage href="${displacementMap(w, h, r)}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="m"/>
    <feDisplacementMap in="SourceGraphic" in2="m" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/>`;
  el.style.setProperty('--lg', `url(#${id})`);
}
const liquidRO = new ResizeObserver(es => es.forEach(e => liquify(e.target)));
function refreshLiquid() {
  $$('.liquid').forEach(el => { if (!el._lgObs) { el._lgObs = true; liquidRO.observe(el); } liquify(el); });
}

/* ---------------- registro app ---------------- */
const WEB_ROLES = { 'web.phone': 'phone', 'web.sms': 'messages', 'web.browser': 'safari', 'web.camera': 'camera', 'web.photos': 'photos',
  'web.calendar': 'calendar', 'web.gmail': 'mail', 'web.maps': 'maps', 'web.store': 'appstore', 'web.spotify': null, 'web.crm': null };
const BUILTIN_ROLES = { 'glass.calc': 'calculator', 'glass.notes': 'notes', 'glass.weather': 'weather', 'glass.clock': 'clock', 'glass.settings': 'personalize' };

function buildRegistry() {
  OS.apps = {};
  for (const [id, a] of Object.entries(BUILTIN)) OS.apps[id] = Object.assign({ id, kind: 'builtin', role: BUILTIN_ROLES[id] }, a);
  if (native) {
    let list = [];
    try { list = JSON.parse(nat('getApps') || '[]'); } catch {}
    let defaults = {};
    try { defaults = JSON.parse(nat('getDefaults') || '{}'); } catch {}
    OS.defaults = defaults;
    const pkgRole = {};
    for (const [role, pkg] of Object.entries(defaults)) pkgRole[pkg] = role;
    const taken = {};
    // prima le app predefinite di Android, poi le altre: un solo "Foto", un solo "Telefono"...
    list.sort((a, b) => (pkgRole[b.pkg] ? 1 : 0) - (pkgRole[a.pkg] ? 1 : 0));
    for (const a of list) {
      let role = pkgRole[a.pkg] || iosRole(a.pkg, a.label);
      if (role && taken[role]) role = null;
      if (role) taken[role] = a.id;
      OS.apps[a.id] = {
        id: a.id, pkg: a.pkg, kind: 'native', role,
        name: role ? IOS_NAMES[role] : a.label, realName: a.label,
        img: 'https://appassets.androidplatform.net/icon/' + encodeURIComponent(a.id) + '.png',
      };
    }
    // app integrate doppione di un'app Android gia' presente (es. Orologio): solo nella versione web
    for (const [id, a] of Object.entries(OS.apps)) if (a.kind === 'builtin' && a.role && taken[a.role]) delete OS.apps[id];
  } else {
    for (const [id, a] of Object.entries(WEB_APPS)) OS.apps[id] = Object.assign({ id, kind: 'web', role: WEB_ROLES[id] || null }, a);
  }
}
const appById = (id) => OS.apps[id];

function appIcon(app) {
  if (app.role && ART[app.role]) return `<div class="icon art-icon">${ART[app.role]()}</div>`;
  return iconHTML(app);
}

/* ---------------- disposizione predefinita ---------------- */
const HOME_ROLES = ['photos', 'calendar', 'clock', 'weather', 'mail', 'notes', 'reminders', 'maps', 'appstore', 'music',
  'settings', 'contacts', 'calculator', 'files', 'personalize', 'wallet', 'health', 'voice', 'facetime'];
const DOCK_ROLES = ['phone', 'messages', 'safari', 'camera'];

function defaultLayout() {
  const all = Object.values(OS.apps);
  const used = new Set();
  const byRole = (role) => {
    // preferisci l'app Android, altrimenti quella integrata in GlassOS
    const a = all.find(a => a.kind !== 'builtin' && a.role === role && !used.has(a.id)) || all.find(a => a.role === role && !used.has(a.id));
    if (a) used.add(a.id);
    return a && a.id;
  };
  const dock = DOCK_ROLES.map(byRole).filter(Boolean);
  const order = HOME_ROLES.map(byRole).filter(Boolean);
  // le app integrate restano nella libreria se c'e' gia' l'equivalente Android
  const rest = all.filter(a => !used.has(a.id) && a.kind !== 'builtin').sort((a, b) => a.name.localeCompare(b.name, 'it'));
  for (const a of rest) order.push(a.id);
  if (!native) for (const id of ['glass.calc', 'glass.clock', 'glass.notes']) if (!order.includes(id) && !dock.includes(id)) order.push(id);
  return { order, dock };
}
OS.resetLayout = () => { OS.layout = defaultLayout(); saveLayout(); renderHome(); };
const saveLayout = () => store.set('layout', OS.layout);

function syncLayout() {
  if (!OS.layout || !Array.isArray(OS.layout.order)) { OS.layout = defaultLayout(); saveLayout(); return; }
  const known = new Set([...OS.layout.order, ...OS.layout.dock, ...(OS.layout.removed || [])]);
  OS.layout.order = OS.layout.order.filter(appById);
  OS.layout.dock = OS.layout.dock.filter(appById);
  // app installate di recente: in fondo alla Home, come su iPhone
  for (const a of Object.values(OS.apps)) if (!known.has(a.id) && a.kind !== 'builtin') OS.layout.order.push(a.id);
  saveLayout();
}

/* ---------------- rendering home ---------------- */
function pageCapacity() {
  const pages = $('#pages');
  const h = pages.clientHeight || (innerHeight - 260);
  const rows = Math.max(3, Math.floor((h - 10) / 102));
  return { rows, perPage: rows * 4 };
}

function appTile(id, where) {
  const a = appById(id); if (!a) return '';
  return `<div class="app" data-id="${esc(id)}" data-where="${where}">${appIcon(a)}<span class="label">${esc(a.name)}</span><button class="del-badge" data-del="${esc(id)}">−</button></div>`;
}

function widgetsHTML() {
  const d = new Date();
  const first = new Date(d.getFullYear(), d.getMonth(), 1), days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7;
  let cells = '';
  for (let i = 0; i < lead; i++) cells += '<span></span>';
  for (let i = 1; i <= days; i++) cells += `<span class="${i === d.getDate() ? 'today' : ''}">${i}</span>`;
  return `<div class="widget w-weather glass liquid" data-open="glass.weather" style="position:relative">
      <div class="city" id="ww-city">Meteo</div><div class="temp" id="ww-temp">–</div>
      <div class="cond"><span class="wico" id="ww-ico"></span> <span id="ww-cond"></span></div><div class="hl" id="ww-hl"></div></div>
    <div class="widget w-cal glass liquid" data-open="calendar" style="position:relative">
      <div class="wd">${d.toLocaleDateString('it-IT', { month: 'long' })}</div>
      <div class="mini-month">${['L', 'M', 'M', 'G', 'V', 'S', 'D'].map(x => `<b>${x}</b>`).join('')}${cells}</div></div>`;
}

function renderHome() {
  if (!OS.layout) return;
  const { rows, perPage } = pageCapacity();
  const showW = OS.settings.widgets;
  const first = showW ? perPage - 8 : perPage;
  const order = OS.layout.order;
  const chunks = [order.slice(0, first)];
  for (let i = first; i < order.length; i += perPage) chunks.push(order.slice(i, i + perPage));
  if (document.body.classList.contains('jiggle')) chunks.push([]); // pagina vuota per spostare le app
  const pages = $('#pages');
  const scroll = pages.scrollLeft;
  pages.innerHTML = chunks.map((c, i) => `<div class="page" style="grid-template-rows:repeat(${rows},98px)" data-page="${i}">${i === 0 && showW ? widgetsHTML() : ''}${c.map(id => appTile(id, 'home')).join('')}</div>`).join('') +
    `<div class="page library" data-page="lib"><div class="lib-search glass"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input id="lib-q" placeholder="Libreria app" type="search"></div><div class="lib-grid" id="lib-grid"></div></div>`;
  pages.scrollLeft = scroll;
  $('#dock').innerHTML = OS.layout.dock.map(id => appTile(id, 'dock')).join('');
  renderLibrary('');
  $('#lib-q').oninput = (e) => renderLibrary(e.target.value);
  renderDots();
  refreshLiquid();
  updateWidgets();
}

function renderLibrary(q) {
  q = q.trim().toLowerCase();
  const list = Object.values(OS.apps)
    .filter(a => !q || a.name.toLowerCase().includes(q) || (a.realName || '').toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name, 'it'));
  $('#lib-grid').innerHTML = list.map(a => appTile(a.id, 'lib')).join('');
}

function renderDots() {
  const n = $$('#pages .page').length;
  const i = Math.round($('#pages').scrollLeft / ($('#pages').clientWidth || 1));
  $('#page-dots').innerHTML = Array.from({ length: n }, (_, k) =>
    k === n - 1 ? `<i class="lib-dot ${k === i ? 'on' : ''}"></i>` : `<i class="${k === i ? 'on' : ''}"></i>`).join('');
}

async function updateWidgets() {
  if (!OS.settings.widgets || !$('#ww-temp')) return;
  try {
    await Weather.get();
    const d = Weather.data, c = d.current, [cond, ico] = wmo(c.weather_code);
    $('#ww-city').textContent = Weather.place + ' ➤';
    $('#ww-temp').textContent = Math.round(c.temperature_2m) + '°';
    $('#ww-ico').textContent = ico; $('#ww-cond').textContent = cond;
    $('#ww-hl').textContent = `Max ${Math.round(d.daily.temperature_2m_max[0])}° Min ${Math.round(d.daily.temperature_2m_min[0])}°`;
  } catch { $('#ww-cond').textContent = 'Non disponibile'; }
}

/* ---------------- apertura app ---------------- */
function launch(id, fromEl) {
  const a = appById(id); if (!a) return;
  haptic(6);
  if (a.kind === 'builtin') return openApp(a, fromEl);
  if (a.kind === 'native') { zoomOut(fromEl); setTimeout(() => nat('launch', a.id), 120); return; }
  if (a.href) { zoomOut(fromEl); setTimeout(() => { location.href = a.href; }, 150); }
}

function iconRect(fromEl) {
  const ic = fromEl && fromEl.querySelector('.icon');
  return ic ? ic.getBoundingClientRect() : { left: innerWidth / 2 - 30, top: innerHeight / 2 - 30, width: 60, height: 60 };
}
// effetto "zoom" breve prima di passare a un'app Android
function zoomOut(fromEl) {
  const r = iconRect(fromEl), z = document.createElement('div');
  z.className = 'zoomer'; z.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`;
  z.innerHTML = fromEl ? fromEl.querySelector('.icon').outerHTML : '';
  $('#device').appendChild(z);
  z.animate([{ transform: 'none', borderRadius: '27%' }, {
    transform: `translate(${innerWidth / 2 - r.left - r.width / 2}px, ${innerHeight / 2 - r.top - r.height / 2}px) scale(${Math.max(innerWidth / r.width, innerHeight / r.height)})`, borderRadius: '40px',
  }], { duration: 380, easing: 'cubic-bezier(.2,.9,.25,1)', fill: 'forwards' });
  setTimeout(() => z.remove(), 1200);
}

let appCleanup = null, appFrom = null;
function openApp(a, fromEl) {
  closeOverlays();
  const def = a.open(), win = $('#appwin'), body = $('#app-body');
  win.style.setProperty('--app-bg', def.bg || '#000');
  win.style.setProperty('--app-fg', def.fg || '#fff');
  body.innerHTML = ''; body.scrollTop = 0;
  win.hidden = false;
  document.body.classList.add('app-open');
  OS.currentApp = a.id; appFrom = fromEl ? fromEl.dataset.id : null;
  appCleanup = def.mount(body) || null;
  const r = iconRect(fromEl);
  const sx = r.width / innerWidth, sy = r.height / innerHeight;
  win.animate([
    { transform: `translate(${r.left}px, ${r.top}px) scale(${sx}, ${sy})`, borderRadius: `${60 / sx}px / ${60 / sy}px`, opacity: .4, transformOrigin: '0 0' },
    { transform: 'none', borderRadius: '44px', opacity: 1, transformOrigin: '0 0', offset: .85 },
    { transform: 'none', borderRadius: '0px', opacity: 1, transformOrigin: '0 0' },
  ], { duration: 480, easing: 'cubic-bezier(.2,.95,.3,1)' });
  history.pushState({ app: a.id }, '');
  setStatusDark(a.id);
}

OS.closeApp = function closeApp(progress) {
  const win = $('#appwin'); if (win.hidden) return;
  const el = appFrom && $(`#home .app[data-id="${CSS.escape(appFrom)}"]`);
  const r = el ? iconRect(el) : { left: innerWidth / 2 - 30, top: innerHeight - 140, width: 60, height: 60 };
  const sx = r.width / innerWidth, sy = r.height / innerHeight;
  const from = win.style.transform || 'none';
  win.style.transform = '';
  document.body.classList.remove('app-open');
  const anim = win.animate([
    { transform: from, borderRadius: '44px', opacity: 1, transformOrigin: '0 0' },
    { transform: `translate(${r.left}px, ${r.top}px) scale(${sx}, ${sy})`, borderRadius: `${14 / sx}px / ${14 / sy}px`, opacity: 0, transformOrigin: '0 0' },
  ], { duration: 420, easing: 'cubic-bezier(.3,.9,.3,1)' });
  anim.onfinish = () => {
    win.hidden = true; $('#app-body').innerHTML = '';
    if (typeof appCleanup === 'function') appCleanup(); appCleanup = null;
  };
  OS.currentApp = null;
  setStatusDark(null);
};
function setStatusDark(id) {
  const light = document.body.classList.contains('light');
  document.body.classList.toggle('dark-status', !!id && light && ['glass.notes', 'glass.settings'].includes(id));
}

/* ---------------- menu contestuale (pressione lunga) ---------------- */
function showMenu(id, el) {
  closeMenu();
  const a = appById(id), where = el.dataset.where, r = el.querySelector('.icon').getBoundingClientRect();
  const items = [];
  if (where !== 'lib') items.push(['Modifica Home', 'grid', () => OS.startJiggle()]);
  if (where === 'lib' && !OS.layout.order.includes(id) && !OS.layout.dock.includes(id)) items.push(['Aggiungi alla Home', 'sparkle', () => { OS.layout.order.push(id); saveLayout(); renderHome(); OS.toast('Aggiunta alla Home'); }]);
  if (where !== 'lib') items.push(['Rimuovi dalla Home', 'info', () => removeFromHome(id)]);
  if (a.kind === 'native') {
    items.push(['Info app', 'info', () => nat('appInfo', a.pkg)]);
    items.push(['Disinstalla', 'info', () => nat('uninstall', a.pkg), 'danger']);
  }
  const m = document.createElement('div');
  m.id = 'ctx'; m.innerHTML = `<div class="ctx-icon" style="left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px">${appIcon(a)}</div>
    <div class="ctx-menu glass" style="${r.top > innerHeight / 2 ? `bottom:${innerHeight - r.top + 12}px` : `top:${r.bottom + 12}px`};${r.left > innerWidth / 2 ? `right:${innerWidth - r.right}px` : `left:${r.left}px`}">
    ${items.map(([t, , , cls], i) => `<button data-i="${i}" class="${cls || ''}">${t}</button>`).join('')}</div>`;
  $('#device').appendChild(m);
  document.body.classList.add('overlay');
  m.addEventListener('click', (e) => {
    const b = e.target.closest('button'); closeMenu();
    if (b) items[+b.dataset.i][2]();
  });
  haptic(15);
}
function closeMenu() { const m = $('#ctx'); if (m) { m.remove(); document.body.classList.remove('overlay'); return true; } return false; }

function removeFromHome(id) {
  OS.layout.order = OS.layout.order.filter(x => x !== id);
  OS.layout.dock = OS.layout.dock.filter(x => x !== id);
  OS.layout.removed = [...new Set([...(OS.layout.removed || []), id])];
  saveLayout(); renderHome();
}

OS.startJiggle = () => { document.body.classList.add('jiggle'); $('#jiggle-done').hidden = false; renderHome(); haptic(20); };
function stopJiggle() { if (!document.body.classList.contains('jiggle')) return false; document.body.classList.remove('jiggle'); $('#jiggle-done').hidden = true; renderHome(); return true; }

/* ---------------- interazioni home: tap, pressione lunga, trascinamento ---------------- */
let press = null;
$('#home').addEventListener('pointerdown', (e) => {
  if (e.target.closest('#lib-q, #jiggle-done, #search-pill')) return;
  const tile = e.target.closest('.app');
  press = { x: e.clientX, y: e.clientY, t: Date.now(), tile, moved: false, long: false, id: e.pointerId };
  if (e.target.closest('.del-badge')) { press.del = true; return; }
  if (tile) {
    press.timer = setTimeout(() => {
      if (!press || press.moved) return;
      press.long = true;
      if (document.body.classList.contains('jiggle')) return;
      showMenu(tile.dataset.id, tile);
    }, 480);
  }
});
$('#home').addEventListener('pointermove', (e) => {
  if (!press) return;
  const dx = e.clientX - press.x, dy = e.clientY - press.y;
  if (!press.moved && Math.hypot(dx, dy) > 9) {
    press.moved = true; clearTimeout(press.timer);
    // in modalita' modifica, trascina l'icona
    if (press.tile && document.body.classList.contains('jiggle') && press.tile.dataset.where !== 'lib') startDrag(press, e);
    // scorrimento verso il basso al centro della home = Ricerca (come iPhone)
    else if (dy > 0 && Math.abs(dy) > Math.abs(dx) && press.y > 120 && !e.target.closest('.library')) press.pull = true;
    // dall'alto: a destra centro di controllo, a sinistra notifiche
    if (press.y < 70 + safeTop() && dy > 0) press.top = press.x > innerWidth / 2 ? 'cc' : 'notif';
  }
  if (press.drag) moveDrag(e);
});
const endPress = (e) => {
  if (!press) return;
  clearTimeout(press.timer);
  const p = press; press = null;
  if (p.drag) return endDrag(e, p);
  const dy = e.clientY - p.y;
  if (p.top && dy > 50) { p.top === 'cc' || !native ? openCC() : nat('expandNotifications'); return; }
  if (p.pull && dy > 70) { openSpotlight(); return; }
  if (p.moved || p.long) return;
  if (p.del) { const id = e.target.closest('.del-badge')?.dataset.del; if (id) removeFromHome(id); return; }
  const w = e.target.closest('[data-open]');
  if (w && !document.body.classList.contains('jiggle')) {
    const o = w.dataset.open;
    if (o === 'calendar') { const cal = Object.values(OS.apps).find(a => a.role === 'calendar'); if (cal) launch(cal.id, null); }
    else launch(o, null);
    return;
  }
  if (p.tile) {
    if (document.body.classList.contains('jiggle')) return;
    launch(p.tile.dataset.id, p.tile);
  } else if (document.body.classList.contains('jiggle') && !e.target.closest('.app')) stopJiggle();
};
$('#home').addEventListener('pointerup', endPress);
$('#home').addEventListener('pointercancel', () => { if (press) { clearTimeout(press.timer); if (press.drag) endDrag(null, press); press = null; } });
$('#home').addEventListener('contextmenu', e => e.preventDefault());
$('#jiggle-done').onclick = stopJiggle;
$('#search-pill').onclick = () => openSpotlight();
$('#pages').addEventListener('scroll', () => { cancelAnimationFrame(renderDots._r); renderDots._r = requestAnimationFrame(renderDots); }, { passive: true });

function startDrag(p, e) {
  p.drag = true;
  const r = p.tile.getBoundingClientRect();
  const ghost = p.tile.cloneNode(true);
  ghost.classList.add('ghost'); ghost.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;z-index:90;pointer-events:none`;
  $('#device').appendChild(ghost);
  p.ghost = ghost; p.ox = e.clientX - r.left; p.oy = e.clientY - r.top;
  p.tile.style.opacity = '.25';
  $('#pages').style.scrollSnapType = 'none';
  $('#home').setPointerCapture?.(p.id);
  press = p;
}
function moveDrag(e) {
  const p = press;
  p.ghost.style.left = e.clientX - p.ox + 'px'; p.ghost.style.top = e.clientY - p.oy + 'px';
  $$('.drop-target').forEach(x => x.classList.remove('drop-target'));
  const t = document.elementFromPoint(e.clientX, e.clientY)?.closest('.app:not(.ghost)');
  if (t && t !== p.tile && t.dataset.where !== 'lib') t.classList.add('drop-target');
  // vicino al bordo: cambia pagina
  clearTimeout(p.edge);
  const pages = $('#pages');
  if (e.clientX < 24 || e.clientX > innerWidth - 24) {
    p.edge = setTimeout(() => pages.scrollBy({ left: e.clientX < 24 ? -pages.clientWidth : pages.clientWidth, behavior: 'smooth' }), 450);
  }
}
function endDrag(e, p) {
  clearTimeout(p.edge);
  p.ghost.remove(); p.tile.style.opacity = '';
  $$('.drop-target').forEach(x => x.classList.remove('drop-target'));
  $('#pages').style.scrollSnapType = '';
  if (!e) return;
  const id = p.tile.dataset.id;
  const under = document.elementFromPoint(e.clientX, e.clientY);
  const t = under?.closest('.app');
  const L = OS.layout;
  const without = (arr) => arr.filter(x => x !== id);
  if (t && t.dataset.id !== id && t.dataset.where !== 'lib') {
    const target = t.dataset.id, inDock = t.dataset.where === 'dock';
    L.order = without(L.order); L.dock = without(L.dock);
    const arr = inDock ? L.dock : L.order;
    arr.splice(arr.indexOf(target), 0, id);
    if (L.dock.length > 4) L.order.unshift(L.dock.pop());
  } else if (under?.closest('#dock') && !L.dock.includes(id) && L.dock.length < 4) {
    L.order = without(L.order); L.dock.push(id);
  } else if (under?.closest('.page')) {
    // rilasciata in uno spazio vuoto: alla fine di quella pagina
    const pg = under.closest('.page').dataset.page;
    if (pg !== 'lib') {
      L.order = without(L.order); L.dock = without(L.dock);
      const { perPage } = pageCapacity(), first = OS.settings.widgets ? perPage - 8 : perPage;
      const end = Math.min(L.order.length, +pg === 0 ? first : first + perPage * (+pg));
      L.order.splice(end, 0, id);
    }
  }
  saveLayout(); renderHome();
}

/* ---------------- ricerca ---------------- */
function openSpotlight() {
  closeOverlays();
  $('#spotlight').hidden = false; document.body.classList.add('overlay');
  const inp = $('#sp-input'); inp.value = ''; renderSpotlight('');
  setTimeout(() => inp.focus(), 50);
  history.pushState({ sp: 1 }, '');
}
function closeSpotlight() { if ($('#spotlight').hidden) return false; $('#spotlight').hidden = true; document.body.classList.remove('overlay'); $('#sp-input').blur(); return true; }
function renderSpotlight(q) {
  q = q.trim();
  const all = Object.values(OS.apps).sort((a, b) => a.name.localeCompare(b.name, 'it'));
  const hits = q ? all.filter(a => (a.name + ' ' + (a.realName || '')).toLowerCase().includes(q.toLowerCase())) : OS.layout.dock.concat(OS.layout.order.slice(0, 4)).map(appById).filter(Boolean);
  $('#sp-results').innerHTML = `<div class="sp-section">${q ? 'App' : 'Suggerimenti Siri'}</div>
    <div class="sp-apps">${hits.slice(0, 16).map(a => appTile(a.id, 'sp')).join('') || '<span style="opacity:.6;grid-column:span 4;padding:0 4px">Nessuna app</span>'}</div>
    ${q ? `<div class="sp-section">Web</div><button class="sp-web glass" id="sp-go">${svg('compass')}Cerca “${esc(q)}”</button>` : ''}`;
  const go = $('#sp-go'); if (go) go.onclick = () => webSearch(q);
}
function webSearch(q) {
  const url = 'https://www.google.com/search?q=' + encodeURIComponent(q);
  if (native) nat('openUrl', url); else window.open(url, '_blank');
}
$('#sp-input').addEventListener('input', (e) => renderSpotlight(e.target.value));
$('#sp-input').addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.value.trim()) webSearch(e.target.value.trim()); });
$('#sp-close').onclick = () => closeSpotlight();
$('#sp-results').addEventListener('click', (e) => { const t = e.target.closest('.app'); if (t) { const id = t.dataset.id; closeSpotlight(); launch(id, null); } });
$('#spotlight').addEventListener('pointerdown', (e) => { if (e.target.id === 'spotlight' || e.target.id === 'sp-results') closeSpotlight(); });

/* ---------------- centro di controllo ---------------- */
const CC = { wifi: true, bt: false, plane: false, data: true, torch: false, dnd: false, playing: false, bright: 70, vol: 50 };
function openCC() {
  closeOverlays();
  if (native) {
    const v = +nat('getVolume'); if (!isNaN(v)) CC.vol = v;
    const b = +nat('getBrightness'); if (!isNaN(b) && b >= 0) CC.bright = b;
  }
  const t = (k, ico, cls = '', extra = '') => `<button class="tile glass ${cls} ${CC[k] ? 'on' : ''}" data-cc="${k}" ${extra}>${svg(ico)}</button>`;
  $('#cc-grid').innerHTML = `
    <div class="cc-conn glass liquid tile">
      ${t('plane', 'plane', 'orange')}${t('data', 'data', 'green')}${t('wifi', 'wifi', 'blue')}${t('bt', 'bt', 'blue')}
    </div>
    <div class="cc-music glass liquid tile">
      <div><div class="mt">Musica</div><div class="ma">${native ? 'Controlla ciò che è in riproduzione' : 'Non in riproduzione'}</div></div>
      <div class="mc"><button data-media="prev"><svg viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6zM21 18V6l-8.5 6z"/></svg></button>
      <button data-media="play"><svg viewBox="0 0 24 24">${CC.playing ? '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>' : '<path d="M7 4v16l13-8z"/>'}</svg></button>
      <button data-media="next"><svg viewBox="0 0 24 24"><path d="M13 6v12l8.5-6zM3 6v12l8.5-6z"/></svg></button></div>
    </div>
    ${t('rotate', 'rotate', 'round')}${t('torch', 'flash', 'round')}
    <div class="cc-slider glass" data-slider="bright"><div class="fill" style="height:${CC.bright}%"></div>${svg('sun2')}</div>
    <div class="cc-slider glass" data-slider="vol"><div class="fill" style="height:${CC.vol}%"></div>${svg('vol')}</div>
    <button class="tile glass cc-wide ${CC.dnd ? 'on' : ''}" data-cc="dnd"><span class="dot">${svg('moon')}</span>Full immersion</button>
    <button class="tile glass round" data-open-app="glass.clock">${svg('clock')}</button>
    <button class="tile glass round" data-open-app="glass.calc">${svg('calc')}</button>
    <button class="tile glass round" data-cc="dark">${svg('contrast')}</button>
    <button class="tile glass round" data-open-app="camera">${svg('camera')}</button>
    <button class="tile glass round" data-open-app="glass.settings">${svg('brush')}</button>
    ${native ? `<button class="tile glass round" data-cc="notif">${svg('bell')}</button><button class="tile glass round" data-cc="android">${svg('gear')}</button>` : ''}
    <div class="cc-hint">${native ? 'Tieni premuto Wi-Fi o Bluetooth per le impostazioni di Android' : 'Tocca fuori per chiudere'}</div>`;
  $('#cc').hidden = false; $('#cc').classList.remove('open'); void $('#cc').offsetWidth; $('#cc').classList.add('open');
  document.body.classList.add('overlay');
  refreshLiquid();
  history.pushState({ cc: 1 }, '');
}
function closeCC() { if ($('#cc').hidden) return false; $('#cc').hidden = true; document.body.classList.remove('overlay'); return true; }

$('#cc').addEventListener('click', (e) => {
  const b = e.target.closest('[data-cc],[data-media],[data-open-app]');
  if (!b) { if (e.target.id === 'cc' || e.target.id === 'cc-grid') closeCC(); return; }
  haptic(8);
  if (b.dataset.media) {
    if (native) nat('mediaKey', b.dataset.media);
    if (b.dataset.media === 'play') { CC.playing = !CC.playing; openCC(); }
    return;
  }
  if (b.dataset.openApp) {
    const k = b.dataset.openApp; closeCC();
    if (k === 'camera') { const c = Object.values(OS.apps).find(a => a.role === 'camera'); if (c) launch(c.id, null); }
    else launch(k, null);
    return;
  }
  const k = b.dataset.cc;
  if (k === 'dark') { OS.set('theme', document.body.classList.contains('light') ? 'dark' : 'light'); return; }
  if (k === 'notif') { closeCC(); nat('expandNotifications'); return; }
  if (k === 'android') { closeCC(); nat('openSettings', ''); return; }
  if (k === 'torch') return toggleTorch(b);
  if (native && ['wifi', 'bt', 'plane', 'data'].includes(k)) {
    // Android non permette alle app di accendere/spegnere Wi-Fi ecc.: apre il pannello di sistema
    nat('openPanel', k); return;
  }
  CC[k] = !CC[k]; b.classList.toggle('on', CC[k]);
});

async function toggleTorch(btn) {
  CC.torch = !CC.torch;
  let ok;
  if (native) ok = nat('setTorch', CC.torch);
  else ok = await webTorch(CC.torch);
  if (ok === false) { CC.torch = false; OS.toast('Torcia non disponibile'); }
  $$('[data-cc="torch"], #lock-torch').forEach(x => x.classList.toggle('on', CC.torch));
}
let torchStream = null;
async function webTorch(on) {
  try {
    if (!on) { torchStream && torchStream.getTracks().forEach(t => t.stop()); torchStream = null; return true; }
    torchStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    const track = torchStream.getVideoTracks()[0];
    await track.applyConstraints({ advanced: [{ torch: true }] });
    return true;
  } catch { return false; }
}

// cursori luminosita'/volume
$('#cc').addEventListener('pointerdown', (e) => {
  const s = e.target.closest('[data-slider]'); if (!s) return;
  const r = s.getBoundingClientRect(), k = s.dataset.slider, fill = s.querySelector('.fill');
  s.setPointerCapture(e.pointerId);
  const upd = (ev) => {
    const v = Math.round(Math.min(100, Math.max(0, (r.bottom - ev.clientY) / r.height * 100)));
    CC[k] = v; fill.style.height = v + '%';
    if (k === 'vol') nat('setVolume', v);
    if (k === 'bright') { if (native) nat('setBrightness', v); else $('#dimmer').style.opacity = (100 - v) / 100 * .6; }
  };
  upd(e);
  s.onpointermove = upd;
  s.onpointerup = s.onpointercancel = () => { s.onpointermove = null; };
});
$('#cc').addEventListener('contextmenu', (e) => {
  e.preventDefault();
  const b = e.target.closest('[data-cc]'); if (!b || !native) return;
  const map = { wifi: 'android.settings.WIFI_SETTINGS', bt: 'android.settings.BLUETOOTH_SETTINGS', plane: 'android.settings.AIRPLANE_MODE_SETTINGS', data: 'android.settings.DATA_ROAMING_SETTINGS' };
  if (map[b.dataset.cc]) { closeCC(); nat('openSettings', map[b.dataset.cc]); }
});

/* ---------------- gesto "torna alla home" nelle app ---------------- */
(() => {
  const ind = $('#app-indicator'), win = $('#appwin');
  let st = null;
  ind.addEventListener('pointerdown', (e) => { st = { y: e.clientY, x: e.clientX }; ind.setPointerCapture(e.pointerId); });
  ind.addEventListener('pointermove', (e) => {
    if (!st) return;
    const dy = Math.min(0, e.clientY - st.y), dx = e.clientX - st.x;
    const s = Math.max(.55, 1 + dy / 900);
    win.style.transform = `translate(${dx * .5 + innerWidth * (1 - s) / 2}px, ${dy * .6 + innerHeight * (1 - s) / 2}px) scale(${s})`;
    win.style.borderRadius = Math.min(44, -dy / 3) + 'px';
  });
  const end = (e) => {
    if (!st) return;
    const dy = e.clientY - st.y; st = null;
    if (dy < -60) { history.back(); }
    else { win.animate([{ transform: win.style.transform }, { transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.2,.9,.3,1.1)' }); win.style.transform = ''; win.style.borderRadius = ''; }
  };
  ind.addEventListener('pointerup', end); ind.addEventListener('pointercancel', end);
})();

/* ---------------- indietro / home ---------------- */
function closeOverlays() { let r = closeMenu(); r = closeCC() || r; r = closeSpotlight() || r; return r; }
function goBack() {
  if (closeMenu()) return true;
  if (closeCC() || closeSpotlight()) return true;
  if (!$('#appwin').hidden) { OS.closeApp(); return true; }
  if (stopJiggle()) return true;
  return false;
}
window.addEventListener('popstate', () => { goBack(); });

// chiamate dal lato Android
window.GlassOS = {
  back() { return goBack(); },
  home() {
    const busy = closeOverlays() | (!$('#appwin').hidden && (OS.closeApp(), 1)) | stopJiggle();
    if (!busy) $('#pages').scrollTo({ left: 0, behavior: 'smooth' });
    $$('.zoomer').forEach(z => z.remove());
  },
  onResume() { $$('.zoomer').forEach(z => z.remove()); tick(); refreshBattery(); },
  onAppsChanged() { buildRegistry(); syncLayout(); renderHome(); },
  onBattery(level, charging) { setBattery(level, charging); },
};

/* ---------------- orologio, data, batteria ---------------- */
const safeTop = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-top')) || 0;
function tick() {
  const d = new Date();
  const hm = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  $('#sb-time').textContent = hm;
  if ($('#lock')) {
    $('#lock-clock').textContent = hm;
    $('#lock-date').textContent = d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  // aggiorna le icone dinamiche (orologio ogni secondo, calendario a mezzanotte)
  $$('.art-icon').forEach(ic => {
    const tile = ic.closest('.app'); if (!tile) return;
    const a = appById(tile.dataset.id);
    if (a && (a.role === 'clock' || (a.role === 'calendar' && d.getSeconds() === 0))) ic.innerHTML = ART[a.role]();
  });
  if (!OS.layout) return;
  const left = OS.clock.tm.end - Date.now();
  const island = $('#island');
  if (OS.clock.tm.end && left > 0) {
    island.classList.add('expanded');
    const s = Math.ceil(left / 1000);
    $('#island-text').textContent = `⏱  ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  } else if (OS.clock.tm.end) {
    OS.clock.tm.end = 0; island.classList.remove('expanded');
    timerDone();
  }
}
setInterval(tick, 1000);
OS.startTimer = (sec) => { OS.clock.tm.end = Date.now() + sec * 1000; tick(); };
OS.stopTimer = () => { OS.clock.tm.end = 0; $('#island').classList.remove('expanded'); };
function timerDone() {
  haptic(600); OS.toast('⏱ Timer terminato');
  try {
    const ac = new AudioContext();
    [0, .35, .7].forEach(t => { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = 880; o.connect(g); g.connect(ac.destination); g.gain.setValueAtTime(.2, ac.currentTime + t); g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + t + .3); o.start(ac.currentTime + t); o.stop(ac.currentTime + t + .3); });
  } catch {}
}

function setBattery(level, charging) {
  const b = $('#sb-batt');
  b.style.width = Math.max(8, level) + '%';
  b.classList.toggle('low', level <= 20 && !charging);
  b.classList.toggle('charging', !!charging);
}
async function refreshBattery() {
  if (native) { try { const j = JSON.parse(nat('getBattery')); setBattery(j.level, j.charging); } catch {} return; }
  if (navigator.getBattery) {
    const bt = await navigator.getBattery();
    const u = () => setBattery(Math.round(bt.level * 100), bt.charging);
    u(); bt.onlevelchange = bt.onchargingchange = u;
  }
}
const net = () => document.body.classList.toggle('offline', !navigator.onLine);
addEventListener('online', net); addEventListener('offline', net);

/* ---------------- schermata di blocco (solo versione web) ---------------- */
function setupLock() {
  const lock = $('#lock');
  if (native) { lock.remove(); document.body.classList.remove('locked'); return; }
  document.body.classList.add('locked');
  $('#lock-notifs').innerHTML = `<div class="notif glass"><div class="ni">${ART.personalize()}</div><div class="nt"><b>GlassOS <small>ora</small></b><p>Scorri verso l'alto per iniziare. Installa il launcher per usarlo come tema del telefono.</p></div></div>`;
  let st = null;
  lock.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; st = e.clientY; lock.style.transition = 'none'; });
  lock.addEventListener('pointermove', (e) => { if (st == null) return; const dy = Math.min(0, e.clientY - st); lock.style.transform = `translateY(${dy}px)`; lock.style.opacity = 1 + dy / 500; });
  const end = (e) => {
    if (st == null) return;
    const dy = e.clientY - st; st = null; lock.style.transition = ''; lock.style.transform = ''; lock.style.opacity = '';
    if (dy < -90) unlock();
  };
  lock.addEventListener('pointerup', end); lock.addEventListener('pointercancel', end);
  $('#lock-torch').onclick = (e) => toggleTorch(e.currentTarget);
  $('#lock-camera').onclick = () => { location.href = WEB_APPS['web.camera'].href; };
  document.addEventListener('visibilitychange', () => { if (document.hidden && OS.settings.pin) relock(); });
}
function unlock() {
  if (OS.settings.pin) return askPin();
  $('#lock').classList.add('gone'); document.body.classList.remove('locked'); haptic(10);
}
function relock() { const l = $('#lock'); if (!l) return; OS.closeApp(); closeOverlays(); l.classList.remove('gone'); document.body.classList.add('locked'); }
function askPin() {
  const pc = $('#passcode'); pc.hidden = false;
  let code = '';
  const dots = $$('#pc-dots i');
  const keys = [['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'], ['', ''], ['0', ''], ['⌫', '']];
  $('#pc-pad').innerHTML = keys.map(([k, l]) => k ? `<button class="pc-key ${k === '⌫' ? '' : 'glass'}" data-k="${k}">${k}${l ? `<small>${l}</small>` : ''}</button>` : '<span></span>').join('');
  const draw = () => dots.forEach((d, i) => d.classList.toggle('on', i < code.length));
  draw();
  $('#pc-pad').onclick = (e) => {
    const k = e.target.closest('[data-k]')?.dataset.k; if (!k) return;
    haptic(5);
    code = k === '⌫' ? code.slice(0, -1) : (code + k).slice(0, 4); draw();
    if (code.length === 4) {
      if (code === OS.settings.pin) { pc.hidden = true; $('#lock').classList.add('gone'); document.body.classList.remove('locked'); }
      else { const d = $('#pc-dots'); d.classList.add('shake'); haptic(200); setTimeout(() => { d.classList.remove('shake'); code = ''; draw(); }, 420); }
    }
  };
  $('#pc-cancel').onclick = () => { pc.hidden = true; };
}

/* ---------------- avvio ---------------- */
function boot() {
  document.body.classList.toggle('native', !!native);
  // riavvio dopo un crash della grafica: niente rifrazione (l'effetto piu' pesante)
  if (/[?&]safe=1/.test(location.search)) { OS.settings.refract = false; store.set('settings', OS.settings); setTimeout(() => OS.toast('Grafica alleggerita per questo telefono'), 800); }
  applySettings();
  buildRegistry();
  syncLayout();
  setupLock();
  tick(); refreshBattery(); net();
  requestAnimationFrame(() => { renderHome(); });
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(renderHome, 200); });
  if (!native && 'serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
}
boot();
