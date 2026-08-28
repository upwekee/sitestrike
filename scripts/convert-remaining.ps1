Add-Type -AssemblyName System.Drawing

$allRenders = Get-ChildItem -Path "W:\300renders" -Filter "*.png"
foreach ($file in $allRenders) {
    $f = $file.Name
    $dst = "w:\sitestrike1\public\renders\" + $f
    if (!(Test-Path $dst)) {
        try {
            $img = [System.Drawing.Image]::FromFile($file.FullName)
            $w = [int]($img.Width * 0.35)
            $h = [int]($img.Height * 0.35)
            $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
            $g = [System.Drawing.Graphics]::FromImage($bmp)
            $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $g.DrawImage($img, 0, 0, $w, $h)
            $g.Dispose()
            $img.Dispose()
            $bmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
            $bmp.Dispose()
            Write-Host "Converted: $f"
        } catch {
            Write-Host "Error converting $f"
        }
    }
}
