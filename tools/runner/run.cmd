@echo off
rem run.cmd 42 = run issue 42 now; run.cmd = one pass over the ready queue; add --dry-run to only print the plan.
"C:\Users\97254\miniforge3\python.exe" "%~dp0runner.py" %*
