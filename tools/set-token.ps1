# Saves the Cloudflare deploy token into .env and checks it works. Run: double-click tools\set-token.cmd
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root '.env'
$acc = '4c3b50ff49c164a76d735099e5d0e932'

Write-Host ''
Write-Host 'Step 1: the Cloudflare page opens in your browser.' -ForegroundColor Cyan
Write-Host '  Create Token -> Custom token "Get started" -> name: oren-game-deploy'
Write-Host '  Add 3 permissions (Account):'
Write-Host '     Cloudflare Pages        -> Edit'
Write-Host '     Workers KV Storage      -> Edit'
Write-Host '     Account Settings        -> Read'
Write-Host '  Continue to summary -> Create Token -> Copy'
Start-Process 'https://dash.cloudflare.com/profile/api-tokens'
Write-Host ''
$sec = Read-Host 'Step 2: paste the token here and press Enter (it stays hidden)' -AsSecureString
$tok = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)).Trim()
if (-not $tok) { Write-Host 'Nothing pasted. Run me again.' -ForegroundColor Red; pause; exit 1 }

Write-Host 'Step 3: checking the token...' -ForegroundColor Cyan
$h = @{ Authorization = "Bearer $tok" }
try {
  $v = Invoke-RestMethod -Headers $h 'https://api.cloudflare.com/client/v4/user/tokens/verify'
  if (-not $v.success) { throw 'not valid' }
  $p = Invoke-RestMethod -Headers $h "https://api.cloudflare.com/client/v4/accounts/$acc/pages/projects/oren-game"
  if (-not $p.success) { throw 'no access to the oren-game project' }
} catch {
  Write-Host "The token does not work: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host 'Check the 3 permissions and that "Account Resources" includes your account, then run me again.'
  pause; exit 1
}
Set-Content -Path $envFile -Encoding ascii -Value @(
  '# Secrets for deploying Oren''s game. NOT in git. Never paste in chat.',
  "CLOUDFLARE_API_TOKEN=$tok")
Write-Host 'Done! The token works and is saved. You can close this window.' -ForegroundColor Green
pause
