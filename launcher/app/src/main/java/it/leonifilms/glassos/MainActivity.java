package it.leonifilms.glassos;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.BatteryManager;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.RenderProcessGoneDetail;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.GeolocationPermissions;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

/**
 * Launcher (schermata Home) di GlassOS: una WebView a tutto schermo che mostra
 * l'interfaccia in stile iPhone (cartella glass/ del repository) e un ponte
 * JavaScript (Bridge) per app installate, icone, torcia, volume, ecc.
 */
public class MainActivity extends Activity {

    static final String ORIGIN = "https://appassets.androidplatform.net";
    private static final int REQ_LOCATION = 1, REQ_FILE = 2;

    WebView web;
    Bridge bridge;
    private boolean pageReady = false;
    private boolean statusVisible = false;
    private GeolocationPermissions.Callback geoCallback;
    private String geoOrigin;
    private ValueCallback<Uri[]> fileCallback;
    private int rendererCrashes = 0;

    private final BroadcastReceiver packagesReceiver = new BroadcastReceiver() {
        @Override public void onReceive(Context c, Intent i) {
            bridge.clearIcons();
            js("GlassOS.onAppsChanged()");
        }
    };
    private final BroadcastReceiver batteryReceiver = new BroadcastReceiver() {
        @Override public void onReceive(Context c, Intent i) {
            int level = i.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
            int scale = i.getIntExtra(BatteryManager.EXTRA_SCALE, 100);
            int status = i.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
            boolean charging = status == BatteryManager.BATTERY_STATUS_CHARGING || status == BatteryManager.BATTERY_STATUS_FULL;
            if (level >= 0) js("GlassOS.onBattery(" + (level * 100 / Math.max(scale, 1)) + "," + charging + ")");
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        bridge = new Bridge(this);

        // se l'ultima volta l'app si e' chiusa per un errore, mostralo invece di riprovare alla cieca
        File crash = App.crashFile(this);
        if (crash.exists()) { showCrash(crash); return; }

        try { setupWindow(); } catch (Throwable ignored) { }
        createWeb(false);

        IntentFilter pf = new IntentFilter();
        pf.addAction(Intent.ACTION_PACKAGE_ADDED);
        pf.addAction(Intent.ACTION_PACKAGE_REMOVED);
        pf.addAction(Intent.ACTION_PACKAGE_CHANGED);
        pf.addAction(Intent.ACTION_PACKAGE_REPLACED);
        pf.addDataScheme("package");
        listen(packagesReceiver, pf);
        listen(batteryReceiver, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
    }

    /** Crea la WebView; safe = grafica alleggerita (senza rifrazione) dopo un crash del motore grafico. */
    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    private void createWeb(boolean safe) {
        pageReady = false;
        web = new WebView(this);
        web.setBackgroundColor(Color.BLACK);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setVerticalScrollBarEnabled(false);
        web.setHorizontalScrollBarEnabled(false);
        web.setHapticFeedbackEnabled(false);
        // la pressione lunga la gestisce l'interfaccia (menu delle icone), non il sistema
        web.setOnLongClickListener(v -> true);
        web.setLongClickable(false);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setGeolocationEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setTextZoom(100);
        WebView.setWebContentsDebuggingEnabled(true);

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/icon/", path -> {
                    String id = Uri.decode(path.replaceAll("\\.png$", ""));
                    byte[] png = bridge.iconPng(id);
                    if (png == null) return null;
                    WebResourceResponse r = new WebResourceResponse("image/png", null, new ByteArrayInputStream(png));
                    java.util.Map<String, String> h = new java.util.HashMap<>();
                    h.put("Cache-Control", "max-age=86400");
                    r.setResponseHeaders(h);
                    return r;
                })
                .addPathHandler("/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest req) {
                return loader.shouldInterceptRequest(req.getUrl());
            }
            @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest req) {
                Uri u = req.getUrl();
                if (u.toString().startsWith(ORIGIN)) return false;
                bridge.openUrl(u.toString());   // link esterni: nell'app giusta
                return true;
            }
            @Override public void onPageFinished(WebView v, String url) {
                pageReady = true;
                pushInsets();
            }
            @Override public boolean onRenderProcessGone(WebView v, RenderProcessGoneDetail detail) {
                runOnUiThread(MainActivity.this::onRendererGone);
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback cb) {
                if (checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    cb.invoke(origin, true, false);
                } else {
                    geoOrigin = origin; geoCallback = cb;
                    requestPermissions(new String[]{Manifest.permission.ACCESS_COARSE_LOCATION}, REQ_LOCATION);
                }
            }
            @Override public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = cb;
                try {
                    startActivityForResult(params.createIntent(), REQ_FILE);
                } catch (Exception e) {
                    fileCallback = null;
                    return false;
                }
                return true;
            }
        });

        web.addJavascriptInterface(bridge, "GlassNative");
        setContentView(web);
        web.setOnApplyWindowInsetsListener((v, insets) -> { pushInsets(); return insets; });
        web.loadUrl(ORIGIN + "/index.html" + (safe ? "?safe=1" : ""));
    }

    /** Il motore grafico della WebView si e' chiuso: senza questo Android chiuderebbe tutta l'app. */
    private void onRendererGone() {
        rendererCrashes++;
        WebView old = web;
        web = null;
        pageReady = false;
        if (old != null) {
            ViewGroup parent = (ViewGroup) old.getParent();
            if (parent != null) parent.removeView(old);
            old.destroy();
        }
        if (rendererCrashes > 3) {
            showMessage("La grafica di GlassOS continua a bloccarsi su questo telefono.\n\n"
                    + "Manda uno screenshot di questa schermata a chi ti ha dato l'app.\n\n"
                    + "WebView: " + webViewVersion());
            return;
        }
        createWeb(true);
    }

    private String webViewVersion() {
        try {
            android.content.pm.PackageInfo p = WebView.getCurrentWebViewPackage();
            return p == null ? "non trovata" : p.packageName + " " + p.versionName;
        } catch (Throwable e) { return "?"; }
    }

    private void showCrash(File crash) {
        String text;
        try { text = new String(Files.readAllBytes(crash.toPath()), StandardCharsets.UTF_8); }
        catch (Exception e) { text = "(errore illeggibile)"; }
        showMessage("GlassOS si è chiuso per un errore.\nFai uno screenshot di questa schermata (o premi Copia) e mandalo per la correzione.\n\n"
                + "WebView: " + webViewVersion() + "\n\n" + text);
    }

    private void showMessage(String text) {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setBackgroundColor(Color.BLACK);
        int pad = (int) (20 * getResources().getDisplayMetrics().density);
        box.setPadding(pad, pad * 2, pad, pad);

        TextView tv = new TextView(this);
        tv.setText(text);
        tv.setTextColor(Color.WHITE);
        tv.setTextSize(13);
        tv.setTextIsSelectable(true);
        ScrollView sv = new ScrollView(this);
        sv.addView(tv);
        box.addView(sv, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1));

        LinearLayout row = new LinearLayout(this);
        row.setGravity(Gravity.CENTER);
        Button copy = new Button(this);
        copy.setText("Copia");
        copy.setOnClickListener(v -> {
            ClipboardManager cm = (ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
            cm.setPrimaryClip(ClipData.newPlainText("GlassOS", text));
        });
        Button retry = new Button(this);
        retry.setText("Riprova");
        retry.setOnClickListener(v -> {
            App.crashFile(this).delete();
            recreate();
        });
        row.addView(copy);
        row.addView(retry);
        box.addView(row);
        setContentView(box);
    }

    private void listen(BroadcastReceiver r, IntentFilter f) {
        try {
            if (Build.VERSION.SDK_INT >= 33) registerReceiver(r, f, Context.RECEIVER_EXPORTED);
            else registerReceiver(r, f);
        } catch (Throwable ignored) { }
    }

    private void setupWindow() {
        Window w = getWindow();
        w.setStatusBarColor(Color.TRANSPARENT);
        w.setNavigationBarColor(Color.TRANSPARENT);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams lp = w.getAttributes();
            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            w.setAttributes(lp);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            w.setDecorFitsSystemWindows(false);
        } else {
            w.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
        }
        applyStatusBar();
    }

    /** Nasconde la barra di stato di Android quando si usa quella stile iPhone. */
    void setStatusBarVisible(boolean visible) {
        statusVisible = visible;
        runOnUiThread(this::applyStatusBar);
    }

    @SuppressWarnings("deprecation")
    private void applyStatusBar() {
        try { applyStatusBarUnsafe(); } catch (Throwable ignored) { }
    }

    @SuppressWarnings("deprecation")
    private void applyStatusBarUnsafe() {
        Window w = getWindow();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            WindowInsetsController c = w.getInsetsController();
            if (c == null) return;
            c.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            if (statusVisible) c.show(WindowInsets.Type.statusBars());
            else c.hide(WindowInsets.Type.statusBars());
            c.setSystemBarsAppearance(0, WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS);
        } else {
            int f = View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION;
            if (!statusVisible) f |= View.SYSTEM_UI_FLAG_FULLSCREEN;
            w.getDecorView().setSystemUiVisibility(f);
        }
    }

    /** Passa all'interfaccia gli spazi occupati da fotocamera/notch e barra di navigazione. */
    private void pushInsets() {
        try { pushInsetsUnsafe(); } catch (Throwable ignored) { }
    }

    private void pushInsetsUnsafe() {
        if (!pageReady || web == null) return;
        WindowInsets ins = web.getRootWindowInsets();
        if (ins == null) return;
        float d = getResources().getDisplayMetrics().density;
        int top, bottom;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            int types = WindowInsets.Type.statusBars() | WindowInsets.Type.displayCutout();
            top = ins.getInsetsIgnoringVisibility(types).top;
            bottom = ins.getInsetsIgnoringVisibility(WindowInsets.Type.navigationBars()).bottom;
        } else {
            top = ins.getStableInsetTop();
            bottom = ins.getStableInsetBottom();
        }
        // la barra stile iPhone ha gia' 46px di altezza: basta lo spazio del foro fotocamera oltre una soglia
        float topPx = Math.max(0, top / d - 30);
        float bottomPx = bottom / d;
        js("document.documentElement.style.setProperty('--safe-top','" + topPx + "px');" +
           "document.documentElement.style.setProperty('--safe-bottom','" + bottomPx + "px');" +
           "window.dispatchEvent(new Event('resize'))");
    }

    void js(String code) {
        if (web == null) return;
        runOnUiThread(() -> { if (pageReady && web != null) web.evaluateJavascript("try{" + code + "}catch(e){}", null); });
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        // tasto Home premuto mentre si e' gia' nella Home
        if (Intent.ACTION_MAIN.equals(intent.getAction())) js("GlassOS.home()");
    }

    @Override
    protected void onResume() {
        super.onResume();
        applyStatusBar();
        js("GlassOS.onResume()");
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        // un launcher non si chiude mai: il tasto indietro chiude app integrate e pannelli
        js("GlassOS.back()");
    }

    @Override
    public void onRequestPermissionsResult(int code, String[] perms, int[] res) {
        super.onRequestPermissionsResult(code, perms, res);
        if (code == REQ_LOCATION && geoCallback != null) {
            boolean ok = res.length > 0 && res[0] == PackageManager.PERMISSION_GRANTED;
            geoCallback.invoke(geoOrigin, ok, false);
            geoCallback = null;
        }
    }

    @Override
    protected void onActivityResult(int code, int result, Intent data) {
        super.onActivityResult(code, result, data);
        if (code == REQ_FILE && fileCallback != null) {
            fileCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(result, data));
            fileCallback = null;
        }
    }

    @Override
    protected void onDestroy() {
        try { unregisterReceiver(packagesReceiver); } catch (Exception ignored) { }
        try { unregisterReceiver(batteryReceiver); } catch (Exception ignored) { }
        if (bridge != null) bridge.release();
        if (web != null) web.destroy();
        super.onDestroy();
    }
}
