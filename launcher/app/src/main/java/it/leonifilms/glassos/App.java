package it.leonifilms.glassos;

import android.app.Application;
import android.os.Build;

import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.io.StringWriter;

/** Salva l'errore se l'app si chiude, cosi' al riavvio lo mostra (vedi MainActivity.showCrash). */
public class App extends Application {

    static File crashFile(android.content.Context c) { return new File(c.getFilesDir(), "crash.txt"); }

    @Override
    public void onCreate() {
        super.onCreate();
        final Thread.UncaughtExceptionHandler prev = Thread.getDefaultUncaughtExceptionHandler();
        Thread.setDefaultUncaughtExceptionHandler((t, e) -> {
            try {
                StringWriter sw = new StringWriter();
                e.printStackTrace(new PrintWriter(sw));
                try (FileWriter w = new FileWriter(crashFile(this))) {
                    w.write("GlassOS " + BuildConfigInfo.version(this) + " · Android " + Build.VERSION.RELEASE
                            + " (API " + Build.VERSION.SDK_INT + ") · " + Build.MANUFACTURER + " " + Build.MODEL
                            + "\nThread: " + t.getName() + "\n\n" + sw);
                }
            } catch (Throwable ignored) { }
            if (prev != null) prev.uncaughtException(t, e);
        });
    }

    static final class BuildConfigInfo {
        static String version(android.content.Context c) {
            try { return c.getPackageManager().getPackageInfo(c.getPackageName(), 0).versionName; }
            catch (Exception e) { return "?"; }
        }
    }
}
