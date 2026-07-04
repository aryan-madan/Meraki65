# Keydeck for aryanworks Meraki

This app is the local WebHID configurator for the `aryanworks Meraki` keyboard firmware in this project.

## What it does

- Connects to the Meraki firmware over WebHID
- Reads and writes all four dynamic keymap layers
- Toggles the keyboard between Windows and Mac mode
- Resets the dynamic keymap back to firmware defaults
- Enables the firmware debug stream and highlights pressed matrix positions live

## Run it locally

1. Open a terminal in this `Software` folder
2. Install dependencies with `npm install`
3. Start the dev server with `npm run dev`
4. Open the shown local URL in Chrome or Edge

## Production build

Run `npm run build` to generate the static app in `dist/`.

## Notes

- The app expects the firmware USB IDs from this project: `VID 0xFEED`, `PID 0x6537`
- Live pressed-key highlighting requires firmware debug mode to be enabled from the app
- The firmware itself still logs full key press details to QMK console for deeper debugging
