---
description: A clear task → issue in the backlog, then start the runner
argument-hint: "the task"
---
If the task is fuzzy (you'd need to ask more than one question), say so and suggest `/idea` instead.
Otherwise create a GitHub issue in igalgerman/oren_study: $ARGUMENTS
- Labels: `ready-for-agent` + one lane (`core` / `pack` / `review`, see FLOW.md). Add `Blocked by: #n` if it depends on an open issue.
- Start the runner: `tools/runner/run.cmd` (one pass over the ready queue).
Answer the owner in one line: issue number + what's running now.
