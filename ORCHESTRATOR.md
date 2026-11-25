# Orchestrator handoff (read this first in a fresh main session)

You are the **orchestrator** (main session) for Oren's game. The owner talks only to you, in English, short.
Keep your own context small: do the work through the runner (herdr windows) or Sonnet subagents; read only short reports.

## Where things are
- Repo: `C:\work\Oren_study\a`. Remotes: `origin` = igalgerman/a (old, public), `new` = **igalgerman/oren_study** (private, the future home).
  Working branch today: `ccr-4b00e91b-b07vyx` on origin. **Move pending** (see Next).
- Rules: `CLAUDE.md`, `FLOW.md`. Owner guide: `HOWTO.md` (to be shortened to "just talk to the orchestrator").
- Backlog: GitHub issues in **igalgerman/oren_study** (#1–#11). Labels: lane `core`/`pack`/`review`, `bug`, `ready-for-agent`,
  `ready-for-human`, `needs-triage`, `in-progress`, `blocked`. Dependencies as a `Blocked by: #n` line in the body.
- Runner: `tools/runner/run.cmd <n>` (one issue now) or `run.cmd` (one pass over the ready queue). Opens herdr windows
  `run-<n>` → `issue-<n>` (worker, interactive Sonnet, owner can talk to it) → `review-<n>` → integrate (merge, build, full tests)
  → deploy if `.env` has `CLOUDFLARE_API_TOKEN` → pregen → closes the issue. The `run-<n>` window's exit note lands in your terminal.
  Config: `tools/runner/config.toml` (remote, branch, max_parallel=3, model, hc path). Not yet proven on a real issue.
- herdr CLI: `C:\Users\97254\AppData\Local\Programs\herdr-core\hc.exe` (`hc ls`, `hc read <t>`, `hc run --bg --name X claude ...`).
  Never touch the owner's other terminals.
- Panel mod: `tools/mods/oren-lanes` (loaded with --plugin-dir by `tools/orchestrator.cmd`; `/lanes` opens it).
- PC notes: `python3` = `/c/work/Oren_study/bin` shim (export PATH). Tests are muted (`tests/mute.js`, loaded by `tests/lib.js`).
  `worker` suite fails only on Windows (ESM c:\ path) — known, not a game bug. `activities`/`time-missions` flaky under load: rerun alone.

## The flow (agreed with the owner)
idea → `intake` herdr window (`/grill-me` → `/to-tickets`) → backlog → runner, 3 lanes (max 1 core) → review → merge to main → tests → deploy → one line to the owner.
- Bugs: same flow, label `bug`, no grilling, go first in the queue, worker writes a failing test first.
- Clear tasks (already specified) skip grilling. Fuzzy ideas get `/grill-me` in the `intake` window, not in your context.
- Deploy after every green merge (owner OK'd the flow). Never force-push. No secrets in chat.
- Open the intake window: `hc run --bg --name intake --cwd C:\work\Oren_study\a claude "/grill-me"`.

## State at handoff (25 Nov 2026)
- #1 batch A: was running as a subagent of the previous orchestrator. Check: `oren2/docs/STATUS.md` has a line
  "core: local — batch A" while it's running; when done, a commit "batch A" appears and the line is gone.
- Content-review report for batch A packs is inside issue #2.
- Owner still to do: put the token in `C:\work\Oren_study\a\.env`; #10 (voice spellings).

## Next
1. When batch A is merged on `ccr-4b00e91b-b07vyx` and tests are green: close #1.
2. Move: `git push new origin/ccr-4b00e91b-b07vyx:main`, then `git remote rename origin old && git remote rename new origin`,
   set `remote = "origin"` in tools/runner/config.toml, `git checkout -B main origin/main`. Update FLOW.md/HOWTO.md branch names to `main`. Tell the owner to point the cloud agent at oren_study.
3. Start the flow: `tools/runner/run.cmd` (picks #2 pack + #3 core in parallel). Watch the first real run closely (`hc read`), fix the runner if it breaks.
4. Shorten HOWTO.md to: "talk to the orchestrator; it does the rest".
