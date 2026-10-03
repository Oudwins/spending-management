# spending-management

Simple app to keep track of your spendings. Developed with Ionic and Vue.

Available on Play Store too: https://play.google.com/store/apps/details?id=mmasera.spendingmanager.com

## Install and update with Obtainium

Download `spending-management.apk` from the [latest GitHub release](https://github.com/Oudwins/spending-management/releases/latest), or install [Obtainium](https://github.com/ImranR98/Obtainium/releases/latest) and add this app using the source URL:

```text
https://github.com/Oudwins/spending-management
```

Obtainium's default GitHub settings detect releases and their APK automatically. Allow Obtainium to install unknown apps when Android prompts you. It can then check for updates and manage installation; silent updates depend on your Android version and Obtainium settings.

## Automated Android releases

Every push to `master` (including a merged pull request) runs type and lint checks, builds a signed APK using the Nix development environment, verifies its signature, and publishes it in a GitHub release with generated release notes. You can also run **Android release** manually from the Actions tab on `master`.

The Android `versionCode` is the workflow run number plus one, and both `versionName` and the release version are `1.0.<versionCode>` (tags have a `v` prefix). This increases on each new run so Android and Obtainium recognize updates. Re-running a failed run keeps its version. Keep this workflow's filename to preserve its run-number sequence.

### One-time signing setup

Generate a release key outside the repository (the command prompts for passwords and certificate details):

```bash
nix develop -c keytool -genkeypair -v \
  -keystore "$HOME/spending-management-release.keystore" \
  -storetype JKS -alias spending-management \
  -keyalg RSA -keysize 4096 -validity 10000
```

In **Settings → Secrets and variables → Actions → New repository secret**, add:

| Secret | Value |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | Output of `base64 -w 0 "$HOME/spending-management-release.keystore"` (Linux). |
| `ANDROID_KEYSTORE_PASSWORD` | The keystore password. |
| `ANDROID_KEY_ALIAS` | `spending-management` (or your chosen alias). |
| `ANDROID_KEY_PASSWORD` | The key password (may be the same as the keystore password). |

Back up the keystore and passwords and reuse them for every release. Android requires the same application ID and signing key for updates. The workflow uses its automatic `GITHUB_TOKEN` with `contents: write` to create tags and releases; no personal access token is needed.

Local builds use the debug key unless `ANDROID_KEYSTORE_PATH`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, and `ANDROID_KEY_PASSWORD` are provided. To replace a locally debug-signed installation with a GitHub release, first export any data you need and uninstall the local build, then install through Obtainium. The Play Store app linked above has a different application ID and is separate from these builds.

## Development

This repo uses a Nix flake for consistent tool versions.

```bash
####
# Enter the dev shell once, then use npm scripts.
####
nix develop

####
# CouchDB (local dev)
####
# Local CouchDB data lives under .couchdb/ (ignored by git)
# Web UI: http://127.0.0.1:5984/_utils/#login

# Start CouchDB (creates the DB if missing)
npm run db:dev

# CouchDB URLs for sync (already automatically applied via env variables for dev):
# - Web (host browser):    http://admin:admin@127.0.0.1:5984/spending
# - Android emulator only: http://admin:admin@10.0.2.2:5984/spending


####
# Both android & web
####
npm run build
npm run build:debug

####
# Checks
####
npm run checks # runs typecheck & lint
npm run checks:lint
npm run checks:types
npm run tests # all tests 
npm run tests:unit # only unit tests


####
# Web only
####
npm run web:dev
npm run web:build

####
# Android only
####
npm run android:build
npm run android:build:debug

# Install on a physical Android device over USB (pass adb serial after `--`)
adb devices
npm run android:install -- <device-id>
npm run android:install:debug -- <device-id>

# `android:install` builds the release variant for local sideloading and signs it with the debug keystore.
# Use your proper release signing setup for Play Store / distribution builds.


####
# Emulator.
####
# Prerequisites (host)
# - Hardware virtualization enabled in BIOS/UEFI
# - KVM available and accessible (`/dev/kvm` exists and is writable by your user)

# Requires entering emulator shell
nix develop .#emulator


# commands
npm run emulator:dev # starts dev emulator with live reloading!

npm run emulator:start # start emulator
npm run emulator:app:run # runs app in emulator
npm run emulator:logcat # logs
npm run emulator:nuke # nuke emulator
android-studio # open android studio

####
# Other useful stuff
####

# To view the browser console from the app in the emulator go to chrome on your computer and visit this page:
chrome://inspect/#devices
#
```
