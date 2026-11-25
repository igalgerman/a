---
description: Take the last change off the site (revert the last merge on main, test, redeploy)
---
Show the owner the last merge commit on main (one line) and ask for a yes. On yes: `git revert -m 1 <merge>` on main, build, `JOBS=4 oren2/tests/run.sh`, push, deploy (`oren2/cf/tools/deploy.sh` with the token from .env), reopen the issue with a comment. One line back.
