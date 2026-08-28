Add-Type -AssemblyName System.Drawing
$dest = "w:\sitestrike1\public\renders"
if (!(Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest | Out-Null
}

$allFiles = Get-ChildItem "W:\300renders" -Filter "*.png"

foreach ($file in $allFiles) {
    $f = $file.Name
    $dstPath = Join-Path $dest $f
    if (!(Test-Path $dstPath)) {
        Write-Host "Processing $f ..."
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        $maxH = 1400
        if ($img.Height -gt $maxH) {
            $newW = [int]($img.Width * ($maxH / $img.Height))
            $newH = $maxH
        } else {
            $newW = $img.Width
            $newH = $img.Height
        }
        $bmp = New-Object System.Drawing.Bitmap($newW, $newH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.DrawImage($img, 0, 0, $newW, $newH)
        $g.Dispose()
        $img.Dispose()
        $bmp.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        $size = (Get-Item $dstPath).Length / 1KB
        Write-Host "Saved $f ($([int]$size) KB)"
    }
}
