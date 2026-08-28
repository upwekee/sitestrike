Add-Type -AssemblyName System.Drawing

$files = @("tgirl.png", "tlok.png", "tback.png", "tpro.png", "2ter.png", "profi.png", "red1.png")
foreach ($f in $files) {
    $src = "W:\300renders\" + $f
    $dst = "w:\sitestrike1\public\renders\" + $f
    if (Test-Path $src) {
        $img = [System.Drawing.Image]::FromFile($src)
        $w = [int]($img.Width * 0.45)
        $h = [int]($img.Height * 0.45)
        $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.DrawImage($img, 0, 0, $w, $h)
        $g.Dispose()
        $img.Dispose()
        $bmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
        Write-Host "Converted: $f -> $((Get-Item $dst).Length / 1KB) KB"
    }
}
