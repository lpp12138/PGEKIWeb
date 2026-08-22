# Firmware assets

Each public application firmware release lives in its own semantic-versioned directory and is registered in `manifest.json`.

To publish a release at or after `1.0.0`:

1. Copy the ESP application `.bin` to `firmware/<version>/`.
2. Add its version, relative path, byte size, and lowercase SHA-256 to `manifest.json`.
3. Keep the image at or below 2 MiB. The Web updater rejects malformed entries and verifies repository assets before OTA.
