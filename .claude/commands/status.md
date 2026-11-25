---
description: One-screen status: running windows, backlog, blocked, last deploy
---
Collect, keep it short:
- `"C:\Users\97254\AppData\Local\Programs\herdr-core\hc.exe" ls` → windows named run-*/issue-*/review-*/intake-* and their state.
- `gh issue list -R igalgerman/oren_study --state open --json number,title,labels` → group: running (in-progress), ready, waiting (Blocked by open issue), blocked, needs owner (ready-for-human).
- `tail -3 tools/runner/.runs/runner.log` if it exists.
Answer in ≤8 lines. End with what needs the owner, if anything.
