from pathlib import Path
import shutil, sys
root = Path(__file__).resolve().parents[2]
android = root / 'android'
if not android.exists():
    raise SystemExit('android/ folder not found; run npx cap add android first')
src = Path(__file__).resolve().parent / 'app/src/main/java/com/auratv/launcher'
dst = android / 'app/src/main/java/com/auratv/launcher'
dst.mkdir(parents=True, exist_ok=True)
for name in ('MainActivity.java', 'AuraAppsPlugin.java'):
    shutil.copy2(src / name, dst / name)
banner_src = Path(__file__).resolve().parent / 'app/src/main/res/drawable/aura_tv_banner.xml'
banner_dst = android / 'app/src/main/res/drawable/aura_tv_banner.xml'
banner_dst.parent.mkdir(parents=True, exist_ok=True)
shutil.copy2(banner_src, banner_dst)
manifest = android / 'app/src/main/AndroidManifest.xml'
text = manifest.read_text(encoding='utf-8')
queries = '''
    <queries>
        <intent><action android:name="android.intent.action.MAIN" /><category android:name="android.intent.category.LAUNCHER" /></intent>
        <intent><action android:name="android.intent.action.MAIN" /><category android:name="android.intent.category.LEANBACK_LAUNCHER" /></intent>
    </queries>
'''
if 'android.software.leanback' not in text:
    text = text.replace('<application', '    <uses-feature android:name="android.software.leanback" android:required="false" />\n    <uses-feature android:name="android.hardware.touchscreen" android:required="false" />\n    <application', 1)
if '<queries>' not in text:
    text = text.replace('<application', queries + '\n    <application', 1)
# Add LEANBACK_LAUNCHER to the Activity's launcher filter (not merely the package queries).
activity_start = text.find('<activity')
activity_end = text.find('</activity>', activity_start)
if activity_start >= 0 and activity_end >= 0:
    activity_xml = text[activity_start:activity_end]
    if 'android.intent.category.LEANBACK_LAUNCHER' not in activity_xml:
        activity_xml = activity_xml.replace(
            '<category android:name="android.intent.category.LAUNCHER" />',
            '<category android:name="android.intent.category.LAUNCHER" />\n                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />', 1)
        text = text[:activity_start] + activity_xml + text[activity_end:]
if 'android:banner=' not in text:
    text = text.replace('android:name=".MainActivity"', 'android:name=".MainActivity" android:banner="@drawable/aura_tv_banner"', 1)
if 'android.intent.category.HOME' not in text:
    home_filter = '''
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.HOME" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
'''
    text = text.replace('</activity>', home_filter + '        </activity>', 1)
manifest.write_text(text, encoding='utf-8')
print('Patched Android native app discovery, TV launcher intent and manifest queries.')
