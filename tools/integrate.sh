#!/usr/bin/env bash
# Integrator: merge one lane into the integration branch, rebuild, test, push.  tools/integrate.sh lane/<name> [integration-branch=main]   (remote: $REMOTE, default origin; RUNNER=1 = caller closes the issue)
set -uo pipefail
lane="${1:?lane branch}"; into="${2:-main}"; remote="${REMOTE:-origin}"
root="$(git rev-parse --show-toplevel)"; cd "$root"
export PATH=/c/work/Oren_study/bin:$PATH
[ -z "$(git status --porcelain --untracked-files=no)" ] || { echo "working tree not clean"; exit 1; }
git fetch -q "$remote" && git checkout -q "$into" && git pull -q --ff-only "$remote" "$into" || exit 1
BUILT="oren2/index.html oren2/cf/public/index.html"
if ! git merge --no-ff --no-commit "$remote/$lane"; then
  left=$(git diff --name-only --diff-filter=U | grep -vxF -e oren2/index.html -e oren2/cf/public/index.html)
  if [ -n "$left" ]; then echo "CONFLICTS (fix by hand, or send back to the lane):"; echo "$left"; exit 2; fi
  git checkout --ours -- $BUILT
fi
(cd oren2 && python3 build_talents.py >/dev/null) || { echo "build failed"; exit 3; }
git add $BUILT
(cd oren2 && JOBS="${JOBS:-4}" bash tests/run.sh) || { echo "TESTS FAILED: merge left uncommitted; rerun a flaky suite alone, or 'git merge --abort'"; exit 4; }
git commit -qm "Integrate $lane

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" && git push -q "$remote" "$into" && echo "integrated $lane into $into" || { echo "commit/push failed"; exit 5; }
n="${lane#lane/}"; if [ -z "${RUNNER:-}" ] && [[ "$n" =~ ^[0-9]+$ ]]; then gh issue close "$n" --comment "Integrated into $into ($(git rev-parse --short HEAD)), all tests green." && echo "closed #$n"; fi
