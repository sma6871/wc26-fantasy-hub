#!/usr/bin/env bash
# Compiles src/app.jsx into a single self-contained index.html (React via CDN, no runtime build).
# Usage: ./build.sh
set -euo pipefail
cd "$(dirname "$0")"

echo "Bundling src/app.jsx ..."
npx -y esbuild src/app.jsx \
  --loader:.jsx=jsx \
  --bundle \
  --format=iife \
  --jsx=transform \
  --external:react \
  --external:react-dom \
  --minify \
  --outfile=app.bundle.js

echo "Assembling index.html ..."
cat > index.html <<'HTML_HEAD'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<meta name="theme-color" content="#16a34a"/>
<title>WC26 Fantasy Hub</title>
<meta name="description" content="Unofficial World Cup 2026 fantasy planner: all 48 teams, projected points, starting-XI odds, set-piece takers and a squad builder with the official rules."/>
<link rel="manifest" href="data:application/json,%7B%22name%22%3A%22WC26%20Fantasy%20Hub%22%2C%22short_name%22%3A%22WC26%22%2C%22start_url%22%3A%22.%22%2C%22display%22%3A%22standalone%22%2C%22background_color%22%3A%22%23f6f6f3%22%2C%22theme_color%22%3A%22%2316a34a%22%7D"/>
<style>html,body,#root{height:100%}body{margin:0;background:#f6f6f3}</style>
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
</head>
<body>
<div id="root"></div>
<script>
HTML_HEAD

cat app.bundle.js >> index.html
printf '\n</script>\n</body>\n</html>\n' >> index.html
rm -f app.bundle.js

echo "Done. Wrote index.html ($(wc -c < index.html) bytes)."
echo "Commit index.html and push; Vercel redeploys automatically."
