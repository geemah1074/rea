# Starts the Marquee player automatically when this Windows user signs in,
# and keeps the PC from sleeping or turning the display off while plugged in.
# Run from PowerShell in this folder:  powershell -ExecutionPolicy Bypass -File .\install-autostart.ps1
# Undo: delete "Marquee Player.lnk" from the Startup folder (Win+R, shell:startup).

$ErrorActionPreference = 'Stop'
$cmd = Join-Path $PSScriptRoot 'start-player.cmd'
if (-not (Test-Path $cmd)) { throw "start-player.cmd not found next to this script." }
if ((Get-Content $cmd -Raw) -match 'YOUR-SITE') {
  throw "Edit start-player.cmd first: set PLAYER_URL to your player address."
}

$startup = [Environment]::GetFolderPath('Startup')
$shell = New-Object -ComObject WScript.Shell
$link = $shell.CreateShortcut((Join-Path $startup 'Marquee Player.lnk'))
$link.TargetPath = $cmd
$link.WorkingDirectory = $PSScriptRoot
$link.WindowStyle = 7  # minimized console window
$link.Save()
Write-Host "Added Marquee Player to Startup: $startup"

# Plugged-in power settings: never sleep, never turn off the display.
powercfg /change standby-timeout-ac 0
powercfg /change monitor-timeout-ac 0
Write-Host "Set this PC to stay awake with the display on while plugged in."
Write-Host "Tip: to sign in automatically after a reboot, see 'Windows PC as a screen' in README.md."
