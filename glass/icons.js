// GlassOS — set di icone in stile iOS (disegnate da zero in SVG) e regole per
// riconoscere a quale app di sistema Android corrispondono.
'use strict';

const ART = (() => {
  const V = (defs, body) => `<svg class="art" viewBox="0 0 100 100" preserveAspectRatio="none"><defs>${defs}</defs>${body}</svg>`;
  const lg = (id, a, b, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const bg = (id) => `<rect width="100" height="100" fill="url(#${id})"/>`;
  const handset = 'M71.6 61.8c-3.5-1.1-7.1-2.5-10.2-.3l-4.4 4.3c-7.4-4-13.4-10-17.4-17.4l4.3-4.4c2.2-3.1.8-6.7-.3-10.2-.9-2.9-1.6-6.4-5.2-6.9h-7c-3.4.3-5.6 3.1-5.4 6.6 1 21.3 18.5 38.8 39.8 39.8 3.5.2 6.3-2 6.6-5.4v-7c-.5-3.6-4-4.3-6.8-5.1z';

  const gear = () => {
    let d = '';
    const N = 18;
    for (let i = 0; i < N * 2; i++) {
      const r = i % 2 ? 31 : 37, a = (i / (N * 2)) * Math.PI * 2;
      const a1 = a - Math.PI / N / 2.4, a2 = a + Math.PI / N / 2.4;
      d += `${i ? 'L' : 'M'}${(50 + r * Math.cos(a1)).toFixed(1)} ${(50 + r * Math.sin(a1)).toFixed(1)}L${(50 + r * Math.cos(a2)).toFixed(1)} ${(50 + r * Math.sin(a2)).toFixed(1)}`;
    }
    let spokes = '';
    for (let i = 0; i < 6; i++) spokes += `<rect x="47.5" y="22" width="5" height="22" rx="2.5" fill="#8e8e93" transform="rotate(${i * 60} 50 50)"/>`;
    return d + 'Z' + '|' + spokes;
  };

  const icons = {
    phone: () => V(lg('ph', '#5ef77a', '#0bbd2a'), bg('ph') + `<path d="${handset}" fill="#fff"/>`),
    messages: () => V(lg('ms', '#5ef77a', '#0bbd2a'), bg('ms') +
      '<path d="M50 21c-20 0-36.5 12.9-36.5 28.8 0 9.1 5.4 17.2 13.8 22.5-.8 4.5-3.5 8.6-7.4 11.5 7.4.3 14.1-2.2 19-6.5 3.6.8 7.3 1.2 11.1 1.2 20 0 36.5-12.9 36.5-28.8S70 21 50 21z" fill="#fff"/>'),
    facetime: () => V(lg('ft', '#5ef77a', '#0bbd2a'), bg('ft') + '<rect x="18" y="33" width="44" height="34" rx="9" fill="#fff"/><path d="M65 45.5 80 36v28l-15-9.5z" fill="#fff"/>'),
    camera: () => V(lg('cm', '#ececf0', '#a9a9b0') + lg('cb', '#4a4a4e', '#1e1e20') + '<radialGradient id="cl" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#5a6aa8"/><stop offset=".45" stop-color="#1a1d3a"/><stop offset="1" stop-color="#050508"/></radialGradient>',
      bg('cm') + '<rect x="13" y="31" width="74" height="46" rx="9" fill="url(#cb)"/><path d="M36 31l4-7h20l4 7z" fill="#2e2e31"/><circle cx="50" cy="54" r="17" fill="#8e8e93"/><circle cx="50" cy="54" r="14" fill="url(#cl)"/><circle cx="45" cy="49" r="3.3" fill="#fff" opacity=".55"/><circle cx="76" cy="39" r="2.6" fill="#ffd60a"/>'),
    photos: () => {
      const cols = ['#ff9f0a', '#ffd60a', '#a5df3c', '#30d158', '#56c7f5', '#2f7cf6', '#a55ef2', '#f2477a'];
      return V('', '<rect width="100" height="100" fill="#fff"/>' + cols.map((c, i) =>
        `<ellipse cx="50" cy="29" rx="12.5" ry="20" fill="${c}" opacity=".85" style="mix-blend-mode:multiply" transform="rotate(${i * 45} 50 50)"/>`).join(''));
    },
    settings: () => {
      const [path, spokes] = gear().split('|');
      return V(lg('st', '#d5d5da', '#8a8a90') + lg('sg', '#6c6c70', '#2c2c2e'),
        bg('st') + `<path d="${path}" fill="url(#sg)"/><circle cx="50" cy="50" r="26" fill="#c7c7cc"/><circle cx="50" cy="50" r="23" fill="#48484a"/>${spokes}<circle cx="50" cy="50" r="8" fill="#c7c7cc"/><circle cx="50" cy="50" r="4.5" fill="#636366"/>`);
    },
    calendar: () => {
      const d = new Date();
      return V('', `<rect width="100" height="100" fill="#fff"/><text x="50" y="27" text-anchor="middle" font-size="15" font-weight="600" fill="#ff3b30" font-family="-apple-system,Inter,Roboto,sans-serif">${d.toLocaleDateString('it-IT', { weekday: 'long' }).replace(/^./, c => c.toUpperCase())}</text><text x="50" y="80" text-anchor="middle" font-size="56" font-weight="300" fill="#1c1c1e" letter-spacing="-2" font-family="-apple-system,Inter,Roboto,sans-serif">${d.getDate()}</text>`);
    },
    clock: () => {
      const d = new Date(), h = d.getHours() % 12 + d.getMinutes() / 60, m = d.getMinutes(), s = d.getSeconds();
      let ticks = '', nums = '';
      for (let i = 0; i < 60; i++) ticks += `<rect x="49.6" y="11" width=".8" height="${i % 5 ? 2 : 3.6}" fill="#1c1c1e" transform="rotate(${i * 6} 50 50)"/>`;
      for (let i = 1; i <= 12; i++) { const a = i / 12 * Math.PI * 2; nums += `<text x="${(50 + 30 * Math.sin(a)).toFixed(1)}" y="${(53.6 - 30 * Math.cos(a)).toFixed(1)}" text-anchor="middle" font-size="10" font-family="-apple-system,Inter,Roboto,sans-serif" fill="#1c1c1e">${i}</text>`; }
      return V('', `<rect width="100" height="100" fill="#000"/><circle cx="50" cy="50" r="41" fill="#fff"/>${ticks}${nums}
        <rect x="48.5" y="28" width="3" height="24" rx="1.5" fill="#1c1c1e" transform="rotate(${h * 30} 50 50)"/>
        <rect x="49" y="17" width="2" height="35" rx="1" fill="#1c1c1e" transform="rotate(${m * 6} 50 50)"/>
        <g transform="rotate(${s * 6} 50 50)" class="sec-hand"><rect x="49.5" y="14" width="1" height="44" fill="#ff9500"/></g>
        <circle cx="50" cy="50" r="2.4" fill="#ff9500"/><circle cx="50" cy="50" r="1" fill="#fff"/>`);
    },
    calculator: () => {
      const b = (x, y, f, t, tc = '#fff') => `<circle cx="${x}" cy="${y}" r="14" fill="${f}"/><text x="${x}" y="${y + 6.5}" text-anchor="middle" font-size="19" font-weight="500" fill="${tc}" font-family="-apple-system,Inter,Roboto,sans-serif">${t}</text>`;
      return V(lg('ca', '#3a3a3c', '#111'), bg('ca') + b(31, 31, '#a5a5a5', '±', '#000') + b(69, 31, '#ff9f0a', '÷') + b(31, 69, '#5a5a5c', '×') + b(69, 69, '#ff9f0a', '='));
    },
    notes: () => {
      let dots = '';
      for (let i = 0; i < 11; i++) dots += `<circle cx="${10 + i * 8}" cy="27" r="1.1" fill="#b8b8b8"/>`;
      return V(lg('nt', '#ffe36e', '#f7c600'), '<rect width="100" height="100" fill="#fdfdfd"/><rect width="100" height="24" fill="url(#nt)"/>' + dots +
        '<path d="M0 46h100M0 62h100M0 78h100" stroke="#d8d8d8" stroke-width="1.2"/>');
    },
    weather: () => V(lg('wt', '#1f7ff0', '#68bcff') + '<radialGradient id="ws"><stop offset="0" stop-color="#fff59a"/><stop offset="1" stop-color="#ffc800"/></radialGradient>',
      bg('wt') + '<circle cx="38" cy="40" r="16" fill="url(#ws)"/><path d="M72 76H35a13 13 0 1 1 3.3-25.6A17 17 0 0 1 70.8 53 11.6 11.6 0 0 1 72 76z" fill="#fff" opacity=".97"/>'),
    mail: () => V(lg('ml', '#21a8ff', '#0b63ff'), bg('ml') + '<rect x="17" y="29" width="66" height="44" rx="5" fill="#fff"/><path d="M19 32l31 23 31-23" fill="none" stroke="#2b8af7" stroke-width="3.6" stroke-linejoin="round"/>'),
    maps: () => V('', '<rect width="100" height="100" fill="#f3efe4"/><path d="M0 0h46L0 48z" fill="#bfe4a3"/><path d="M100 58v42H50z" fill="#9fd1f4"/>' +
      '<path d="M-5 70 105 22" stroke="#fff" stroke-width="13"/><path d="M-5 70 105 22" stroke="#f7c843" stroke-width="7"/><path d="M38 -5l14 110" stroke="#fff" stroke-width="7"/>' +
      '<circle cx="66" cy="62" r="14" fill="#fff"/><path d="M66 52l7 17-7-4-7 4z" fill="#0a84ff"/>'),
    safari: () => {
      let t = '';
      for (let i = 0; i < 72; i++) t += `<rect x="49.6" y="14" width=".8" height="${i % 2 ? 2.5 : 4}" fill="#fff" opacity=".85" transform="rotate(${i * 5} 50 50)"/>`;
      return V(lg('sf', '#1ad6fd', '#1d62f0'), '<rect width="100" height="100" fill="#fff"/><circle cx="50" cy="50" r="40" fill="url(#sf)"/>' + t +
        '<g transform="rotate(45 50 50)"><path d="M50 18l6 32H44z" fill="#ff3b30"/><path d="M50 82l-6-32h12z" fill="#fff"/></g>');
    },
    appstore: () => V(lg('as', '#1ec4ff', '#1c6af0'), bg('as') +
      '<g stroke="#fff" stroke-width="7.5" stroke-linecap="round"><path d="M42 23l25 44M58 23 33 67M24 59h52M68 72l5 8M32 72l-5 8"/></g>'),
    music: () => V(lg('mu', '#fd6b80', '#fa233b'), bg('mu') + '<path d="M41 30v32.5A9 9 0 1 1 35 54a8.6 8.6 0 0 1 2 .3V26l32-6v36.5a9 9 0 1 1-6-8.5V32z" fill="#fff"/>'),
    contacts: () => V(lg('ct', '#eaeaec', '#bdbdc2'), bg('ct') + '<rect x="84" y="20" width="8" height="14" rx="2" fill="#ff9f0a"/><rect x="84" y="38" width="8" height="14" rx="2" fill="#30d158"/><rect x="84" y="56" width="8" height="14" rx="2" fill="#0a84ff"/>' +
      '<circle cx="46" cy="40" r="13" fill="#8e8e93"/><path d="M22 78c2-14 12-21 24-21s22 7 24 21z" fill="#8e8e93"/>'),
    files: () => V(lg('fl', '#4fb7ff', '#1876f2'), '<rect width="100" height="100" fill="#fff"/><path d="M16 30a5 5 0 0 1 5-5h18l7 7h33a5 5 0 0 1 5 5v35a5 5 0 0 1-5 5H21a5 5 0 0 1-5-5z" fill="url(#fl)"/><path d="M16 40h68" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>'),
    reminders: () => V('', '<rect width="100" height="100" fill="#fff"/>' + [['#0a84ff', 28], ['#ff3b30', 50], ['#ff9f0a', 72]].map(([c, y]) =>
      `<circle cx="25" cy="${y}" r="7" fill="none" stroke="${c}" stroke-width="3"/><circle cx="25" cy="${y}" r="3.2" fill="${c}"/><path d="M40 ${y}h40" stroke="#d1d1d6" stroke-width="2.4" stroke-linecap="round"/>`).join('')),
    personalize: () => V('<linearGradient id="pz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff6fae"/><stop offset=".5" stop-color="#7a5cff"/><stop offset="1" stop-color="#26cdfc"/></linearGradient>',
      bg('pz') + '<rect x="26" y="26" width="48" height="48" rx="15" fill="#fff" fill-opacity=".35" stroke="#fff" stroke-width="2"/><circle cx="41" cy="41" r="6" fill="#fff"/>'),
    voice: () => V('', '<rect width="100" height="100" fill="#000"/>' + [8, 18, 30, 22, 40, 28, 16, 34, 20, 10].map((h, i) =>
      `<rect x="${18 + i * 7}" y="${50 - h / 2}" width="3.6" height="${h}" rx="1.8" fill="#ff3b30"/>`).join('')),
    tv: () => V(lg('tv', '#2c2c2e', '#000'), bg('tv') + '<text x="50" y="62" text-anchor="middle" font-size="34" font-weight="700" fill="#fff" font-family="-apple-system,Inter,Roboto,sans-serif">tv</text>'),
    wallet: () => V('', '<rect width="100" height="100" fill="#000"/><rect x="18" y="24" width="64" height="18" rx="4" fill="#3a9cff"/><rect x="18" y="34" width="64" height="18" rx="4" fill="#ffb300"/><rect x="18" y="44" width="64" height="18" rx="4" fill="#ff5a4f"/><path d="M14 54h22c2 6 7 9 14 9s12-3 14-9h22v20a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6z" fill="#e5e5ea"/>'),
    health: () => V('', '<rect width="100" height="100" fill="#fff"/><path d="M80 32c-3-8-12-11-19-7-4 2-8 7-11 11-3-4-7-9-11-11-7-4-16-1-19 7-5 13 13 30 30 41 17-11 35-28 30-41z" fill="#ff2d55"/>'),
  };
  return icons;
})();

// Riconoscimento delle app di sistema dal nome del pacchetto Android
const ROLE_RULES = [
  ['phone', /(dialer|\.phone$|contacts\.phone|incallui)/],
  ['messages', /(messaging|\.mms$|\.messages|sms)/],
  ['camera', /camera/],
  ['photos', /(gallery|photos|\.album)/],
  ['settings', /^com\.android\.settings$|\.settings$/],
  ['calendar', /calendar/],
  ['clock', /(deskclock|\.clock$|alarm)/],
  ['calculator', /calculator|calc$/],
  ['notes', /(\.keep$|notes|memo)/],
  ['weather', /weather/],
  ['mail', /(\.gm$|email|\.mail)/],
  ['maps', /maps/],
  ['safari', /(chrome|browser|sbrowser|firefox|opera|brave|edge)/],
  ['appstore', /(vending|galaxyapps|appmarket|appstore|getapps)/],
  ['music', /(music|spotify)/],
  ['contacts', /contacts/],
  ['files', /(documentsui|files|myfiles|filemanager)/],
  ['reminders', /(tasks|reminder|todo)/],
  ['voice', /(recorder|soundrecorder|voicerecorder)/],
  ['wallet', /(wallet|walletnfcrel|\.pay$)/],
  ['health', /(fitness|health)/],
  ['facetime', /(apps\.tachyon|meet)/],
];
// app di terze parti che hanno gia' la stessa icona anche su iPhone
const KEEP_REAL = /(whatsapp|instagram|facebook|youtube(?!\.music)|tiktok|zhiliaoapp|telegram|spotify|netflix|amazon|twitter|linkedin|snapchat|paypal|uber|discord|reddit)/;

function iosRole(pkg, label) {
  if (!pkg || KEEP_REAL.test(pkg)) return null;
  for (const [role, re] of ROLE_RULES) if (re.test(pkg)) return role;
  return null;
}

// nomi in stile iPhone per le app riconosciute
const IOS_NAMES = {
  phone: 'Telefono', messages: 'Messaggi', camera: 'Fotocamera', photos: 'Foto', settings: 'Impostazioni',
  calendar: 'Calendario', clock: 'Orologio', calculator: 'Calcolatrice', notes: 'Note', weather: 'Meteo',
  mail: 'Mail', maps: 'Mappe', safari: 'Safari', appstore: 'App Store', music: 'Musica', contacts: 'Contatti',
  files: 'File', reminders: 'Promemoria', voice: 'Memo vocali', wallet: 'Wallet', health: 'Salute', facetime: 'FaceTime',
};
