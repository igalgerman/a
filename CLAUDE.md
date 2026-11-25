# Working rules for this repo (Oren's games)

## Simplicity first
- Keep everything simple. Do not complicate things that don't need it.
- Do not add a feature, option, button or setting unless it was asked for or is clearly needed. No features "just to add".
- Prefer removing over adding. Fewer buttons, fewer choices, uncluttered screens.
- One clear main action per screen for Oren (age 6-7, new to computers, very smart).
- When unsure whether something is needed — ask, or leave it out.

## Language
- Talk to the user in Hebrew.
- Kid-facing text in Hebrew with correct nikud; parent-facing text can be without nikud.

## Content
- Original characters and art only (no copyrighted characters/brands, even if Oren likes them).

## Project layout
- `oren2/` — the main game. Edit `talents.js`, `talents.css`, `arcade.js`, `arcade.css` and the core in `index.html`, then run `python3 build_talents.py` (injects the parts into `index.html` and writes `cf/public/index.html`).
- Tests: `oren2/tests/run.sh` (all suites, in parallel). Run before every publish.
- Publish: the Claude artifact from `oren2/index.html`; the website via `oren2/cf/tools/deploy.sh` (Cloudflare Pages, project `oren-game`).
- Voice: after pregen, run `node oren2/cf/tools/voicecheck.js` so new sentences are pronunciation-checked (parent picks spellings at https://oren-game.pages.dev/api/tts/listen; results at /api/tts/review).
- Game voice is fixed: Google he-IL-Chirp3-HD-Kore at 0.9. After adding/changing missions or kid text, run `node oren2/cf/tools/pregen.js` after deploy so all audio exists in advance (resumable, ~700 new sentences/day).
