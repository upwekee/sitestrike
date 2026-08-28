Add-Type -AssemblyName System.Drawing

$src = "C:\Users\admin\.gemini\antigravity\brain\23f01a5d-861a-4e45-94bc-9090a5b438cf\.user_uploaded\media_1787895044466.jpg"
$img = [System.Drawing.Image]::FromFile($src)
Write-Host "Width: $($img.Width), Height: $($img.Height)"

# In 1024x683, the right hero portal is located at X: 450, Y: 0, Width: 574, Height: 345
$cropRect = New-Object System.Drawing.Rectangle(450, 0, ($img.Width - 450), 345)
$bmp = New-Object System.Drawing.Bitmap($cropRect.Width, $cropRect.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $bmp.Width, $bmp.Height)), $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$img.Dispose()

$dst = "w:\sitestrike1\public\renders\hero-portal-exact.png"
$bmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Saved exact hero portal crop to $dst"
