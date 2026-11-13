@echo off
rem Marquee player in full-screen kiosk mode using Microsoft Edge (built into Windows 10/11).
rem 1. Replace the address below with your player address (your Cloudflare Pages site + /player/).
rem 2. Double-click to test. Press Alt+F4 to exit kiosk mode.
set PLAYER_URL=https://YOUR-SITE.pages.dev/player/

rem Edge needs its own profile folder so kiosk mode does not touch your normal browsing.
set PROFILE=%LOCALAPPDATA%\MarqueePlayer
start "" "msedge.exe" --kiosk "%PLAYER_URL%" --edge-kiosk-type=fullscreen --no-first-run --user-data-dir="%PROFILE%" --autoplay-policy=no-user-gesture-required
