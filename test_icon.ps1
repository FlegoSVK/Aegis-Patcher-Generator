
Add-Type -AssemblyName PresentationFramework
Add-Type -AssemblyName System.Drawing

$XAML = @"
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        Title="Icon Test" Height="200" Width="400">
    <Grid>
        <TextBlock Text="Extracting icon... Check if icon changes and no errors." Margin="20"/>
    </Grid>
</Window>
"@

$reader = (New-Object System.Xml.XmlNodeReader ([xml]$XAML))
$Form = [Windows.Markup.XamlReader]::Load($reader)

# Let's try to extract from powershell.exe itself
$exePath = (Get-Command powershell.exe).Source
try {
    $icon = [System.Drawing.Icon]::ExtractAssociatedIcon($exePath)
    $imageSource = [System.Windows.Interop.Imaging]::CreateBitmapSourceFromHIcon(
        $icon.Handle,
        [System.Windows.Int32Rect]::Empty,
        [System.Windows.Media.Imaging.BitmapSizeOptions]::FromEmptyOptions()
    )
    $Form.Icon = $imageSource
    Write-Host "Success loading icon"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# [void]$Form.ShowDialog()
