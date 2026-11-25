#!/usr/bin/env bash
# Build and deploy "המסע של אורן" to Cloudflare Pages (project oren-game, KV binding SAVES).
# Needs network access to api.cloudflare.com with a token (Pages:Edit, Workers KV Storage:Edit, Account Settings:Read).
set -euo pipefail
cd "$(dirname "$0")/../.."          # oren2/
python3 build_talents.py            # index.html + cf/public/index.html
python3 cf/tools/make_worker.py     # cf/dist/_worker.js (site + save API in one file)
ACC="${CLOUDFLARE_ACCOUNT_ID:-4c3b50ff49c164a76d735099e5d0e932}"
curl -sS -X POST "https://api.cloudflare.com/client/v4/accounts/$ACC/pages/projects/oren-game/deployments" \
  ${CLOUDFLARE_API_TOKEN:+-H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"} \
  -F 'manifest={}' -F 'branch=main' -F '_worker.js=@cf/dist/_worker.js;filename=_worker.js;type=application/javascript+module' \
  | python3 -c "import sys,json;d=json.load(sys.stdin);print('ok' if d.get('success') else d.get('errors'),(d.get('result') or {}).get('url'))"
