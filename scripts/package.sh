#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
version=$(node -p "require('./manifest.json').version")
mkdir -p dist
archive="dist/remove-chatgpt-footer-$version.zip"
# Remove any previous archive so stale entries cannot survive a rebuild.
rm -f "$archive"
zip -X "$archive" manifest.json content.css \
  icons/icon16.png icons/icon32.png icons/icon48.png icons/icon128.png
