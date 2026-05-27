param()
Add-Type -AssemblyName PresentationFramework
Add-Type -AssemblyName System.Windows.Forms

$ErrorActionPreference = "Stop"

try {
    $bannerPath = Join-Path $PSScriptRoot "Assets\\banner.jpg"
    $ValidationPath = '${psValidationPath}'
    $InstallRelativePath = '${psInstallRelativePath}'
    $AppTranslationLink = '${psLink}'
    $AppAuthorLink = '${psAuthorLink}'

    $XAML = @"
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="${scriptInstallerTitle}" Height="460" Width="540"
        WindowStartupLocation="CenterScreen"
        WindowStyle="None"
        AllowsTransparency="True"
        Background="Transparent"
        ResizeMode="NoResize">
    <Border CornerRadius="12" Background="#111111">
        <Border.Clip>
            <RectangleGeometry RadiusX="12" RadiusY="12" Rect="0,0,540,460"/>
        </Border.Clip>
        <Grid>
            <Grid.RowDefinitions>
                <RowDefinition Height="140"/>
                <RowDefinition Height="*"/>
            </Grid.RowDefinitions>
            
            <Image Name="BannerImage" Stretch="UniformToFill" Grid.Row="0" ${fullWindowBackground ? 'Grid.RowSpan="2"' : ''}/>
            <!-- To match the gradient overlay, we can add a rectangle over the image -->
            <Rectangle Grid.Row="0" ${fullWindowBackground ? 'Grid.RowSpan="2"' : ''}>
                <Rectangle.Fill>
                    <LinearGradientBrush StartPoint="0,0" EndPoint="0,1">
                        <GradientStop Color="#00111111" Offset="0.0"/>
                        <GradientStop Color="${fullWindowBackground ? '#EE111111' : '#FF111111'}" Offset="${fullWindowBackground ? '0.6' : '1.0'}"/>
                    </LinearGradientBrush>
                </Rectangle.Fill>
            </Rectangle>

            <Button Name="CloseButtonTop" Content="✕" HorizontalAlignment="Right" VerticalAlignment="Top" Margin="10" Width="30" Height="30" Background="#44000000" Foreground="${eColorMain}" BorderThickness="0" FontSize="14" Cursor="Hand" Grid.Row="0"/>
            
            <StackPanel Grid.Row="1" Margin="30,20,30,20" Background="Transparent">
            <Grid Margin="0,0,0,20">
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="*"/>
                    <ColumnDefinition Width="Auto"/>
                </Grid.ColumnDefinitions>
                <StackPanel Grid.Column="0">
                    <TextBlock Text="${scriptInstallerTitle}" FontSize="18" FontWeight="Light" Foreground="${eColorMain}" Margin="0,0,0,4" TextWrapping="Wrap"/>
                    <StackPanel Orientation="Horizontal" Margin="0,0,0,2">
                        <TextBlock Text="${t.scriptAuthor} " FontSize="12" Foreground="${eColorSecondary}"/>
                        <TextBlock Name="AuthorLink" Text="${eAuthor}" FontSize="12" Foreground="${eColorMain}" TextDecorations="Underline" Cursor="Hand"/>
                    </StackPanel>
                    <TextBlock Text="${t.scriptForGameVersion} ${eGameVersion}" FontSize="12" Foreground="${eColorSecondary}" Margin="0,0,0,4"/>
                    <TextBlock Name="WebLink" Text="${t.scriptTranslationPage}" TextDecorations="Underline" Foreground="${eColorMain}" FontSize="12" Cursor="Hand"/>
                    <StackPanel Orientation="Horizontal" Margin="0,4,0,0">
                        <TextBlock Name="SupportLink" Text="${eSupportText}" TextDecorations="Underline" Foreground="${eColorMain}" FontSize="11" Margin="0,0,10,0" Cursor="Hand"/>
                        <TextBlock Name="ChangelogLink" Text="${t.scriptShowNews}" TextDecorations="Underline" Foreground="${eColorMain}" FontSize="11" Cursor="Hand"/>
                    </StackPanel>
                </StackPanel>
                <Border Grid.Column="1" Background="#4C3E4B37" BorderBrush="#3E4B37" BorderThickness="1" CornerRadius="4" Padding="8,4" VerticalAlignment="Top">
                    <TextBlock Text="${eTranVersion}" FontSize="10" Foreground="${eColorMain}"/>
                </Border>
            </Grid>
            
            <StackPanel Orientation="Horizontal" Margin="0,0,0,5">
                <TextBlock Text="${t.scriptGamePath}" FontSize="12" Foreground="${eColorSecondary}"/>
                <TextBlock Text="(${t.scriptValidation}: ${eValidationPath})" FontSize="10" Foreground="#4A5A40" Margin="8,2,0,0" FontStyle="Italic"/>
            </StackPanel>
            <Grid>
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="*"/>
                    <ColumnDefinition Width="Auto"/>
                </Grid.ColumnDefinitions>
                <TextBox Name="PathTextBox" Grid.Column="0" Height="32" FontSize="12" VerticalContentAlignment="Center" Background="#222222" Foreground="${eColorMain}" BorderBrush="#333333" BorderThickness="1" Padding="8,0,8,0"/>
                <Button Name="BrowseButton" Content="${t.scriptBrowse}" Grid.Column="1" Width="100" Margin="10,0,0,0" Background="Transparent" Foreground="${eColorMain}" BorderBrush="#333333" BorderThickness="1" Cursor="Hand" FontSize="11" Height="32"/>
            </Grid>
            
            <Grid Margin="0,20,0,5">
                <TextBlock Name="StatusText" Text="${t.scriptReady}" Foreground="${eColorSecondary}" FontSize="10" TextWrapping="NoWrap" HorizontalAlignment="Left"/>
                <TextBlock Name="ProgressPercent" Text="0%" Foreground="${eColorSecondary}" FontSize="10" HorizontalAlignment="Right"/>
            </Grid>
            <ProgressBar Name="InstallProgress" Height="6" Minimum="0" Maximum="100" Background="#222222" Foreground="#3E4B37" BorderThickness="0" Margin="0,0,0,20" IsIndeterminate="False"/>
            
            <StackPanel Orientation="Horizontal" HorizontalAlignment="Right">
                <Button Name="UninstallButton" Content="${t.scriptUninstall}" Width="100" Height="32" Margin="0,0,10,0" Background="#993333" Foreground="${eColorMain}" BorderThickness="0" FontSize="12" FontWeight="Bold" Cursor="Hand" Visibility="Collapsed"/>
                <Button Name="CloseButton" Content="${t.scriptClose}" Width="100" Height="32" Margin="0,0,10,0" Background="Transparent" Foreground="${eColorMain}" BorderBrush="#333333" BorderThickness="1" FontSize="12" Cursor="Hand"/>
                <Button Name="InstallButton" Content="${t.scriptInstall}" Width="140" Height="32" Background="#3E4B37" Foreground="${eColorMain}" BorderThickness="0" FontSize="12" FontWeight="Bold" Cursor="Hand"/>
            </StackPanel>
        </StackPanel>

        <Grid Name="QrOverlay" Visibility="Collapsed" Background="#CC000000" Grid.Row="0" Grid.RowSpan="2">
            <Border Background="#1A1A1A" BorderBrush="#3E4B37" BorderThickness="1" CornerRadius="8" Margin="40" Padding="20" HorizontalAlignment="Center" VerticalAlignment="Center">
                <StackPanel>
                    <TextBlock Text="${t.scriptSupportTitle}" FontSize="16" FontWeight="Bold" Foreground="${eColorMain}" Margin="0,0,0,15" HorizontalAlignment="Center"/>
                    <Image Name="QrImage" Width="200" Height="200" Stretch="Uniform" Margin="0,0,0,20"/>
                    <Button Name="CloseQrButton" Content="${t.scriptClose}" Width="100" Height="30" Background="#3E4B37" Foreground="#F5F7F2" BorderThickness="0" FontSize="12" FontWeight="Bold" Cursor="Hand" HorizontalAlignment="Center"/>
                </StackPanel>
            </Border>
        </Grid>

        <Grid Name="ChangelogOverlay" Visibility="Collapsed" Background="#CC000000" Grid.Row="0" Grid.RowSpan="2">
            <Border Background="#1A1A1A" BorderBrush="#3E4B37" BorderThickness="1" CornerRadius="8" Margin="40" Padding="20" MaxWidth="440" MaxHeight="300" HorizontalAlignment="Center" VerticalAlignment="Center">
                <Grid>
                    <Grid.RowDefinitions>
                        <RowDefinition Height="Auto"/>
                        <RowDefinition Height="*"/>
                        <RowDefinition Height="Auto"/>
                    </Grid.RowDefinitions>
                    <TextBlock Text="${t.scriptNewsTitle}" FontSize="16" FontWeight="Bold" Foreground="${eColorMain}" Margin="0,0,0,15" Grid.Row="0"/>
                    <ScrollViewer Grid.Row="1" VerticalScrollBarVisibility="Auto" Margin="0,0,0,15">
                        <TextBlock Text="${eChangelog}" Foreground="${eColorSecondary}" FontSize="12" TextWrapping="Wrap"/>
                    </ScrollViewer>
                    <Button Name="CloseChangelogButton" Content="${t.scriptClose}" Width="100" Height="30" Background="#3E4B37" Foreground="#F5F7F2" BorderThickness="0" FontSize="12" FontWeight="Bold" Cursor="Hand" HorizontalAlignment="Right" Grid.Row="2"/>
                </Grid>
            </Border>
        </Grid>

        </Grid>
    </Border>
</Window>
"@

    $reader = (New-Object System.Xml.XmlNodeReader ([xml]$XAML))
    $Form = [Windows.Markup.XamlReader]::Load($reader)

    $BannerImage = $Form.FindName("BannerImage")
    if ($BannerImage -and (Test-Path $bannerPath)) {
        try {
            $uri = New-Object System.Uri($bannerPath)
            $BannerImage.Source = New-Object System.Windows.Media.Imaging.BitmapImage -ArgumentList $uri
        } catch { }
    }

    $Form.Add_MouseLeftButtonDown({
        param($sender, $e)
        try {
            if ($e.LeftButton -eq [System.Windows.Input.MouseButtonState]::Pressed) {
                $Form.DragMove()
            }
        } catch { }
    })

    $PathTextBox = $Form.FindName("PathTextBox")
    $BrowseButton = $Form.FindName("BrowseButton")
    $InstallButton = $Form.FindName("InstallButton")
    $UninstallButton = $Form.FindName("UninstallButton")
    $CloseButtonTop = $Form.FindName("CloseButtonTop")
    $CloseButton = $Form.FindName("CloseButton")
    $StatusText = $Form.FindName("StatusText")
    $InstallProgress = $Form.FindName("InstallProgress")
    $ProgressPercent = $Form.FindName("ProgressPercent")
    $WebLink = $Form.FindName("WebLink")
    $AuthorLink = $Form.FindName("AuthorLink")
    $SupportLink = $Form.FindName("SupportLink")
    $ChangelogLink = $Form.FindName("ChangelogLink")
    $QrOverlay = $Form.FindName("QrOverlay")
    $QrImage = $Form.FindName("QrImage")
    $CloseQrButton = $Form.FindName("CloseQrButton")
    $ChangelogOverlay = $Form.FindName("ChangelogOverlay")
    $CloseChangelogButton = $Form.FindName("CloseChangelogButton")

    ${steamAppId ? `
    # Auto-detect game path via Steam App ID
    $steamId = "${steamAppId.trim()}"
    if (-not [string]::IsNullOrWhiteSpace($steamId)) {
        $foundPath = ""
        
        # 1. Try registry Uninstall keys direct path
        $regKeys = @(
            "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Steam App $steamId",
            "HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Steam App $steamId",
            "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Steam App $steamId",
            "HKCU:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Steam App $steamId"
        )
        foreach ($key in $regKeys) {
            if (Test-Path $key) {
                $installLoc = (Get-ItemProperty -Path $key -Name "InstallLocation" -ErrorAction SilentlyContinue).InstallLocation
                if (-not [string]::IsNullOrWhiteSpace($installLoc) -and (Test-Path $installLoc)) {
                    $foundPath = $installLoc
                    break
                }
            }
        }

        # 2. If registry direct path not found or empty (common for many Steam games like Hollow Knight), query Steam library folders
        if ([string]::IsNullOrWhiteSpace($foundPath)) {
            $steamPaths = @()
            
            # Find Steam install path from Registry
            $hcuSteam = (Get-ItemProperty -Path "HKCU:\\Software\\Valve\\Steam" -Name "SteamPath" -ErrorAction SilentlyContinue).SteamPath
            if (-not [string]::IsNullOrWhiteSpace($hcuSteam)) { $steamPaths += $hcuSteam.Replace("/", "\\") }
            
            $hklmSteam = (Get-ItemProperty -Path "HKLM:\\SOFTWARE\\Valve\\Steam" -Name "InstallPath" -ErrorAction SilentlyContinue).InstallPath
            if (-not [string]::IsNullOrWhiteSpace($hklmSteam)) { $steamPaths += $hklmSteam }
            
            $hklmSteamWow = (Get-ItemProperty -Path "HKLM:\\SOFTWARE\\WOW6432Node\\Valve\\Steam" -Name "InstallPath" -ErrorAction SilentlyContinue).InstallPath
            if (-not [string]::IsNullOrWhiteSpace($hklmSteamWow)) { $steamPaths += $hklmSteamWow }

            # Common default installation spots
            $steamPaths += "C:\\Program Files (x86)\\Steam"
            $steamPaths += "C:\\Program Files\\Steam"

            # Unique non-empty valid directories
            $steamPaths = $steamPaths | Select-Object -Unique | Where-Object { -not [string]::IsNullOrWhiteSpace($_) -and (Test-Path $_) }

            foreach ($sp in $steamPaths) {
                $vdfPath = Join-Path $sp "steamapps\\libraryfolders.vdf"
                if (Test-Path $vdfPath) {
                    $vdfContent = Get-Content -Path $vdfPath -Raw -ErrorAction SilentlyContinue
                    if ($vdfContent) {
                        # Extract all "path" lines e.g. "path" "D:\\SteamLibrary"
                        $matches = [regex]::Matches($vdfContent, '"path"\\s+"([^"]+)"')
                        foreach ($m in $matches) {
                            $libPath = $m.Groups[1].Value.Replace("\\\\", "\\")
                            if (Test-Path $libPath) {
                                # Check if appmanifest file exists for this game ID
                                $acfPath = Join-Path $libPath "steamapps\\appmanifest_$steamId.acf"
                                if (Test-Path $acfPath) {
                                    $acfContent = Get-Content -Path $acfPath -Raw -ErrorAction SilentlyContinue
                                    if ($acfContent -and ($acfContent -match '"installdir"\\s+"([^"]+)"')) {
                                        $installDirName = $Matches[1]
                                        $expectedGamePath = Join-Path $libPath "steamapps\\common\\$installDirName"
                                        if (Test-Path $expectedGamePath) {
                                            $foundPath = $expectedGamePath
                                            break
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (-not [string]::IsNullOrWhiteSpace($foundPath)) { break }
            }
        }

        # Apply found path if valid
        if (-not [string]::IsNullOrWhiteSpace($foundPath) -and (Test-Path $foundPath)) {
            $PathTextBox.Text = $foundPath
        }
    }
    ` : ''}

    $qrPath = Join-Path $PSScriptRoot "Assets\\qrcode.jpg"
    if ($QrImage -and (Test-Path $qrPath)) {
        try {
            $uri = New-Object System.Uri($qrPath)
            $QrImage.Source = New-Object System.Windows.Media.Imaging.BitmapImage -ArgumentList $uri
        } catch { }
    } else {
        if ($SupportLink) { $SupportLink.Visibility = "Collapsed" }
    }

    if ($SupportLink) {
        $SupportLink.Add_MouseLeftButtonDown({
            param($sender, $e)
            if ($QrOverlay) {
                $QrOverlay.Visibility = "Visible"
            }
        })
        $SupportLink.Add_MouseEnter({
            $SupportLink.Foreground = "${eColorSecondary}"
        })
        $SupportLink.Add_MouseLeave({
            $SupportLink.Foreground = "${eColorMain}"
        })
    }
    
    if ($CloseQrButton) {
        $CloseQrButton.Add_Click({
            if ($QrOverlay) {
                $QrOverlay.Visibility = "Collapsed"
            }
        })
    }

    if ([string]::IsNullOrWhiteSpace("${eChangelog}")) {
        if ($ChangelogLink) { $ChangelogLink.Visibility = "Collapsed" }
    } elseif ($ChangelogLink) {
        $ChangelogLink.Add_MouseLeftButtonDown({
            param($sender, $e)
            if ($ChangelogOverlay) {
                $ChangelogOverlay.Visibility = "Visible"
            }
        })
        $ChangelogLink.Add_MouseEnter({
            $ChangelogLink.Foreground = "${eColorSecondary}"
        })
        $ChangelogLink.Add_MouseLeave({
            $ChangelogLink.Foreground = "${eColorMain}"
        })
    }

    if ($CloseChangelogButton) {
        $CloseChangelogButton.Add_Click({
            if ($ChangelogOverlay) {
                $ChangelogOverlay.Visibility = "Collapsed"
            }
        })
    }

    if ($AuthorLink -and !([string]::IsNullOrWhiteSpace($AppAuthorLink))) {
        $AuthorLink.Add_MouseLeftButtonDown({
            param($sender, $e)
            try { 
                Start-Process $AppAuthorLink 
                $e.Handled = $true
            } catch { }
        })
        $AuthorLink.Add_MouseEnter({
            $AuthorLink.Foreground = "${eColorSecondary}"
        })
        $AuthorLink.Add_MouseLeave({
            $AuthorLink.Foreground = "${eColorMain}"
        })
    } elseif ($AuthorLink) {
        $AuthorLink.Cursor = "Arrow"
        $AuthorLink.TextDecorations = $null
    }
    
    if ($WebLink -and !([string]::IsNullOrWhiteSpace($AppTranslationLink))) {
        $WebLink.Add_MouseLeftButtonDown({
            param($sender, $e)
            try { 
                Start-Process $AppTranslationLink 
                $e.Handled = $true
            } catch { }
        })
        $WebLink.Add_MouseEnter({
            $WebLink.Foreground = "${eColorSecondary}"
        })
        $WebLink.Add_MouseLeave({
            $WebLink.Foreground = "${eColorMain}"
        })
    } elseif ($WebLink) {
        $WebLink.Visibility = "Collapsed"
    }

    $BrowseButton.Add_Click({
        $folderBrowser = New-Object System.Windows.Forms.FolderBrowserDialog
        $folderBrowser.Description = "${t.scriptBrowseTitle}"
        if ($folderBrowser.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
            $PathTextBox.Text = $folderBrowser.SelectedPath
        }
    })

    $CloseButtonTop.Add_Click({ $Form.Close() })
    $CloseButton.Add_Click({ $Form.Close() })

    function Update-UIState {
        $selectedPath = $PathTextBox.Text
        if (-not [string]::IsNullOrWhiteSpace($selectedPath) -and (Test-Path $selectedPath)) {
            $manifestPath = Join-Path $selectedPath "Aegis_Translation_Manifest.json"
            if (Test-Path $manifestPath) {
                $InstallButton.Content = "${t.scriptUpdate}"
                $UninstallButton.Visibility = "Visible"
            } else {
                $InstallButton.Content = "${t.scriptInstall}"
                $UninstallButton.Visibility = "Collapsed"
            }
        } else {
            $InstallButton.Content = "${t.scriptInstall}"
            $UninstallButton.Visibility = "Collapsed"
        }
    }

    $PathTextBox.Add_TextChanged({ Update-UIState })
    # Trigger UI update initially
    Update-UIState

    $UninstallButton.Add_Click({
        $selectedPath = $PathTextBox.Text
        $manifestPath = Join-Path $selectedPath "Aegis_Translation_Manifest.json"
        $backupDir = Join-Path $selectedPath "Aegis_Translation_Backup"
        
        $UninstallButton.IsEnabled = $false
        $InstallButton.IsEnabled = $false
        $BrowseButton.Visibility = "Collapsed"
        $InstallProgress.IsIndeterminate = $true
        $StatusText.Text = "${t.scriptUninstalling}"
        if ($ProgressPercent) { $ProgressPercent.Text = "${t.scriptUninstalling}" }
        
        try {
            if (-not (Test-Path $backupDir)) {
                $StatusText.Text = "${t.scriptBackupMissing}"
                if ($ProgressPercent) { $ProgressPercent.Text = "${t.scriptFailTitle}" }
                $UninstallButton.IsEnabled = $false
                $InstallButton.IsEnabled = $true
                $BrowseButton.Visibility = "Visible"
                $InstallProgress.IsIndeterminate = $false
                return
            }

            $manifest = Get-Content -Path $manifestPath | ConvertFrom-Json
            $totalFiles = $manifest.files.Count
            $currentFile = 0

            # Delete installed files that have no backups (they were new)
            $InstallProgress.IsIndeterminate = $false
            $InstallProgress.Maximum = ($totalFiles * 2) - 1
            $InstallProgress.Value = 0

            foreach ($file in $manifest.files) {
                $destPath = Join-Path $selectedPath $file.path
                if (Test-Path $destPath) {
                    $StatusText.Text = "${t.scriptUninstalling} " + $file.name
                    Remove-Item -Path $destPath -Force -ErrorAction SilentlyContinue
                }
                $currentFile++
                $percent = [math]::Truncate(($currentFile / $InstallProgress.Maximum) * 100)
                $InstallProgress.Value = $currentFile
                if ($ProgressPercent) { $ProgressPercent.Text = "$percent%" }
                try { [System.Windows.Forms.Application]::DoEvents() } catch { }
            }

            # Restore backups
            $backupFiles = Get-ChildItem -Path $backupDir -Recurse -File
            foreach ($item in $backupFiles) {
                $relativePath = $item.FullName.Substring($backupDir.Length + 1)
                $destPath = Join-Path $selectedPath $relativePath
                $destDir = Split-Path $destPath
                if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Force -Path $destDir | Out-Null }
                
                $StatusText.Text = "${t.scriptRestoring} " + $item.Name
                Copy-Item -Path $item.FullName -Destination $destPath -Force
                $currentFile++
                $percent = [math]::Truncate(($currentFile / $InstallProgress.Maximum) * 100)
                $InstallProgress.Value = $currentFile
                if ($ProgressPercent) { $ProgressPercent.Text = "$percent%" }
                try { [System.Windows.Forms.Application]::DoEvents() } catch { }
            }

            # Cleanup
            Remove-Item -Path $backupDir -Recurse -Force -ErrorAction SilentlyContinue
            Remove-Item -Path $manifestPath -Force -ErrorAction SilentlyContinue

            $InstallProgress.Value = $InstallProgress.Maximum
            $StatusText.Text = "${t.scriptUninstallSuccess}"
            if ($ProgressPercent) { $ProgressPercent.Text = "100%" }
            $UninstallButton.Visibility = "Collapsed"
            $InstallButton.Content = "${t.scriptDone}"
            $InstallButton.IsEnabled = $true
            # Clear previous events
            $InstallButton.Remove_Click($InstallButton.GetEvent_Click()) -ErrorAction SilentlyContinue
            $InstallButton.Add_Click({ $Form.Close() })
        } catch {
            $InstallProgress.IsIndeterminate = $false
            $StatusText.Text = "${t.scriptFailTitle}"
            if ($ProgressPercent) { $ProgressPercent.Text = "${t.scriptFailTitle}" }
            [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, "${t.scriptFailTitle}", 0, 16)
            
            # Reset UI completely by calling routine
            Update-UIState
            $UninstallButton.IsEnabled = $true
            $InstallButton.IsEnabled = $true
            $BrowseButton.Visibility = "Visible"
            $BrowseButton.IsEnabled = $true
        }
    })

    $InstallButton.Add_Click({
        if ($InstallButton.Content -eq "${t.scriptDone}") {
            $Form.Close()
            return
        }
        $selectedPath = $PathTextBox.Text
        if ([string]::IsNullOrWhiteSpace($selectedPath) -or !(Test-Path $selectedPath)) {
            [System.Windows.Forms.MessageBox]::Show("${t.scriptErrInvalidPath}", "${t.scriptFailTitle}", 0, 16)
            return
        }
        
        $ValidationPathClean = $ValidationPath.Trim('\\')
        if ([string]::IsNullOrWhiteSpace($ValidationPathClean)) {
            $isValid = $true
        } else {
            $selectedBaseName = Split-Path $selectedPath -Leaf
            $validationBaseName = Split-Path $ValidationPathClean -Leaf
            
            if ($selectedPath -match ([regex]::Escape($ValidationPathClean) + "$")) {
                $isValid = $true
            } elseif ($selectedBaseName -eq $validationBaseName -or $selectedBaseName -eq $ValidationPathClean) {
                $isValid = $true
            } elseif (Test-Path (Join-Path $selectedPath $ValidationPathClean)) {
                $isValid = $true
            } else {
                $isValid = $false
            }
        }
        
        if (-not $isValid) {
            $msgResult = [System.Windows.Forms.MessageBox]::Show("${t.scriptErrMismatchText}", "${t.scriptErrMismatchTitle}", 4, 48)
            if ($msgResult -ne 6) {
                return
            }
        }
        
        $targetInstallPath = $selectedPath
        if (-not [string]::IsNullOrWhiteSpace($InstallRelativePath)) {
            $targetInstallPath = Join-Path $selectedPath $InstallRelativePath
        }
        
        if (-not (Test-Path $targetInstallPath)) {
            try { New-Item -ItemType Directory -Force -Path $targetInstallPath | Out-Null } catch { }
        }
        
        $UninstallButton.IsEnabled = $false
        $InstallButton.IsEnabled = $false
        $BrowseButton.Visibility = "Collapsed"
        $InstallProgress.IsIndeterminate = $true
        $StatusText.Text = "${t.scriptInstalling}"
        if ($ProgressPercent) { $ProgressPercent.Text = "${t.scriptInstalling}" }
        
        try {
            $src = Join-Path $PSScriptRoot "Assets"
            if (Test-Path $src) {
                # Get only files, exclude root banner and qrcode
                $assets = @(Get-ChildItem -Path $src -Recurse -File | Where-Object { 
                    -not ($_.DirectoryName -eq $src -and ($_.Name -eq 'banner.jpg' -or $_.Name -eq 'qrcode.jpg'))
                })
                $totalFiles = $assets.Count
                if ($totalFiles -gt 0) {
                    $InstallProgress.IsIndeterminate = $false
                    $InstallProgress.Maximum = $totalFiles
                    $InstallProgress.Value = 0
                    
                    $currentFile = 0
                    
                    $manifestPath = Join-Path $selectedPath "Aegis_Translation_Manifest.json"
                    $backupDir = Join-Path $selectedPath "Aegis_Translation_Backup"
                    $isUpdate = Test-Path $manifestPath
                    
                    $oldManifest = $null
                    if ($isUpdate) {
                        try { $oldManifest = Get-Content -Path $manifestPath -Raw -ErrorAction SilentlyContinue | ConvertFrom-Json } catch { }
                    }
                    
                    $manifestData = @{
                        version = "${eTranVersion}"
                        files = @()
                    }
                    
                    foreach ($item in $assets) {
                        $currentFile++
                        $percent = [math]::Truncate(($currentFile / $totalFiles) * 100)
                        $StatusText.Text = "${t.scriptCopying} " + $item.Name
                        $InstallProgress.Value = $currentFile
                        if ($ProgressPercent) { $ProgressPercent.Text = "$percent%" }
                        try { [System.Windows.Forms.Application]::DoEvents() } catch { }
                        
                        $relativePath = $item.FullName.Substring($src.Length).Trim('\')
                        $destPath = Join-Path $targetInstallPath $relativePath
                        $destDir = Split-Path $destPath
                        
                        if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Force -Path $destDir | Out-Null }
                        
                        $manifestRelPath = $relativePath
                        if (-not [string]::IsNullOrWhiteSpace($InstallRelativePath)) {
                             $manifestRelPath = Join-Path $InstallRelativePath $relativePath
                        }
                        
                        # Backup logic
                        $backupFilePath = Join-Path $backupDir $manifestRelPath
                        
                        if (Test-Path $destPath) {
                            $needsBackup = $false
                            if (-not $isUpdate) {
                                $needsBackup = $true
                            } else {
                                $targetInfo = Get-Item -Path $destPath
                                $oldFileEntry = $null
                                if ($oldManifest -and $oldManifest.files) {
                                    $oldFileEntry = $oldManifest.files | Where-Object { $_.path -eq $manifestRelPath } | Select-Object -First 1
                                }
                                
                                if ($oldFileEntry) {
                                    if ($null -ne $oldFileEntry.size -and $null -ne $oldFileEntry.ticks) {
                                        # If length or modified time is different, it means the game updated this file!
                                        if (($targetInfo.Length -ne $oldFileEntry.size) -or ($targetInfo.LastWriteTimeUtc.Ticks.ToString() -ne $oldFileEntry.ticks.ToString())) {
                                            $needsBackup = $true
                                        }
                                    } else {
                                        # Legacy manifest without file metadata, only backup if not already backed up
                                        if (-not (Test-Path $backupFilePath)) {
                                            $needsBackup = $true
                                        }
                                    }
                                } else {
                                    # New file introduced in this translation update
                                    $needsBackup = $true
                                }
                            }
                            
                            if ($needsBackup) {
                                $backupFileDir = Split-Path $backupFilePath
                                if (-not (Test-Path $backupFileDir)) { New-Item -ItemType Directory -Force -Path $backupFileDir | Out-Null }
                                Copy-Item -Path $destPath -Destination $backupFilePath -Force
                            }
                        }
                        
                        Copy-Item -Path $item.FullName -Destination $destPath -Force
                        
                        try { [System.Windows.Forms.Application]::DoEvents() } catch { }

                        $newTargetInfo = Get-Item -Path $destPath
                        $manifestData.files += @{ 
                            name = $item.Name; 
                            path = $manifestRelPath; 
                            size = $newTargetInfo.Length; 
                            ticks = $newTargetInfo.LastWriteTimeUtc.Ticks.ToString() 
                        }
                    }
                    
                    $manifestJson = $manifestData | ConvertTo-Json -Depth 5 -Compress
                    Set-Content -Path $manifestPath -Value $manifestJson -Encoding UTF8 -Force
                }
            }
            
            $InstallProgress.IsIndeterminate = $false
            $InstallProgress.Value = $InstallProgress.Maximum
            $StatusText.Text = "${t.scriptSuccess}"
            if ($ProgressPercent) { $ProgressPercent.Text = "100%" }
            $InstallButton.Content = "${t.scriptDone}"
            $InstallButton.IsEnabled = $true
            # Workaround to clear previous events (just change what click does)
            $InstallButton.Remove_Click($InstallButton.GetEvent_Click()) -ErrorAction SilentlyContinue
            $InstallButton.Add_Click({ $Form.Close() })
        } catch {
            $InstallProgress.IsIndeterminate = $false
            $StatusText.Text = "${t.scriptFailTitle}"
            if ($ProgressPercent) { $ProgressPercent.Text = "${t.scriptFailTitle}" }
            [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, "${t.scriptFailTitle}", 0, 16)
            Update-UIState
            $InstallButton.IsEnabled = $true
            $UninstallButton.IsEnabled = $true
            $BrowseButton.Visibility = "Visible"
            $BrowseButton.IsEnabled = $true
        }
    })

    [void]$Form.ShowDialog()

} catch {
    [System.Windows.Forms.MessageBox]::Show("${t.scriptCriticalErr} \`n$($_.Exception.Message)", "${t.scriptFailTitle}", 0, 16)
}
