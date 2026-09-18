// Configurazione della dashboard online — compila con i valori di Supabase
// (Project Settings → API). Qui va SOLO la chiave "anon public": e' pensata per
// stare nel browser, e i dati sono protetti dal login + Row Level Security.
window.CRM_CONFIG = {
  SUPABASE_URL: "https://psjtexakxawuvsmtjskh.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_nmnVMSTMZMnW6lwgMTaX1g_PJA6TcpS",
  EMAIL_MITTENTE: "videomakercristianleoni@gmail.com",
  // OAuth Client ID "Web application" della console Google Cloud (pubblico, va bene nel browser)
  GOOGLE_CLIENT_ID: "63928945960-mtmnr289nihr9lp3v357ujac36da5c48.apps.googleusercontent.com",
};
