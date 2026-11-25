# בדיקות — המסע של אורן

בדיקות אוטומטיות שמריצות את המשחק בדפדפן אמיתי (Playwright) ובודקות שהכל עובד: חשבון, כל הפעילויות, לוח ההורים, הארקייד, סנכרון בין מכשירים והשרת של Cloudflare.
כל החבילות רצות במקביל, בערך דקה וחצי.

## Run

```bash
oren2/tests/run.sh            # build + all suites in parallel (~90s), non-zero exit on failure
FULL=1 oren2/tests/run.sh     # also the slow full play-through of every world (desktop + phone)
SHOTS=1 oren2/tests/run.sh    # also save screenshots to tests/.tmp/shots/
JOBS=4 oren2/tests/run.sh     # limit parallel browsers (default 6)
node oren2/tests/arcade.test.js phone   # one suite; desktop|phone variant where supported
```

Logs: `tests/.tmp/logs/<suite>.log`. Every suite prints `PASS …` / `FAIL …` lines and a final `RESULT <name> <pass> <fail>`.
Needs Node and the `playwright` package with Chromium (no npm install inside the repo).

## Suites

| file | covers |
|---|---|
| math-logic | every generated math question (many samples per level): answers, step lines, hints, options, clocks, column math |
| edge-cases | real-speed level transitions, blocked localStorage, old-save migration, cloud merge rules, key spam, timers, reduced motion, save size |
| regressions | kingdom → badges button, avatar default look + one-time migration, cap hat rendering |
| activities | opens and finishes all ~47 Talents City activities through test hooks; all 15 code-robot levels solvable |
| parent (desktop/phone) | users + parent password, permissions, parts on/off, gradual unlock, skip/reset, messages, badges, daily plan, home, full reset |
| time-missions | today's missions control, daily template, screen-time limit, 5-minute warning, lock screen, bedtime |
| sandbox-voice (desktop/phone) | parent "play as parent" sandbox with its own save + skip bar, voice check |
| entry | start screen Oren / parent buttons, parent choice (panel or play) |
| arcade (desktop/phone) | all arcade cabinets, tickets, records, prize counter, real clicks |
| family-sync | website mode: two devices, family code link, settings/progress sync through a fake `/api/save` |
| worker | the Cloudflare `_worker.js` bundle: page, icons, manifest, save API (GET/PUT/400/404/405/413) |
| playthrough (FULL=1) | plays every world level by level on a viewport, extras, layout overflow |
