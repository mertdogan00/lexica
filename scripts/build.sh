#!/usr/bin/env bash
set -euo pipefail

# =============================================
# Absolute path setup
# =============================================
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
BIN_DIR="$ROOT_DIR/node_modules/.bin"

# =============================================
# Required binaries
# =============================================
if [ ! -x "$BIN_DIR/vite" ] || [ ! -x "$BIN_DIR/javascript-obfuscator" ]; then
  echo "Missing local build dependencies. Run npm install before building."
  exit 1
fi

# =============================================
# Clean dist
# =============================================
echo "▶ Cleaning dist directory..."
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# =============================================
# Build with Vite
# =============================================
echo "▶ Building with Vite..."
"$BIN_DIR/vite" build

# =============================================
# Obfuscate JavaScript bundles
# =============================================
echo "▶ Obfuscating JavaScript bundles..."
"$BIN_DIR/javascript-obfuscator" "$DIST_DIR/assets" \
  --output "$DIST_DIR/assets" \
  --compact true \
  --target browser-no-eval \
  --ignore-imports true \
  --string-array true \
  --string-array-threshold 0.6 \
  --string-array-encoding base64 \
  --disable-console-output true \
  --split-strings true \
  --split-strings-chunk-length 15 \
  --rename-globals false \
  --identifier-names-generator hexadecimal \
  --dead-code-injection false \
  --control-flow-flattening false \
  --numbers-to-expressions false \
  >/dev/null

echo "✔ Build completed: $DIST_DIR"
