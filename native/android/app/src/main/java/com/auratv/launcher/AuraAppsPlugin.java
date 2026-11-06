package com.auratv.launcher;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.util.Base64;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@CapacitorPlugin(name = "AuraApps")
public class AuraAppsPlugin extends Plugin {
    private static final String[] INTERNAL_PREFIXES = new String[] {
        "com.android.systemui", "com.android.providers", "com.google.android.gms",
        "com.google.android.tvlauncher", "com.google.android.inputmethod",
        "com.android.permissioncontroller", "com.android.packageinstaller",
        "com.android.settings", "com.android.tv.settings", "com.google.android.tv.settings",
        "com.google.android.apps.tv.launcherx", "com.google.android.tungsten.setupwraith",
        "com.google.android.tvrecommendations", "com.google.android.tv.remote.service",
        "com.google.android.apps.mediashell", "com.google.android.tv.frameworkpackagestubs"
    };

    @PluginMethod
    public void getInstalledApps(PluginCall call) {
        try {
            Boolean includeSystemValue = call.getBoolean("includeSystem");
            boolean includeSystem = includeSystemValue != null && includeSystemValue;
            PackageManager pm = getContext().getPackageManager();
            Intent launcher = new Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER);
            Intent leanback = new Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LEANBACK_LAUNCHER);

            Map<String, ResolveInfo> unique = new LinkedHashMap<>();
            for (ResolveInfo info : pm.queryIntentActivities(launcher, PackageManager.MATCH_ALL)) {
                unique.put(info.activityInfo.packageName, info);
            }
            for (ResolveInfo info : pm.queryIntentActivities(leanback, PackageManager.MATCH_ALL)) {
                unique.put(info.activityInfo.packageName, info);
            }

            List<ResolveInfo> matches = new ArrayList<>();
            for (ResolveInfo info : unique.values()) {
                String packageName = info.activityInfo.packageName;
                if (packageName.equals(getContext().getPackageName())) continue;
                if (!includeSystem && isInternalPackage(packageName)) continue;
                matches.add(info);
            }
            Collections.sort(matches, Comparator.comparing(info -> info.loadLabel(pm).toString().toLowerCase()));

            JSArray apps = new JSArray();
            for (ResolveInfo info : matches) {
                JSObject item = new JSObject();
                item.put("packageName", info.activityInfo.packageName);
                item.put("name", info.loadLabel(pm).toString());
                item.put("isSystem", (info.activityInfo.applicationInfo.flags & android.content.pm.ApplicationInfo.FLAG_SYSTEM) != 0);
                item.put("iconDataUrl", drawableToDataUrl(info.loadIcon(pm)));
                apps.put(item);
            }
            JSObject result = new JSObject();
            result.put("apps", apps);
            call.resolve(result);
        } catch (Exception error) {
            call.reject("Unable to enumerate launchable TV apps", error);
        }
    }

    @PluginMethod
    public void launchApp(PluginCall call) {
        String packageName = call.getString("packageName");
        if (packageName == null || packageName.trim().isEmpty()) {
            call.reject("packageName is required");
            return;
        }
        try {
            PackageManager pm = getContext().getPackageManager();
            Intent launch = pm.getLeanbackLaunchIntentForPackage(packageName);
            if (launch == null) launch = pm.getLaunchIntentForPackage(packageName);
            if (launch == null) {
                call.reject("This app has no launchable activity");
                return;
            }
            launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(launch);
            JSObject result = new JSObject();
            result.put("launched", true);
            call.resolve(result);
        } catch (Exception error) {
            call.reject("Unable to launch app", error);
        }
    }

    private boolean isInternalPackage(String packageName) {
        for (String prefix : INTERNAL_PREFIXES) {
            if (packageName.startsWith(prefix)) return true;
        }
        return false;
    }

    private String drawableToDataUrl(Drawable drawable) {
        int width = drawable.getIntrinsicWidth() > 0 ? drawable.getIntrinsicWidth() : 96;
        int height = drawable.getIntrinsicHeight() > 0 ? drawable.getIntrinsicHeight() : 96;
        Bitmap bitmap = Bitmap.createBitmap(Math.min(width, 192), Math.min(height, 192), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
        drawable.draw(canvas);
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, output);
        return "data:image/png;base64," + Base64.encodeToString(output.toByteArray(), Base64.NO_WRAP);
    }
}
