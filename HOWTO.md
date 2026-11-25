# How to work (owner's guide)

One **main** Claude window + up to **3 worker** windows. Tasks live as **GitHub issues** on igalgerman/a.
Workers never merge — only the main window does. Nothing goes to the website without your OK.

---

## 1. Add tasks  (main window)
Write your tasks in plain words, then type:
```
/to-tickets
```
→ Claude creates GitHub issues. Each one gets a lane label:
- `core` — changes the core. **Only one at a time.**
- `pack` — inside one pack. Many at once.
- `review` — read-only check. Many at once.

Only you run `/to-tickets` (or `/triage`). Skills never open issues by themselves.
Not sure what you want yet? Type `/grill-me` first — Claude asks you questions until the task is clear.

## 2. Start a worker  (new terminal per issue)
```
cd C:\work\Oren_study\a
bash tools/lane.sh 42
cd ..\wt-42
claude
```
Inside that window:
```
/implement #42
```
Pick only issues labelled `ready-for-agent`. Never two `core` issues at the same time.

## 3. When a worker says "done"
Tell the main window:
```
integrate lane/42
```
Main runs `tools/integrate.sh`: merge → build → all tests → push only if green → closes the issue.
If a test fails, the issue goes back to the worker.

## 4. Stopping halfway
In the worker window type `/handoff` before closing — the next window continues from there.

## 5. Publish to the website
Only when you say so, in the main window: "deploy" (needs your CLOUDFLARE_API_TOKEN).

---

## Cheat sheet
| I want to… | Where | Type |
|---|---|---|
| add tasks | main | describe them, then `/to-tickets` |
| make a fuzzy idea clear | main | `/grill-me` |
| sort incoming issues | main | `/triage` |
| work on issue 42 | new terminal | `bash tools/lane.sh 42`, `claude`, `/implement #42` |
| fix a bug properly | worker | `/diagnosing-bugs` |
| test-first work | worker | `/tdd` |
| merge finished work | main | `integrate lane/42` |
| pause a worker | worker | `/handoff` |
| see what's open | anywhere | `gh issue list` |
| clean up a finished worktree | main | `git worktree remove ../wt-42` |

**Max 3 workers** — this PC gets slow and tests get flaky with more.
Rules for Claude are in `FLOW.md`.
