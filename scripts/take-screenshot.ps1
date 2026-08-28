$browser = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (!(Test-Path $browser)) {
    $browser = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}
if (!(Test-Path $browser)) {
    $browser = "C:\Program Files\Google\Chrome\Application\chrome.exe"
}

$outPath = "w:\sitestrike1\screenshot.png"
if (Test-Path $outPath) { Remove-Item $outPath -Force }

Start-Process -FilePath $browser -ArgumentList "--headless=new", "--disable-gpu", "--hide-scrollbars", "--window-size=1600,1100", "--virtual-time-budget=3000", "--screenshot=$outPath", "http://localhost:8443" -Wait

if (Test-Path $outPath) {
    Write-Host "Screenshot saved successfully: $((Get-Item $outPath).Length) bytes"
} else {
    Write-Host "Failed to save screenshot"
}
