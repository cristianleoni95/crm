package it.leonifilms.glassos;

import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.drawable.AdaptiveIconDrawable;
import android.graphics.drawable.Drawable;
import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraManager;
import android.media.AudioManager;
import android.net.Uri;
import android.os.BatteryManager;
import android.os.Build;
import android.os.SystemClock;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.provider.MediaStore;
import android.provider.Settings;
import android.provider.Telephony;
import android.util.LruCache;
import android.view.KeyEvent;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.util.List;

/** Funzioni del telefono esposte all'interfaccia come window.GlassNative. */
public class Bridge {

    private final MainActivity act;
    private final PackageManager pm;
    private final LruCache<String, byte[]> icons = new LruCache<String, byte[]>(16 * 1024 * 1024) {
        @Override protected int sizeOf(String k, byte[] v) { return v.length; }
    };
    private String torchId;
    private boolean askedWriteSettings = false;

    Bridge(MainActivity act) {
        this.act = act;
        this.pm = act.getPackageManager();
    }

    /* ------------ app installate ------------ */

    @JavascriptInterface
    public String getApps() {
        JSONArray out = new JSONArray();
        Intent i = new Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER);
        List<ResolveInfo> list = pm.queryIntentActivities(i, 0);
        for (ResolveInfo ri : list) {
            String pkg = ri.activityInfo.packageName;
            if (pkg.equals(act.getPackageName())) continue;
            try {
                JSONObject o = new JSONObject();
                o.put("id", new ComponentName(pkg, ri.activityInfo.name).flattenToString());
                o.put("pkg", pkg);
                o.put("label", String.valueOf(ri.loadLabel(pm)));
                out.put(o);
            } catch (Exception ignored) { }
        }
        return out.toString();
    }

    /** App predefinite di Android per telefono, messaggi, browser, ecc. */
    @JavascriptInterface
    public String getDefaults() {
        JSONObject o = new JSONObject();
        try {
            put(o, "phone", new Intent(Intent.ACTION_DIAL));
            String sms = Telephony.Sms.getDefaultSmsPackage(act);
            if (sms != null) o.put("messages", sms);
            put(o, "safari", new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.example.com")));
            put(o, "camera", new Intent(MediaStore.INTENT_ACTION_STILL_IMAGE_CAMERA));
            put(o, "mail", new Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:")));
            put(o, "maps", new Intent(Intent.ACTION_VIEW, Uri.parse("geo:0,0?q=")));
        } catch (Exception ignored) { }
        return o.toString();
    }

    private void put(JSONObject o, String key, Intent i) throws Exception {
        ResolveInfo ri = pm.resolveActivity(i, PackageManager.MATCH_DEFAULT_ONLY);
        if (ri == null || ri.activityInfo == null) return;
        String pkg = ri.activityInfo.packageName;
        if ("android".equals(pkg) || pkg.contains("resolver")) {
            // nessuna predefinita: prendi la prima disponibile
            List<ResolveInfo> l = pm.queryIntentActivities(i, 0);
            if (l.isEmpty()) return;
            pkg = l.get(0).activityInfo.packageName;
        }
        o.put(key, pkg);
    }

    @JavascriptInterface
    public void launch(String id) {
        ComponentName cn = ComponentName.unflattenFromString(id);
        if (cn == null) return;
        Intent i = new Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER).setComponent(cn)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
        start(i);
    }

    @JavascriptInterface
    public void appInfo(String pkg) {
        start(new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + pkg)).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
    }

    @JavascriptInterface
    public void uninstall(String pkg) {
        start(new Intent(Intent.ACTION_DELETE, Uri.parse("package:" + pkg)).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
    }

    @JavascriptInterface
    public void openUrl(String url) {
        try {
            Intent i = url.startsWith("intent:") ? Intent.parseUri(url, Intent.URI_INTENT_SCHEME) : new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            start(i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
        } catch (Exception ignored) { }
    }

    @JavascriptInterface
    public void openSettings(String action) {
        String a = action == null || action.isEmpty() ? Settings.ACTION_SETTINGS : action;
        start(new Intent(a).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
    }

    @JavascriptInterface
    public void openHomeSettings() {
        start(new Intent(Settings.ACTION_HOME_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
    }

    /** Android non lascia alle app accendere Wi-Fi/Bluetooth: apre il pannello rapido di sistema. */
    @JavascriptInterface
    public void openPanel(String what) {
        String a;
        switch (what) {
            case "wifi": a = Build.VERSION.SDK_INT >= 29 ? Settings.Panel.ACTION_WIFI : Settings.ACTION_WIFI_SETTINGS; break;
            case "data": a = Build.VERSION.SDK_INT >= 29 ? Settings.Panel.ACTION_INTERNET_CONNECTIVITY : Settings.ACTION_DATA_ROAMING_SETTINGS; break;
            case "bt": a = Settings.ACTION_BLUETOOTH_SETTINGS; break;
            case "plane": a = Settings.ACTION_AIRPLANE_MODE_SETTINGS; break;
            default: a = Settings.ACTION_SETTINGS;
        }
        start(new Intent(a).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
    }

    private void start(Intent i) {
        act.runOnUiThread(() -> {
            try { act.startActivity(i); } catch (ActivityNotFoundException | SecurityException e) {
                act.js("OS.toast('Impossibile aprire')");
            }
        });
    }

    /* ------------ icone ------------ */

    void clearIcons() { icons.evictAll(); }

    /** Icona dell'app come PNG quadrato a tutta superficie: la forma arrotondata stile iOS la dà il CSS. */
    byte[] iconPng(String id) {
        byte[] cached = icons.get(id);
        if (cached != null) return cached;
        try {
            ComponentName cn = ComponentName.unflattenFromString(id);
            if (cn == null) return null;
            Drawable d = pm.getActivityIcon(cn);
            int S = 192;
            Bitmap bmp = Bitmap.createBitmap(S, S, Bitmap.Config.ARGB_8888);
            Canvas c = new Canvas(bmp);
            if (d instanceof AdaptiveIconDrawable) {
                AdaptiveIconDrawable a = (AdaptiveIconDrawable) d;
                // i livelli sono 108dp di cui 72 visibili: si allargano del 25% per lato
                Rect r = new Rect(-S / 4, -S / 4, S + S / 4, S + S / 4);
                Drawable bg = a.getBackground(), fg = a.getForeground();
                if (bg != null) { bg.setBounds(r); bg.draw(c); } else c.drawColor(Color.WHITE);
                if (fg != null) { fg.setBounds(r); fg.draw(c); }
            } else {
                // icona vecchio stile (con la sua forma): su fondo bianco come le app iOS
                c.drawColor(Color.WHITE);
                int p = S / 7;
                d.setBounds(p, p, S - p, S - p);
                d.draw(c);
            }
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            bmp.compress(Bitmap.CompressFormat.PNG, 100, bos);
            bmp.recycle();
            byte[] png = bos.toByteArray();
            icons.put(id, png);
            return png;
        } catch (Throwable e) {   // anche OutOfMemoryError su icone enormi
            return null;
        }
    }

    /* ------------ sistema ------------ */

    @JavascriptInterface
    public void expandNotifications() { statusBar("expandNotificationsPanel"); }

    @JavascriptInterface
    public void expandQuickSettings() { statusBar("expandSettingsPanel"); }

    @SuppressWarnings("JavaReflectionMemberAccess")
    private void statusBar(String method) {
        act.runOnUiThread(() -> {
            try {
                Object sb = act.getSystemService("statusbar");
                Class.forName("android.app.StatusBarManager").getMethod(method).invoke(sb);
            } catch (Exception e) {
                act.js("OS.toast('Scorri dall\\'alto con due dita per le notifiche')");
            }
        });
    }

    @JavascriptInterface
    public void setStatusBarVisible(boolean visible) { act.setStatusBarVisible(visible); }

    @JavascriptInterface
    public String getBattery() {
        BatteryManager bm = (BatteryManager) act.getSystemService(Context.BATTERY_SERVICE);
        try {
            JSONObject o = new JSONObject();
            o.put("level", bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY));
            o.put("charging", bm.isCharging());
            return o.toString();
        } catch (Exception e) { return "{}"; }
    }

    @JavascriptInterface
    public boolean setTorch(boolean on) {
        try {
            CameraManager cm = (CameraManager) act.getSystemService(Context.CAMERA_SERVICE);
            if (torchId == null) {
                for (String id : cm.getCameraIdList()) {
                    Boolean f = cm.getCameraCharacteristics(id).get(CameraCharacteristics.FLASH_INFO_AVAILABLE);
                    if (Boolean.TRUE.equals(f)) { torchId = id; break; }
                }
            }
            if (torchId == null) return false;
            cm.setTorchMode(torchId, on);
            return true;
        } catch (Exception e) { return false; }
    }

    /** Play/pausa, avanti, indietro sulla musica in riproduzione (Spotify, YouTube Music, ...). */
    @JavascriptInterface
    public void mediaKey(String which) {
        int code = "next".equals(which) ? KeyEvent.KEYCODE_MEDIA_NEXT
                : "prev".equals(which) ? KeyEvent.KEYCODE_MEDIA_PREVIOUS : KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE;
        AudioManager am = (AudioManager) act.getSystemService(Context.AUDIO_SERVICE);
        long t = SystemClock.uptimeMillis();
        am.dispatchMediaKeyEvent(new KeyEvent(t, t, KeyEvent.ACTION_DOWN, code, 0));
        am.dispatchMediaKeyEvent(new KeyEvent(t, t, KeyEvent.ACTION_UP, code, 0));
    }

    @JavascriptInterface
    public int getVolume() {
        AudioManager am = (AudioManager) act.getSystemService(Context.AUDIO_SERVICE);
        int max = am.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
        return max > 0 ? am.getStreamVolume(AudioManager.STREAM_MUSIC) * 100 / max : 0;
    }

    @JavascriptInterface
    public void setVolume(int v) {
        AudioManager am = (AudioManager) act.getSystemService(Context.AUDIO_SERVICE);
        int max = am.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
        am.setStreamVolume(AudioManager.STREAM_MUSIC, Math.round(v / 100f * max), 0);
    }

    @JavascriptInterface
    public int getBrightness() {
        try {
            return Settings.System.getInt(act.getContentResolver(), Settings.System.SCREEN_BRIGHTNESS) * 100 / 255;
        } catch (Exception e) { return -1; }
    }

    /** Luminosita' di sistema: serve il permesso "Modifica impostazioni di sistema" (chiesto una volta). */
    @JavascriptInterface
    public void setBrightness(int v) {
        int val = Math.max(1, Math.min(255, Math.round(v / 100f * 255)));
        if (Settings.System.canWrite(act)) {
            Settings.System.putInt(act.getContentResolver(), Settings.System.SCREEN_BRIGHTNESS_MODE, Settings.System.SCREEN_BRIGHTNESS_MODE_MANUAL);
            Settings.System.putInt(act.getContentResolver(), Settings.System.SCREEN_BRIGHTNESS, val);
        } else {
            act.runOnUiThread(() -> {
                WindowManager.LayoutParams lp = act.getWindow().getAttributes();
                lp.screenBrightness = val / 255f;
                act.getWindow().setAttributes(lp);
            });
            if (!askedWriteSettings) {
                askedWriteSettings = true;
                start(new Intent(Settings.ACTION_MANAGE_WRITE_SETTINGS, Uri.parse("package:" + act.getPackageName()))
                        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
            }
        }
    }

    @JavascriptInterface
    public void vibrate(int ms) {
        Vibrator v = (Vibrator) act.getSystemService(Context.VIBRATOR_SERVICE);
        if (v == null || !v.hasVibrator()) return;
        v.vibrate(VibrationEffect.createOneShot(Math.max(1, ms), VibrationEffect.DEFAULT_AMPLITUDE));
    }

    void release() {
        if (torchId != null) setTorch(false);
    }
}
