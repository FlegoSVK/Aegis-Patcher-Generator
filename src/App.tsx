import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FileList } from './components/FileList';
import { translations, Language } from './translations';
import { 
  Package, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle2, 
  Download,
  FolderOpen,
  ChevronDown,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactCrop, { type Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './index.css';

const escapeXml = (unsafe: string) => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

const getRelativeLuminance = (r: number, g: number, b: number) => {
  const parseComponent = (val: number) => {
    const s = val / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * parseComponent(r) + 0.7152 * parseComponent(g) + 0.0722 * parseComponent(b);
};

const getContrastRatio = (hex1: string, hex2: string): number => {
  const hexToRgb = (hex: string) => {
    let cleanHex = hex.replace('#', '').trim();
    if (cleanHex.length === 3) {
      cleanHex = cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2];
    }
    if (cleanHex.length !== 6) return { r: 255, g: 255, b: 255 };
    const num = parseInt(cleanHex, 16);
    if (isNaN(num)) return { r: 255, g: 255, b: 255 };
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  };

  try {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);

    const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return parseFloat(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
  } catch {
    return 21;
  }
};

export interface ColorScheme {
  id: string;
  name: string;
  textColorMain: string;
  textColorSecondary: string;
  colorBg: string;
  colorSurface: string;
  colorAccent: string;
  colorTextTitle: string;
  colorTextLink: string;
  colorTextStatus: string;
  colorTextButton: string;
  colorTextButtonPrimary: string;
  colorTextBadge: string;
}

export interface GameSettings {
  id: string;
  gameName: string;
  author: string;
  authorLink?: string;
  gameVersion: string;
  translationVersion: string;
  changelog?: string;
  translationLink: string;
  supportText?: string;
  validationPath: string;
  steamAppId?: string;
  installRelativePath: string;
  fullWindowBackground: boolean;
  textColorMain?: string;
  textColorSecondary?: string;
  colorBg?: string;
  colorSurface?: string;
  colorAccent?: string;
  colorTextTitle?: string;
  colorTextLink?: string;
  colorTextStatus?: string;
  colorTextButton?: string;
  colorTextButtonPrimary?: string;
  colorTextBadge?: string;
}

const getAutosaveValue = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const autosave = localStorage.getItem('aegis_installer_autosave');
    if (autosave) {
      const data = JSON.parse(autosave);
      if (data[key] !== undefined) {
        return data[key];
      }
    }
  } catch (e) {
    console.error('Error reading autosaved value', e);
  }
  return defaultValue;
};

const computeSHA256 = async (file: File) => {
  if (!crypto || !crypto.subtle) { return "checksum-unavailable"; }
  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    return "checksum-error";
  }
};

export default function App() {
  const [language, setLanguage] = useState<Language>('sk');
  const t = translations[language];
  
  const [gameName, setGameName] = useState(() => getAutosaveValue('gameName', 'Nová Hra'));
  const [author, setAuthor] = useState(() => getAutosaveValue('author', 'Flego'));
  const [authorLink, setAuthorLink] = useState(() => getAutosaveValue('authorLink', 'https://komunitni-preklady.org/tym/flego'));
  const [validationPath, setValidationPath] = useState(() => getAutosaveValue('validationPath', 'GameName'));
  const [steamAppId, setSteamAppId] = useState(() => getAutosaveValue('steamAppId', ''));
  const [installRelativePath, setInstallRelativePath] = useState(() => getAutosaveValue('installRelativePath', ''));
  const [translationVersion, setTranslationVersion] = useState(() => getAutosaveValue('translationVersion', 'v1.0.0'));
  const [changelog, setChangelog] = useState(() => getAutosaveValue('changelog', ''));
  const [gameVersion, setGameVersion] = useState(() => getAutosaveValue('gameVersion', '1.0'));
  const [translationLink, setTranslationLink] = useState(() => getAutosaveValue('translationLink', 'https://komunitni-preklady.org/'));
  const [supportText, setSupportText] = useState(() => getAutosaveValue('supportText', 'Investuj do slovenčiny v hrách'));
  const [textColorMain, setTextColorMain] = useState(() => getAutosaveValue('textColorMain', '#F5F7F2'));
  const [textColorSecondary, setTextColorSecondary] = useState(() => getAutosaveValue('textColorSecondary', '#919B82'));
  const [colorBg, setColorBg] = useState(() => getAutosaveValue('colorBg', '#111111'));
  const [colorSurface, setColorSurface] = useState(() => getAutosaveValue('colorSurface', '#222222'));
  const [colorAccent, setColorAccent] = useState(() => getAutosaveValue('colorAccent', '#3E4B37'));
  const [colorTextTitle, setColorTextTitle] = useState(() => getAutosaveValue('colorTextTitle', '#F5F7F2'));
  const [colorTextLink, setColorTextLink] = useState(() => getAutosaveValue('colorTextLink', '#FCEE0A'));
  const [colorTextStatus, setColorTextStatus] = useState(() => getAutosaveValue('colorTextStatus', '#919B82'));
  const [colorTextButton, setColorTextButton] = useState(() => getAutosaveValue('colorTextButton', '#F5F7F2'));
  const [colorTextButtonPrimary, setColorTextButtonPrimary] = useState(() => getAutosaveValue('colorTextButtonPrimary', '#F5F7F2'));
  const [colorTextBadge, setColorTextBadge] = useState(() => getAutosaveValue('colorTextBadge', '#F5F7F2'));
  const [showAdvancedColors, setShowAdvancedColors] = useState(false);
  const [savedSchemes, setSavedSchemes] = useState<ColorScheme[]>(() => {
    const saved = localStorage.getItem('aegis_installer_saved_schemes');
    return saved ? JSON.parse(saved) : [];
  });
  const [newSchemeName, setNewSchemeName] = useState('');

  const contrastRatioMain = getContrastRatio(textColorMain, colorBg);
  const contrastRatioSec = getContrastRatio(textColorSecondary, colorBg);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [fullWindowBackground, setFullWindowBackground] = useState(() => getAutosaveValue('fullWindowBackground', true));
  const [translationFiles, setTranslationFiles] = useState<{file: File, path: string}[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const traverseFileTree = (entry: any, path: string = ""): Promise<{file: File, path: string}[]> => {
    return new Promise((resolve) => {
      if (entry.isFile) {
        entry.file((file: File) => {
          resolve([{ file, path: path + file.name }]);
        });
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader();
        const readAllEntries = (): Promise<any[]> => {
          return new Promise((res) => {
            const allEntries: any[] = [];
            const readEntries = () => {
              dirReader.readEntries((entries: any[]) => {
                if (entries.length === 0) {
                  res(allEntries);
                } else {
                  allEntries.push(...entries);
                  readEntries();
                }
              }, () => res(allEntries));
            };
            readEntries();
          });
        };
        
        readAllEntries().then((entries) => {
          const promises = entries.map((e) => traverseFileTree(e, path + entry.name + "/"));
          Promise.all(promises).then((results) => {
            resolve(results.flat());
          });
        });
      } else {
        resolve([]);
      }
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.items) {
      const promises: Promise<{file: File, path: string}[]>[] = [];
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const item = e.dataTransfer.items[i];
        if (item.kind === 'file') {
          if (typeof item.webkitGetAsEntry === 'function') {
            const entry = item.webkitGetAsEntry();
            if (entry) {
              promises.push(traverseFileTree(entry));
            }
          } else {
            const file = item.getAsFile();
            if (file) {
              promises.push(Promise.resolve([{ file, path: file.name }]));
            }
          }
        }
      }
      const results = await Promise.all(promises);
      const droppedFiles = results.flat();
      if (droppedFiles.length > 0) {
        setTranslationFiles(prev => [...prev, ...droppedFiles]);
      }
    } else if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).map((f: File) => ({
        file: f,
        path: f.name
      }));
      setTranslationFiles(prev => [...prev, ...newFiles]);
    }
  };
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRemoveFile = (index: number) => {
    setTranslationFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
  const [qrLoadError, setQrLoadError] = useState(false);
  const [bannerLoadError, setBannerLoadError] = useState(false);
  const [showSupportQrMockup, setShowSupportQrMockup] = useState(false);
  const [showChangelogMockup, setShowChangelogMockup] = useState(false);
  
  const [history, setHistory] = useState<GameSettings[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isCoreInfoExpanded, setIsCoreInfoExpanded] = useState(true);
  const [isMultimediaExpanded, setIsMultimediaExpanded] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('gameSettingsHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    const data = {
      gameName,
      author,
      authorLink,
      validationPath,
      steamAppId,
      installRelativePath,
      translationVersion,
      changelog,
      gameVersion,
      translationLink,
      supportText,
      textColorMain,
      textColorSecondary,
      colorBg,
      colorSurface,
      colorAccent,
      colorTextTitle,
      colorTextLink,
      colorTextStatus,
      colorTextButton,
      colorTextButtonPrimary,
      colorTextBadge,
      fullWindowBackground,
    };
    localStorage.setItem('aegis_installer_autosave', JSON.stringify(data));
  }, [
    gameName,
    author,
    authorLink,
    validationPath,
    steamAppId,
    installRelativePath,
    translationVersion,
    changelog,
    gameVersion,
    translationLink,
    supportText,
    textColorMain,
    textColorSecondary,
    colorBg,
    colorSurface,
    colorAccent,
    colorTextTitle,
    colorTextLink,
    colorTextStatus,
    colorTextButton,
    colorTextButtonPrimary,
    colorTextBadge,
    fullWindowBackground,
  ]);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImgSrc, setCropImgSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);
  const filesInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setQrCodePreview(event.target?.result as string);
        setQrLoadError(false);
      };
      reader.readAsDataURL(file);
      setQrCodeFile(file);
      if (qrInputRef.current) qrInputRef.current.value = '';
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setCropImgSrc(event.target?.result as string);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
      // Reset input so the same file could be selected again if canceled
      if (bannerInputRef.current) {
        bannerInputRef.current.value = '';
      }
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const aspect = 540 / 140;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  };

  const handleSaveCrop = async () => {
    if (completedCrop && imgRef.current) {
      const image = imgRef.current;
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(
          image,
          completedCrop.x * scaleX,
          completedCrop.y * scaleY,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY,
          0,
          0,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY
        );

        canvas.toBlob((blob) => {
          if (blob) {
            const previewUrl = URL.createObjectURL(blob);
            setBannerPreview(previewUrl);
            setBannerLoadError(false);
            const file = new File([blob], 'banner.jpg', { type: 'image/jpeg' });
            setBannerFile(file);
            setCropModalOpen(false);
          }
        }, 'image/jpeg', 0.9);
      }
    } else {
      setCropModalOpen(false);
    }
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((f: File) => ({
        file: f,
        path: f.name
      }));
      setTranslationFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((f: File) => ({
        file: f,
        path: f.webkitRelativePath || f.name
      }));
      setTranslationFiles(prev => [...prev, ...newFiles]);
    }
  };

  const saveCurrentScheme = () => {
    if (!newSchemeName.trim()) return;
    const newScheme: ColorScheme = {
      id: Date.now().toString(),
      name: newSchemeName.trim(),
      textColorMain,
      textColorSecondary,
      colorBg,
      colorSurface,
      colorAccent,
      colorTextTitle,
      colorTextLink,
      colorTextStatus,
      colorTextButton,
      colorTextButtonPrimary,
      colorTextBadge
    };
    const updated = [...savedSchemes, newScheme];
    setSavedSchemes(updated);
    localStorage.setItem('aegis_installer_saved_schemes', JSON.stringify(updated));
    setNewSchemeName('');
  };

  const deleteScheme = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedSchemes.filter(s => s.id !== id);
    setSavedSchemes(updated);
    localStorage.setItem('aegis_installer_saved_schemes', JSON.stringify(updated));
  };

  const applyScheme = (scheme: ColorScheme) => {
    setTextColorMain(scheme.textColorMain);
    setTextColorSecondary(scheme.textColorSecondary);
    setColorBg(scheme.colorBg);
    setColorSurface(scheme.colorSurface);
    setColorAccent(scheme.colorAccent);
    setColorTextTitle(scheme.colorTextTitle || scheme.textColorMain);
    setColorTextLink(scheme.colorTextLink || scheme.textColorSecondary);
    setColorTextStatus(scheme.colorTextStatus || scheme.textColorSecondary);
    setColorTextButton(scheme.colorTextButton || scheme.textColorMain);
    setColorTextButtonPrimary(scheme.colorTextButtonPrimary || scheme.textColorMain);
    setColorTextBadge(scheme.colorTextBadge || scheme.textColorMain);
  };

  const generateRandomScheme = () => {
    const isDark = Math.random() > 0.5;
    
    // random component function
    const rc = (min: number, max: number) => {
      let r, g, b, lum;
      do {
         r = Math.floor(Math.random() * 256);
         g = Math.floor(Math.random() * 256);
         b = Math.floor(Math.random() * 256);
         lum = getRelativeLuminance(r, g, b);
      } while (lum < min || lum > max);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
    };

    const localHexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };
    
    let bg, surface, accent, main, sec, title, link, status, btn, btnPri, badge;
    
    if (isDark) {
       bg = rc(0.0, 0.05);
       surface = rc(0.02, 0.08);
       accent = rc(0.15, 0.4);
       
       main = rc(0.7, 1.0);
       sec = rc(0.4, 0.7);
       title = rc(0.8, 1.0);
       link = rc(0.6, 1.0);
       status = rc(0.4, 0.7);
       btn = rc(0.7, 1.0);
       // check contrast for primary text on accent
       const accentRgb = localHexToRgb(accent);
       const accentLum = getRelativeLuminance(accentRgb.r, accentRgb.g, accentRgb.b);
       btnPri = accentLum > 0.179 ? rc(0.0, 0.1) : rc(0.8, 1.0);
       badge = accentLum > 0.179 ? rc(0.0, 0.1) : rc(0.8, 1.0);
    } else {
       bg = rc(0.8, 1.0);
       surface = rc(0.9, 1.0);
       accent = rc(0.2, 0.6);
       
       main = rc(0.0, 0.2);
       sec = rc(0.2, 0.4);
       title = rc(0.0, 0.15);
       link = rc(0.1, 0.3);
       status = rc(0.3, 0.5);
       btn = rc(0.0, 0.2);
       
       const accentRgb = localHexToRgb(accent);
       const accentLum = getRelativeLuminance(accentRgb.r, accentRgb.g, accentRgb.b);
       btnPri = accentLum > 0.179 ? rc(0.0, 0.1) : rc(0.8, 1.0);
       badge = accentLum > 0.179 ? rc(0.0, 0.1) : rc(0.8, 1.0);
    }

    setColorBg(bg);
    setColorSurface(surface);
    setColorAccent(accent);
    setTextColorMain(main);
    setTextColorSecondary(sec);
    setColorTextTitle(title);
    setColorTextLink(link);
    setColorTextStatus(status);
    setColorTextButton(btn);
    setColorTextButtonPrimary(btnPri);
    setColorTextBadge(badge);
  };

  const generatePowerShellScript = () => {
    const eName = escapeXml(gameName);
    const eAuthor = escapeXml(author);
    const eGameVersion = escapeXml(gameVersion);
    const eTranVersion = escapeXml(translationVersion);
    const eValidationPath = escapeXml(validationPath);
    const eColorMain = escapeXml(textColorMain || '#F5F7F2');
    const eColorSecondary = escapeXml(textColorSecondary || '#919B82');
    const eColorBg = escapeXml(colorBg || '#111111');
    const eColorSurface = escapeXml(colorSurface || '#222222');
    const eColorAccent = escapeXml(colorAccent || '#3E4B37');
    const eColorTitle = escapeXml(colorTextTitle || eColorMain);
    const eColorLink = escapeXml(colorTextLink || eColorSecondary);
    const eColorStatus = escapeXml(colorTextStatus || eColorSecondary);
    const eColorButton = escapeXml(colorTextButton || eColorMain);
    const eColorButtonPrimary = escapeXml(colorTextButtonPrimary || eColorMain);
    const eColorBadge = escapeXml(colorTextBadge || eColorMain);
    
    // Calculate gradients based on colorBg
    const bgHex = eColorBg.replace('#', '');
    const bgSolid = `#FF${bgHex}`;
    const bgSemiTrans = `#EE${bgHex}`;
    const bgHover = `#44000000`; // Could also be tailored, keeping generic black overlay for now

    const accentHex = eColorAccent.replace('#', '');
    const accentHover = `#4C${accentHex}`; // Some translucency

    const eSupportText = escapeXml(supportText || t.supportTextInput);
    const eChangelog = escapeXml(changelog || '');

    const psLink = translationLink.replace(/'/g, "''");
    const psAuthorLink = (authorLink || '').replace(/'/g, "''");
    const psValidationPath = validationPath.replace(/'/g, "''").trim();
    const psInstallRelativePath = installRelativePath.replace(/'/g, "''").trim();

    const scriptInstallerTitle = t.scriptInstallerTitle.replace('{name}', eName);

    return `param()
Add-Type -AssemblyName PresentationFramework
Add-Type -AssemblyName System.Windows.Forms
${steamAppId ? 'Add-Type -AssemblyName System.Drawing' : ''}

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
    <Window.Resources>
        <Style TargetType="Button">
            <Setter Property="Background" Value="Transparent"/>
            <Setter Property="Template">
                <Setter.Value>
                    <ControlTemplate TargetType="Button">
                        <Border Name="border" Background="{TemplateBinding Background}" BorderBrush="{TemplateBinding BorderBrush}" BorderThickness="{TemplateBinding BorderThickness}" CornerRadius="2">
                            <ContentPresenter HorizontalAlignment="Center" VerticalAlignment="Center" Margin="{TemplateBinding Padding}"/>
                        </Border>
                        <ControlTemplate.Triggers>
                            <Trigger Property="IsMouseOver" Value="True">
                                <Setter TargetName="border" Property="Opacity" Value="0.8"/>
                            </Trigger>
                            <Trigger Property="IsPressed" Value="True">
                                <Setter TargetName="border" Property="Opacity" Value="0.6"/>
                            </Trigger>
                            <Trigger Property="IsEnabled" Value="False">
                                <Setter TargetName="border" Property="Opacity" Value="0.4"/>
                            </Trigger>
                        </ControlTemplate.Triggers>
                    </ControlTemplate>
                </Setter.Value>
            </Setter>
        </Style>
    </Window.Resources>
    <Border CornerRadius="12" Background="${eColorBg}">
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
                        <GradientStop Color="#00${bgHex}" Offset="0.0"/>
                        <GradientStop Color="${fullWindowBackground ? bgSemiTrans : bgSolid}" Offset="${fullWindowBackground ? '0.6' : '1.0'}"/>
                    </LinearGradientBrush>
                </Rectangle.Fill>
            </Rectangle>

            <Button Name="CloseButtonTop" Content="✕" HorizontalAlignment="Right" VerticalAlignment="Top" Margin="10" Width="30" Height="30" Background="${bgHover}" Foreground="${eColorButton}" BorderThickness="0" FontSize="14" Cursor="Hand" Grid.Row="0"/>
            
            <StackPanel Grid.Row="1" Margin="30,20,30,20" Background="Transparent">
            <Grid Margin="0,0,0,20">
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="*"/>
                    <ColumnDefinition Width="Auto"/>
                </Grid.ColumnDefinitions>
                <StackPanel Grid.Column="0">
                    <StackPanel Orientation="Horizontal" Margin="0,0,0,4">
                        <Image Name="WindowIconImage" Width="22" Height="22" Margin="0,0,8,0" VerticalAlignment="Center" Visibility="Collapsed"/>
                        <TextBlock Text="${scriptInstallerTitle}" FontSize="18" FontWeight="Light" Foreground="${eColorTitle}" TextWrapping="Wrap" VerticalAlignment="Center"/>
                    </StackPanel>
                    <StackPanel Orientation="Horizontal" Margin="0,0,0,2">
                        <TextBlock Text="${t.scriptAuthor} " FontSize="12" Foreground="${eColorSecondary}"/>
                        <TextBlock Name="AuthorLink" Text="${eAuthor}" FontSize="12" Foreground="${eColorLink}" TextDecorations="Underline" Cursor="Hand"/>
                    </StackPanel>
                    <TextBlock Text="${t.scriptForGameVersion} ${eGameVersion}" FontSize="12" Foreground="${eColorSecondary}" Margin="0,0,0,4"/>
                    <TextBlock Name="WebLink" Text="${t.scriptTranslationPage}" TextDecorations="Underline" Foreground="${eColorLink}" FontSize="12" Cursor="Hand"/>
                    <StackPanel Orientation="Horizontal" Margin="0,4,0,0">
                        <TextBlock Name="SupportLink" Text="${eSupportText}" TextDecorations="Underline" Foreground="${eColorLink}" FontSize="11" Margin="0,0,10,0" Cursor="Hand"/>
                        <TextBlock Name="ChangelogLink" Text="${t.scriptShowNews}" TextDecorations="Underline" Foreground="${eColorLink}" FontSize="11" Cursor="Hand"/>
                    </StackPanel>
                </StackPanel>
                <Border Grid.Column="1" Background="${accentHover}" BorderBrush="${eColorAccent}" BorderThickness="1" CornerRadius="4" Padding="8,4" VerticalAlignment="Top">
                    <TextBlock Text="${eTranVersion}" FontSize="10" Foreground="${eColorBadge}"/>
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
                <TextBox Name="PathTextBox" Grid.Column="0" Height="32" FontSize="12" VerticalContentAlignment="Center" Background="${eColorSurface}" Foreground="${eColorMain}" BorderBrush="${accentHover}" BorderThickness="1" Padding="8,0,8,0"/>
                <Button Name="BrowseButton" Content="${t.scriptBrowse}" Grid.Column="1" Width="100" Margin="10,0,0,0" Background="${eColorSurface}" Foreground="${eColorButton}" BorderBrush="${eColorAccent}" BorderThickness="1" Cursor="Hand" FontSize="11" Height="32"/>
            </Grid>
            
            <Grid Margin="0,20,0,5">
                <TextBlock Name="StatusText" Text="${t.scriptReady}" Foreground="${eColorStatus}" FontSize="10" TextWrapping="NoWrap" HorizontalAlignment="Left"/>
                <TextBlock Name="ProgressPercent" Text="0%" Foreground="${eColorStatus}" FontSize="10" HorizontalAlignment="Right"/>
            </Grid>
            <ProgressBar Name="InstallProgress" Height="6" Minimum="0" Maximum="100" Background="${eColorSurface}" Foreground="${eColorAccent}" BorderThickness="0" Margin="0,0,0,20" IsIndeterminate="False"/>
            
            <StackPanel Orientation="Horizontal" HorizontalAlignment="Right">
                <Button Name="UninstallButton" Content="${t.scriptUninstall}" Width="100" Height="32" Margin="0,0,10,0" Background="#993333" Foreground="${eColorButton}" BorderThickness="0" FontSize="12" FontWeight="Bold" Cursor="Hand" Visibility="Collapsed"/>
                <Button Name="CloseButton" Content="${t.scriptClose}" Width="100" Height="32" Margin="0,0,10,0" Background="${eColorSurface}" Foreground="${eColorButton}" BorderBrush="${eColorAccent}" BorderThickness="1" FontSize="12" Cursor="Hand"/>
                <Button Name="InstallButton" Content="${t.scriptInstall}" Width="140" Height="32" Background="${eColorAccent}" Foreground="${eColorButtonPrimary}" BorderThickness="0" FontSize="12" FontWeight="Bold" Cursor="Hand"/>
            </StackPanel>
        </StackPanel>

        <Grid Name="QrOverlay" Visibility="Collapsed" Background="#CC000000" Grid.Row="0" Grid.RowSpan="2">
            <Border Background="${eColorSurface}" BorderBrush="${eColorAccent}" BorderThickness="1" CornerRadius="8" Margin="40" Padding="20" HorizontalAlignment="Center" VerticalAlignment="Center">
                <StackPanel>
                    <TextBlock Text="${t.scriptSupportTitle}" FontSize="16" FontWeight="Bold" Foreground="${eColorTitle}" Margin="0,0,0,15" HorizontalAlignment="Center"/>
                    <Image Name="QrImage" Width="200" Height="200" Stretch="Uniform" Margin="0,0,0,20"/>
                    <Button Name="CloseQrButton" Content="${t.scriptClose}" Width="100" Height="30" Background="${eColorAccent}" Foreground="${eColorButtonPrimary}" BorderThickness="0" FontSize="12" FontWeight="Bold" Cursor="Hand" HorizontalAlignment="Center"/>
                </StackPanel>
            </Border>
        </Grid>

        <Grid Name="ChangelogOverlay" Visibility="Collapsed" Background="#CC000000" Grid.Row="0" Grid.RowSpan="2">
            <Border Background="${eColorSurface}" BorderBrush="${eColorAccent}" BorderThickness="1" CornerRadius="8" Margin="40" Padding="20" MaxWidth="440" MaxHeight="300" HorizontalAlignment="Center" VerticalAlignment="Center">
                <Grid>
                    <Grid.RowDefinitions>
                        <RowDefinition Height="Auto"/>
                        <RowDefinition Height="*"/>
                        <RowDefinition Height="Auto"/>
                    </Grid.RowDefinitions>
                    <TextBlock Text="${t.scriptNewsTitle}" FontSize="16" FontWeight="Bold" Foreground="${eColorTitle}" Margin="0,0,0,15" Grid.Row="0"/>
                    <ScrollViewer Grid.Row="1" VerticalScrollBarVisibility="Auto" Margin="0,0,0,15">
                        <TextBlock Text="${eChangelog}" Foreground="${eColorSecondary}" FontSize="12" TextWrapping="Wrap"/>
                    </ScrollViewer>
                    <Button Name="CloseChangelogButton" Content="${t.scriptClose}" Width="100" Height="30" Background="${eColorAccent}" Foreground="${eColorButtonPrimary}" BorderThickness="0" FontSize="12" FontWeight="Bold" Cursor="Hand" HorizontalAlignment="Right" Grid.Row="2"/>
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

    function Show-Overlay($ov) {
        if (-not $ov) { return }
        $ov.Opacity = 0
        $ov.Visibility = "Visible"
        $anim = New-Object System.Windows.Media.Animation.DoubleAnimation
        $anim.To = 1.0
        $anim.Duration = New-Object System.Windows.Duration([timespan]::FromMilliseconds(250))
        $ov.BeginAnimation([System.Windows.UIElement]::OpacityProperty, $anim)
    }

    function Hide-Overlay($ov) {
        if (-not $ov) { return }
        $script:hideOverlayElem = $ov
        $anim = New-Object System.Windows.Media.Animation.DoubleAnimation
        $anim.To = 0.0
        $anim.Duration = New-Object System.Windows.Duration([timespan]::FromMilliseconds(200))
        $ov.BeginAnimation([System.Windows.UIElement]::OpacityProperty, $anim)
        $script:hideOverlayTimer = New-Object System.Windows.Threading.DispatcherTimer
        $script:hideOverlayTimer.Interval = [timespan]::FromMilliseconds(250)
        $script:hideOverlayTimer.Add_Tick({
            if ($script:hideOverlayElem) { $script:hideOverlayElem.Visibility = "Collapsed" }
            if ($script:hideOverlayTimer) { $script:hideOverlayTimer.Stop() }
        })
        $script:hideOverlayTimer.Start()
    }

    if ($SupportLink) {
        $SupportLink.Add_MouseLeftButtonDown({
            param($sender, $e)
            Show-Overlay $QrOverlay
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
            Hide-Overlay $QrOverlay
        })
    }

    if ([string]::IsNullOrWhiteSpace("${eChangelog}")) {
        if ($ChangelogLink) { $ChangelogLink.Visibility = "Collapsed" }
    } elseif ($ChangelogLink) {
        $ChangelogLink.Add_MouseLeftButtonDown({
            param($sender, $e)
            Show-Overlay $ChangelogOverlay
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
            Hide-Overlay $ChangelogOverlay
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

    ${steamAppId ? `
    function Update-WindowIcon {
        param($gamePath)
        $AppExePath = Join-Path $gamePath '${psValidationPath}'
        if ((Test-Path $AppExePath) -and $AppExePath.EndsWith(".exe", [System.StringComparison]::OrdinalIgnoreCase)) {
            try {
                $icon = [System.Drawing.Icon]::ExtractAssociatedIcon($AppExePath)
                $imageSource = [System.Windows.Interop.Imaging]::CreateBitmapSourceFromHIcon(
                    $icon.Handle,
                    [System.Windows.Int32Rect]::Empty,
                    [System.Windows.Media.Imaging.BitmapSizeOptions]::FromEmptyOptions()
                )
                $Form.Icon = $imageSource
                $WindowIconImage = $Form.FindName("WindowIconImage")
                if ($WindowIconImage) {
                    $WindowIconImage.Source = $imageSource
                    $WindowIconImage.Visibility = "Visible"
                }
            } catch { }
        }
    }
    ` : ''}

    function Update-UIState {
        $InstallButton.Opacity = 1.0
        $InstallButton.IsHitTestVisible = $true
        $InstallButton.Focusable = $true
        $UninstallButton.Opacity = 1.0
        $UninstallButton.IsHitTestVisible = $true
        $UninstallButton.Focusable = $true

        $selectedPath = $PathTextBox.Text
        if (-not [string]::IsNullOrWhiteSpace($selectedPath) -and (Test-Path $selectedPath)) {
            ${steamAppId ? 'Update-WindowIcon -gamePath $selectedPath' : ''}
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
        
        $UninstallButton.Opacity = 0.5
        $UninstallButton.IsHitTestVisible = $false
        $UninstallButton.Focusable = $false
        $InstallButton.Opacity = 0.5
        $InstallButton.IsHitTestVisible = $false
        $InstallButton.Focusable = $false
        $BrowseButton.Visibility = "Collapsed"
        $InstallProgress.IsIndeterminate = $true
        $StatusText.Text = "${t.scriptUninstalling}"
        if ($ProgressPercent) { $ProgressPercent.Text = "${t.scriptUninstalling}" }
        
        try {
            $manifest = Get-Content -Path $manifestPath -ErrorAction Stop | ConvertFrom-Json
            $totalFiles = $manifest.files.Count
            $currentFile = 0

            $backupExists = Test-Path $backupDir
            $backupCount = 0
            $backupFiles = $null

            if ($backupExists) {
                $backupFiles = Get-ChildItem -Path $backupDir -Recurse -File -ErrorAction SilentlyContinue
                if ($null -ne $backupFiles) {
                    if ($backupFiles -is [array]) { $backupCount = $backupFiles.Count } Else { $backupCount = 1 }
                }
            }

            # Delete installed files that have no backups (they were new)
            $InstallProgress.IsIndeterminate = $false
            $InstallProgress.Maximum = $totalFiles + $backupCount
            $InstallProgress.Value = 0

            if ($totalFiles -gt 0) {
                foreach ($file in $manifest.files) {
                    $destPath = Join-Path $selectedPath $file.path
                    if (Test-Path $destPath) {
                        $StatusText.Text = "${t.scriptUninstalling} " + $file.name
                        Remove-Item -Path $destPath -Force -ErrorAction SilentlyContinue
                    }
                    $currentFile++
                    $percent = if ($InstallProgress.Maximum -gt 0) { [math]::Truncate(($currentFile / $InstallProgress.Maximum) * 100) } else { 100 }
                    $InstallProgress.Value = $currentFile
                    if ($ProgressPercent) { $ProgressPercent.Text = "$percent%" }
                    try { [System.Windows.Forms.Application]::DoEvents() } catch { }
                }
            }

            # Restore backups
            if ($backupExists -and $backupCount -gt 0) {
                foreach ($item in $backupFiles) {
                    $relativePath = $item.FullName.Substring($backupDir.Length + 1)
                    $destPath = Join-Path $selectedPath $relativePath
                    $destDir = Split-Path $destPath
                    if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Force -Path $destDir | Out-Null }
                    
                    $StatusText.Text = "${t.scriptRestoring} " + $item.Name
                    Copy-Item -Path $item.FullName -Destination $destPath -Force
                    $currentFile++
                    $percent = if ($InstallProgress.Maximum -gt 0) { [math]::Truncate(($currentFile / $InstallProgress.Maximum) * 100) } else { 100 }
                    $InstallProgress.Value = $currentFile
                    if ($ProgressPercent) { $ProgressPercent.Text = "$percent%" }
                    try { [System.Windows.Forms.Application]::DoEvents() } catch { }
                }
            }

            # Cleanup
            if ($backupExists) {
                Remove-Item -Path $backupDir -Recurse -Force -ErrorAction SilentlyContinue
            }
            Remove-Item -Path $manifestPath -Force -ErrorAction SilentlyContinue

            $InstallProgress.Value = $InstallProgress.Maximum
            $StatusText.Text = "${t.scriptUninstallSuccess}"
            if ($ProgressPercent) { $ProgressPercent.Text = "100%" }
            $UninstallButton.Visibility = "Collapsed"
            $InstallButton.Content = "${t.scriptDone}"
            $InstallButton.Opacity = 1.0
            $InstallButton.IsHitTestVisible = $true
            $InstallButton.Focusable = $true
        } catch {
            $InstallProgress.IsIndeterminate = $false
            $StatusText.Text = "${t.scriptFailTitle}"
            if ($ProgressPercent) { $ProgressPercent.Text = "${t.scriptFailTitle}" }
            [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, "${t.scriptFailTitle}", 0, 16)
            
            # Reset UI completely by calling routine
            Update-UIState
            $UninstallButton.Opacity = 1.0
            $UninstallButton.IsHitTestVisible = $true
            $UninstallButton.Focusable = $true
            $InstallButton.Opacity = 1.0
            $InstallButton.IsHitTestVisible = $true
            $InstallButton.Focusable = $true
            $BrowseButton.Visibility = "Visible"
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
        
        $UninstallButton.Opacity = 0.5
        $UninstallButton.IsHitTestVisible = $false
        $UninstallButton.Focusable = $false
        $InstallButton.Opacity = 0.5
        $InstallButton.IsHitTestVisible = $false
        $InstallButton.Focusable = $false
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
            $InstallButton.Opacity = 1.0
            $InstallButton.IsHitTestVisible = $true
            $InstallButton.Focusable = $true
        } catch {
            $InstallProgress.IsIndeterminate = $false
            $StatusText.Text = "${t.scriptFailTitle}"
            if ($ProgressPercent) { $ProgressPercent.Text = "${t.scriptFailTitle}" }
            [System.Windows.Forms.MessageBox]::Show($_.Exception.Message, "${t.scriptFailTitle}", 0, 16)
            Update-UIState
            $InstallButton.Opacity = 1.0
            $InstallButton.IsHitTestVisible = $true
            $InstallButton.Focusable = $true
            $UninstallButton.Opacity = 1.0
            $UninstallButton.IsHitTestVisible = $true
            $UninstallButton.Focusable = $true
            $BrowseButton.Visibility = "Visible"
            $BrowseButton.IsEnabled = $true
        }
    })

    [void]$Form.ShowDialog()

} catch {
    [System.Windows.Forms.MessageBox]::Show("${t.scriptCriticalErr} \`n$($_.Exception.Message)", "${t.scriptFailTitle}", 0, 16)
}
`;
  };

  const generateBatchScript = () => {
    return `@echo off
chcp 65001 >nul
if not exist "%~dp0Install.ps1" (
     powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('${t.scriptBatchErrorExtract}', '${t.scriptFailTitle}', 0, 16)"
    exit /b 1
)
echo ${t.scriptBatchEcho}
powershell.exe -Sta -WindowStyle Hidden -ExecutionPolicy Bypass -File "%~dp0Install.ps1"`;
  };

  const generateReadmeText = () => {
    // Generate README content based on selected language
    let text = `${(t as any).scriptInstallerTitle.replace('{name}', gameName)}\n`;
    text += `=================================================\n\n`;
    text += `${t.scriptAuthor} ${author}\n`;
    if (authorLink) text += `${t.authorLinkInput}: ${authorLink}\n`;
    text += `${t.transVersionInput}: ${translationVersion}\n`;
    text += `${t.gameVersionInput}: ${gameVersion}\n`;
    if (translationLink) text += `${t.transLinkInput}: ${translationLink}\n`;

    if (qrCodeFile) {
        text += `\n${(t as any).readmeSupportTitle}\n`;
        if (supportText) text += `${supportText}\n`;
        text += `${(t as any).readmeSupportText}\n`;
    }

    if (changelog.trim()) {
        text += `\n${(t as any).readmeChangelogTitle}\n`;
        text += `${changelog}\n`;
    }

    text += `\n${(t as any).readmeInstructionTitle}\n`;
    text += `${(t as any).readmeInstStep1}\n`;
    text += `${(t as any).readmeInstStep1Desc}\n`;
    text += `${(t as any).readmeInstStep2}\n`;
    text += `${(t as any).readmeInstStep3}\n`;
    text += `${(t as any).readmeInstStep4}\n`;
    text += `${(t as any).readmeInstStep5}\n`;
    text += `\n${(t as any).readmeUpdateTitle}\n`;
    text += `${(t as any).readmeUpdateText}\n`;
    text += `\n${(t as any).readmeUninstallTitle}\n`;
    text += `${(t as any).readmeUninstStep1}\n`;
    text += `${(t as any).readmeUninstStep2}\n`;
    text += `${(t as any).readmeUninstStep3}\n`;
    text += `${(t as any).readmeUninstStep4}\n`;
    text += `\n${(t as any).readmeEnjoy}\n`;
    
    return text;
  };

  const handleGenerate = async () => {
    if (!gameName || !author || !translationVersion || !gameVersion || !translationLink || !validationPath) {
      alert(t.alertMissingFields);
      return;
    }

    // Validation layer for large files and directory payloads
    const totalSizeBytes = translationFiles.reduce((acc, item) => acc + item.file.size, 0);
    const totalSizeMB = totalSizeBytes / (1024 * 1024);
    if (totalSizeMB > 100) {
      const formattedSize = totalSizeMB.toFixed(1);
      const confirmSize = window.confirm((t as any).largeSizeWarningText.replace('{size}', formattedSize));
      if (!confirmSize) {
        return;
      }
    }

    const fileCount = translationFiles.length;
    if (fileCount > 500) {
      const confirmCount = window.confirm((t as any).largeCountWarningText.replace('{count}', fileCount.toString()));
      if (!confirmCount) {
        return;
      }
    }

    setIsGenerating(true);
    setSuccessMessage('');

    const newSetting: GameSettings = {
      id: Date.now().toString(),
      gameName,
      author,
      authorLink,
      gameVersion,
      translationVersion,
      changelog,
      translationLink,
      supportText,
      validationPath,
      steamAppId,
      installRelativePath,
      fullWindowBackground,
      textColorMain,
      textColorSecondary,
      colorBg,
      colorSurface,
      colorAccent,
    };
    
    setHistory(prev => {
      const existingIdx = prev.findIndex(item => item.gameName === gameName && item.gameName !== '');
      let updated = [...prev];
      if (existingIdx >= 0) {
        updated[existingIdx] = { ...newSetting, id: updated[existingIdx].id };
      } else {
        updated = [newSetting, ...prev];
      }
      localStorage.setItem('gameSettingsHistory', JSON.stringify(updated));
      return updated;
    });

    try {
      const zip = new JSZip();
      
      const rawPS1 = generatePowerShellScript();
      
      // Validation for unbalanced brackets in PowerShell script
      let bracketCount = 0;
      let parenCount = 0;
      for (const char of rawPS1) {
        if (char === '{') bracketCount++;
        if (char === '}') bracketCount--;
        if (char === '(') parenCount++;
        if (char === ')') parenCount--;
      }
      if (bracketCount !== 0 || parenCount !== 0) {
        const warn = window.confirm((t as any).scriptSyntaxWarning);
        if (!warn) {
           setIsGenerating(false);
           return;
        }
      }
      
      // PowerShell Installer with UTF-8 BOM
      const ps1Content = '\uFEFF' + rawPS1;
      zip.file("Install.ps1", ps1Content);
      
      // Batch launcher
      zip.file("Spustit_Preklad.bat", generateBatchScript());

      // Readme instructions
      const readmeFileName = language === 'sk' ? "Navod_na_instalaciu.txt" : "Navod_k_instalaci.txt";
      zip.file(readmeFileName, "\uFEFF" + generateReadmeText());

      // Assets folder
      const assetsFolder = zip.folder("Assets");
      
      // Add banner
      if (bannerFile && assetsFolder) {
        assetsFolder.file("banner.jpg", bannerFile);
      }

      // Add QR code
      if (qrCodeFile && assetsFolder) {
        assetsFolder.file("qrcode.jpg", qrCodeFile);
      }

      // Add translation files and generate checksums
      if (translationFiles.length > 0 && assetsFolder) {
        const checksums: Record<string, string> = {};
        for (const item of translationFiles) {
          assetsFolder.file(item.path, item.file);
          if (crypto && crypto.subtle) {
            const hash = await computeSHA256(item.file);
            checksums[item.path] = hash;
          }
        }
        if (crypto && crypto.subtle) {
          assetsFolder.file("checksums.json", JSON.stringify(checksums, null, 2));
        }
      }

      // Generate the zip async
      const content = await zip.generateAsync({ type: "blob" });
      
      // Save
      const safeGameName = gameName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const safeGameVersion = gameVersion.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
      const safeTranVersion = translationVersion.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
      saveAs(content, `${safeGameName}_Hra_${safeGameVersion}_Preklad_${safeTranVersion}.zip`);

      setSuccessMessage(t.successMessage);
      setTimeout(() => setSuccessMessage(''), 5000);
      
    } catch (err) {
      console.error(err);
      alert(t.alertGenerateError);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-[100dvh] bg-[#0D110C] text-[#F5F7F2] font-sans flex flex-col overflow-hidden">
      
      {showHistoryModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#131A11] border border-[#3E4B37] rounded-xl shadow-2xl overflow-hidden max-w-[500px] w-full flex flex-col transform transition-all">
            <div className="p-4 border-b border-[#3E4B37]/30 flex justify-between items-center bg-[#0D110C]">
              <h3 className="text-[#F5F7F2] font-bold uppercase tracking-wider text-sm">{t.historyTitle}</h3>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="text-[#919B82] hover:text-[#F5F7F2] transition-colors"
                title={t.historyClose}
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2 custom-scrollbar">
              {history.length === 0 ? (
                <p className="text-[#919B82] text-sm text-center py-4 italic">{t.historyEmpty}</p>
              ) : (
                history.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-[#1A2416] border border-[#3E4B37]/50 hover:border-[#919B82] rounded p-3 transition-colors">
                    <div 
                      className="flex-1 cursor-pointer overflow-hidden mr-4" 
                      onClick={() => {
                        setGameName(item.gameName);
                        setAuthor(item.author);
                        setAuthorLink(item.authorLink || 'https://komunitni-preklady.org/tym/flego');
                        setGameVersion(item.gameVersion);
                        setTranslationVersion(item.translationVersion);
                        setChangelog(item.changelog || '');
                        setTranslationLink(item.translationLink);
                        setSupportText(item.supportText || 'Investuj do slovenčiny v hrách');
                        setValidationPath(item.validationPath);
                        setSteamAppId(item.steamAppId || '');
                        setInstallRelativePath(item.installRelativePath || '');
                        setFullWindowBackground(item.fullWindowBackground || false);
                        setTextColorMain(item.textColorMain || '#F5F7F2');
                        setTextColorSecondary(item.textColorSecondary || '#919B82');
                        setColorBg(item.colorBg || '#111111');
                        setColorSurface(item.colorSurface || '#222222');
                        setColorAccent(item.colorAccent || '#3E4B37');
                        setShowHistoryModal(false);
                      }}
                    >
                      <h4 className="text-[#F5F7F2] font-semibold text-sm truncate">{item.gameName || 'Nepomenovaná hra'}</h4>
                      <div className="text-[10px] text-[#919B82] mt-1 space-x-2">
                        <span>{t.historyGeneratedFor} {item.gameVersion}</span>
                        <span>{t.historyTranslation} {item.translationVersion}</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`${t.historyDeleteSettings} "${item.gameName}"?`)) {
                          setHistory(prev => {
                            const updated = prev.filter(h => h.id !== item.id);
                            localStorage.setItem('gameSettingsHistory', JSON.stringify(updated));
                            return updated;
                          });
                        }
                      }}
                      className="text-red-500/80 hover:text-red-400 text-[10px] uppercase tracking-wider font-bold py-2 px-3 bg-red-950/30 rounded border border-red-900/50 hover:border-red-500/50 transition-colors"
                    >
                      {t.historyDeleteBtn}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <header className="h-12 lg:h-14 border-b border-[#3E4B37]/30 flex items-center justify-between px-4 md:px-8 bg-[#0D110C] z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#3E4B37] rounded flex items-center justify-center font-bold text-sm">A</div>
          <h1 className="text-lg font-bold tracking-tight uppercase hidden md:block">Aegis <span className="text-[#919B82]">Patcher Generator</span></h1>
        </div>
        <div className="flex items-center gap-4 md:gap-6 text-[9px] md:text-[11px] uppercase tracking-widest text-[#919B82]">
          <div className="flex bg-[#131A11] border border-[#3E4B37] rounded overflow-hidden">
            <button 
              onClick={() => setLanguage('sk')}
              className={`px-2 py-1 font-bold ${language === 'sk' ? 'bg-[#3E4B37] text-white' : 'hover:bg-[#3E4B37]/30'}`}
            >
              SK
            </button>
            <button 
              onClick={() => setLanguage('cz')}
              className={`px-2 py-1 font-bold ${language === 'cz' ? 'bg-[#3E4B37] text-white' : 'hover:bg-[#3E4B37]/30'}`}
            >
              CZ
            </button>
          </div>
          <button 
            onClick={() => setShowHistoryModal(true)}
            className="hover:text-[#F5F7F2] transition-colors border border-[#3E4B37] rounded px-3 py-1.5 hover:bg-[#3E4B37]/20 flex items-center gap-1 cursor-pointer"
          >
            {t.historyBtn}
          </button>
          <span className="hidden sm:inline">{t.buildEngine}</span>
          <span className="h-4 w-[1px] bg-[#3E4B37] hidden sm:inline"></span>
          <span className="text-[#F5F7F2]">{t.session} {author || 'Flego'}</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:grid lg:grid-cols-[380px_1fr] xl:grid-cols-[400px_1fr]">
        
        {/* LEFT: Controls Panel */}
        <aside className="border-b lg:border-b-0 lg:border-r border-[#3E4B37]/20 flex flex-col bg-[#0D110C] z-10 lg:overflow-hidden min-h-[600px] lg:min-h-0">
          <div className="flex-1 overflow-y-auto px-5 py-4 lg:px-6 lg:py-5 flex flex-col gap-5 custom-scrollbar">
            <section className="bg-[#131A11] border border-[#3E4B37]/30 rounded-md shrink-0 focus-within:ring-1 focus-within:ring-[#3E4B37]/50">
              <button 
                onClick={() => setIsCoreInfoExpanded(!isCoreInfoExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between text-[11px] font-bold text-[#919B82] hover:text-[#F5F7F2] hover:bg-[#3E4B37]/10 uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>{t.coreInfoSection}</span>
                <motion.div
                  animate={{ rotate: isCoreInfoExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <ChevronDown size={14} />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {isCoreInfoExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 space-y-3 border-t border-[#3E4B37]/20">
              <div className="space-y-1">
                <label className="block text-[9px] uppercase text-[#919B82] ml-1" title={t.gameNameTooltip}>{t.gameNameInput}</label>
                <input 
                  type="text" 
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  className="w-full bg-[#131A11] border border-[#3E4B37] text-[#F5F7F2] rounded-[4px] px-2 py-1.5 text-xs focus:outline-none focus:border-[#919B82] transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase text-[#919B82] ml-1" title={t.authorTooltip}>{t.authorInput}</label>
                  <input 
                    type="text" 
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-[#131A11] border border-[#3E4B37] text-[#F5F7F2] rounded-[4px] px-2 py-1.5 text-xs focus:outline-none focus:border-[#919B82] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] uppercase text-[#919B82] ml-1" title={t.authorLinkTooltip}>{t.authorLinkInput}</label>
                  <input 
                    type="text" 
                    value={authorLink}
                    onChange={(e) => setAuthorLink(e.target.value)}
                    className="w-full bg-[#131A11] border border-[#3E4B37] text-[#F5F7F2] rounded-[4px] px-2 py-1.5 text-xs focus:outline-none focus:border-[#919B82] transition-colors"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase text-[#919B82] ml-1" title={t.transVersionTooltip}>{t.transVersionInput}</label>
                  <input 
                    type="text" 
                    value={translationVersion}
                    onChange={(e) => setTranslationVersion(e.target.value)}
                    className="w-full bg-[#131A11] border border-[#3E4B37] text-[#F5F7F2] rounded-[4px] px-2 py-1.5 text-xs focus:outline-none focus:border-[#919B82] transition-colors"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[9px] uppercase text-[#919B82] ml-1" title={t.gameVersionTooltip}>{t.gameVersionInput}</label>
                  <input 
                    type="text" 
                    value={gameVersion}
                    onChange={(e) => setGameVersion(e.target.value)}
                    className="w-full bg-[#131A11] border border-[#3E4B37] text-[#F5F7F2] rounded-[4px] px-2 py-1.5 text-xs focus:outline-none focus:border-[#919B82] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] uppercase text-[#919B82] ml-1" title={t.transLinkTooltip}>{t.transLinkInput}</label>
                <input 
                  type="text" 
                  value={translationLink}
                  onChange={(e) => setTranslationLink(e.target.value)}
                  className="w-full bg-[#131A11] border border-[#3E4B37] text-[#F5F7F2] rounded-[4px] px-2 py-1.5 text-xs focus:outline-none focus:border-[#919B82] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] uppercase text-[#919B82] ml-1" title={t.supportTextTooltip}>{t.supportTextInput}</label>
                <input 
                  type="text" 
                  value={supportText}
                  onChange={(e) => setSupportText(e.target.value)}
                  placeholder={t.supportTextInput}
                  className="w-full bg-[#131A11] border border-[#3E4B37] text-[#F5F7F2] rounded-[4px] px-2 py-1.5 text-xs focus:outline-none focus:border-[#919B82] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] uppercase text-[#919B82] ml-1" title={t.changelogTooltip}>{t.changelogInput}</label>
                <textarea 
                  value={changelog}
                  onChange={(e) => setChangelog(e.target.value)}
                  placeholder={t.changelogPlaceholder}
                  className="w-full bg-[#131A11] border border-[#3E4B37] text-[#F5F7F2] rounded-[4px] px-2 py-1.5 text-xs focus:outline-none focus:border-[#919B82] transition-colors resize-y min-h-[60px]"
                />
              </div>

              <div className="space-y-1 mb-3">
                <label className="block text-[9px] uppercase text-[#919B82] ml-1" title={(t as any).presetTooltip || ''}>{(t as any).presetInput}</label>
                <select
                  value={
                    (textColorMain.toUpperCase() === '#FFFFFF' && textColorSecondary.toUpperCase() === '#A0A0A0' && colorBg.toUpperCase() === '#141414' && colorSurface.toUpperCase() === '#222222' && colorAccent.toUpperCase() === '#333333') ? 'dark' :
                    (textColorMain.toUpperCase() === '#111111' && textColorSecondary.toUpperCase() === '#555555' && colorBg.toUpperCase() === '#F5F5F5' && colorSurface.toUpperCase() === '#E0E0E0' && colorAccent.toUpperCase() === '#CCCCCC') ? 'light' :
                    (textColorMain.toUpperCase() === '#FCEE0A' && textColorSecondary.toUpperCase() === '#00FFFF' && colorBg.toUpperCase() === '#101020' && colorSurface.toUpperCase() === '#202040' && colorAccent.toUpperCase() === '#FF003C') ? 'cyberpunk' :
                    (textColorMain.toUpperCase() === '#F5F7F2' && textColorSecondary.toUpperCase() === '#919B82' && colorBg.toUpperCase() === '#111111' && colorSurface.toUpperCase() === '#222222' && colorAccent.toUpperCase() === '#3E4B37') ? 'forest' : 'custom'
                  }
                  onChange={(e) => {
                    const p = e.target.value;
                    const r = (mc: string, sc: string, bg: string, sf: string, ac: string) => {
                      setTextColorMain(mc); setTextColorSecondary(sc); setColorBg(bg); setColorSurface(sf); setColorAccent(ac);
                      setColorTextTitle(mc); setColorTextLink(sc); setColorTextStatus(sc); setColorTextButton(mc); setColorTextButtonPrimary(mc); setColorTextBadge(mc);
                    };
                    if (p === 'dark') { r('#FFFFFF', '#A0A0A0', '#141414', '#222222', '#333333'); }
                    else if (p === 'light') { r('#111111', '#555555', '#F5F5F5', '#E0E0E0', '#CCCCCC'); }
                    else if (p === 'cyberpunk') { r('#FCEE0A', '#00FFFF', '#101020', '#202040', '#FF003C'); }
                    else if (p === 'forest') { r('#F5F7F2', '#919B82', '#111111', '#222222', '#3E4B37'); }
                  }}
                  className="w-full bg-[#131A11] border border-[#3E4B37] text-[#F5F7F2] rounded-[4px] px-2 py-1.5 text-[11px] focus:outline-none focus:border-[#919B82] transition-colors"
                >
                  <option value="custom">-- {(t as any).presetCustom} --</option>
                  <option value="forest">{(t as any).presetForest} (#F5F7F2 / #919B82)</option>
                  <option value="dark">{(t as any).presetDark} (#FFFFFF / #A0A0A0)</option>
                  <option value="light">{(t as any).presetLight} (#111111 / #555555)</option>
                  <option value="cyberpunk">{(t as any).presetCyberpunk} (#FCEE0A / #00FFFF)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-1">
                    <label className="block text-[9px] uppercase text-[#919B82]" title={t.textColorMainTooltip}>{t.textColorMainInput}</label>
                    <span 
                      className={`text-[9px] scale-[0.9] px-1 rounded font-bold border transition-colors cursor-help ${
                        contrastRatioMain < 4.5 
                          ? 'bg-amber-950/40 text-amber-500 border-amber-900/40 animate-pulse' 
                          : 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40'
                      }`} 
                      title={
                        contrastRatioMain < 4.5 
                          ? (t as any).contrastWarningText.replace('{ratio}', contrastRatioMain.toString()) 
                          : `${(t as any).contrastLabel}: ${contrastRatioMain}:1`
                      }
                    >
                      {contrastRatioMain < 4.5 ? '⚠️ ' : ''}{contrastRatioMain}:1
                    </span>
                  </div>
                  <div className="flex bg-[#131A11] border border-[#3E4B37] rounded-[4px] p-1 gap-2 items-center">
                    <input
                      type="color"
                      value={textColorMain}
                      onChange={(e) => setTextColorMain(e.target.value)}
                      className="w-6 h-6 rounded shrink-0 bg-transparent cursor-pointer border-none p-0"
                    />
                    <input
                      type="text"
                      value={textColorMain}
                      onChange={(e) => setTextColorMain(e.target.value.toUpperCase())}
                      className="w-full bg-transparent text-[#F5F7F2] text-xs focus:outline-none uppercase font-mono"
                      maxLength={7}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between px-1">
                    <label className="block text-[9px] uppercase text-[#919B82]" title={t.textColorSecTooltip}>{t.textColorSecInput}</label>
                    <span 
                      className={`text-[9px] scale-[0.9] px-1 rounded font-bold border transition-colors cursor-help ${
                        contrastRatioSec < 4.5 
                          ? 'bg-amber-950/40 text-amber-500 border-amber-900/40 animate-pulse' 
                          : 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40'
                      }`} 
                      title={
                        contrastRatioSec < 4.5 
                          ? (t as any).contrastWarningText.replace('{ratio}', contrastRatioSec.toString()) 
                          : `${(t as any).contrastLabel}: ${contrastRatioSec}:1`
                      }
                    >
                      {contrastRatioSec < 4.5 ? '⚠️ ' : ''}{contrastRatioSec}:1
                    </span>
                  </div>
                  <div className="flex bg-[#131A11] border border-[#3E4B37] rounded-[4px] p-1 gap-2 items-center">
                    <input
                      type="color"
                      value={textColorSecondary}
                      onChange={(e) => setTextColorSecondary(e.target.value)}
                      className="w-6 h-6 rounded shrink-0 bg-transparent cursor-pointer border-none p-0"
                    />
                    <input
                      type="text"
                      value={textColorSecondary}
                      onChange={(e) => setTextColorSecondary(e.target.value.toUpperCase())}
                      className="w-full bg-transparent text-[#F5F7F2] text-xs focus:outline-none uppercase font-mono"
                      maxLength={7}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-1 mb-4">
                <button 
                  onClick={() => setShowAdvancedColors(!showAdvancedColors)}
                  className="flex items-center justify-between w-full p-2 bg-[#172015] border border-[#3E4B37] rounded-[4px] text-[10px] uppercase font-bold tracking-wider text-[#919B82] hover:bg-[#1C271A] hover:text-[#F5F7F2] transition-colors"
                >
                  <span>{(t as any).advancedSettingsTitle}</span>
                  <span className="text-xs transition-transform" style={{ transform: showAdvancedColors ? 'rotate(180deg)' : 'rotate(0)' }}>
                    ▼
                  </span>
                </button>
                
                <AnimatePresence>
                  {showAdvancedColors && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 pb-1 px-1 grid grid-cols-2 gap-3 border-l-2 border-r-2 border-b-2 border-[#3E4B37] bg-[#10160F] rounded-b-[4px]">
                        
                        {[
                          { l: (t as any).colorBgInput, v: colorBg, s: setColorBg },
                          { l: (t as any).colorSurfaceInput, v: colorSurface, s: setColorSurface },
                          { l: (t as any).colorAccentInput, v: colorAccent, s: setColorAccent },
                          { l: (t as any).colorTextTitleInput, v: colorTextTitle, s: setColorTextTitle },
                          { l: (t as any).colorTextLinkInput, v: colorTextLink, s: setColorTextLink },
                          { l: (t as any).colorTextStatusInput, v: colorTextStatus, s: setColorTextStatus },
                          { l: (t as any).colorTextButtonInput, v: colorTextButton, s: setColorTextButton },
                          { l: (t as any).colorTextButtonPrimaryInput, v: colorTextButtonPrimary, s: setColorTextButtonPrimary },
                          { l: (t as any).colorTextBadgeInput, v: colorTextBadge, s: setColorTextBadge }
                        ].map((c) => (
                          <div className="space-y-1 col-span-2 sm:col-span-1" key={c.l}>
                            <label className="block text-[9px] uppercase text-[#919B82] ml-1">{c.l}</label>
                            <div className="flex bg-[#131A11] border border-[#3E4B37] rounded-[4px] p-1 gap-2 items-center">
                              <input
                                type="color"
                                value={c.v}
                                onChange={(e) => c.s(e.target.value)}
                                className="w-6 h-6 rounded shrink-0 bg-transparent cursor-pointer border-none p-0"
                              />
                              <input
                                type="text"
                                value={c.v}
                                onChange={(e) => c.s(e.target.value.toUpperCase())}
                                className="w-full bg-transparent text-[#F5F7F2] text-xs focus:outline-none uppercase font-mono"
                                maxLength={7}
                              />
                            </div>
                          </div>
                        ))}

                        <div className="space-y-1 col-span-2 mt-2 pt-2 border-t border-[#3E4B37]/50">
                          <button
                            onClick={generateRandomScheme}
                            className="w-full py-1.5 bg-[#3E4B37]/30 hover:bg-[#3E4B37]/60 text-[#F5F7F2] text-xs font-bold rounded-[4px] transition-colors border border-[#3E4B37]"
                          >
                            {(t as any).randomSchemeButton || 'Generovať náhodnú schému'}
                          </button>
                        </div>

                        <div className="space-y-1 col-span-2 mt-2 pt-2 border-t border-[#3E4B37]/50">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newSchemeName}
                              onChange={(e) => setNewSchemeName(e.target.value)}
                              placeholder={(t as any).saveSchemePlaceholder}
                              className="flex-1 bg-[#131A11] border border-[#3E4B37] text-[#F5F7F2] rounded-[4px] px-2 py-1 text-xs focus:outline-none focus:border-[#919B82] transition-colors"
                            />
                            <button
                              onClick={saveCurrentScheme}
                              disabled={!newSchemeName.trim()}
                              className="px-3 py-1 bg-[#3E4B37] hover:bg-[#4C5B43] disabled:opacity-50 disabled:cursor-not-allowed text-[#F5F7F2] text-xs font-bold rounded-[4px] transition-colors"
                            >
                              {(t as any).saveSchemeButton}
                            </button>
                          </div>
                        </div>

                        {savedSchemes.length > 0 && (
                          <div className="space-y-2 col-span-2 mt-1 pt-2 border-t border-[#3E4B37]/50">
                            <label className="block text-[9px] uppercase text-[#919B82] ml-1">{(t as any).savedSchemesTitle}</label>
                            <div className="grid grid-cols-1 gap-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-1">
                              {savedSchemes.map(scheme => (
                                <div key={scheme.id} className="flex items-center justify-between bg-[#131A11] border border-[#3E4B37] rounded-[4px] p-1.5 hover:bg-[#1A2416] transition-colors">
                                  <button
                                    onClick={() => applyScheme(scheme)}
                                    className="flex-1 flex items-center gap-2 text-left text-[#F5F7F2] text-xs px-1 cursor-pointer hover:text-[#A8C789] transition-colors"
                                  >
                                    <div className="flex items-center gap-0.5" title="Text / Sec / Bg / Surf / Accent">
                                      <div className="w-3 h-3 rounded-sm border border-black/50" style={{ backgroundColor: scheme.textColorMain }} />
                                      <div className="w-3 h-3 rounded-sm border border-black/50" style={{ backgroundColor: scheme.textColorSecondary }} />
                                      <div className="w-3 h-3 rounded-sm border border-white/20" style={{ backgroundColor: scheme.colorBg }} />
                                      <div className="w-3 h-3 rounded-sm border border-white/20" style={{ backgroundColor: scheme.colorSurface }} />
                                      <div className="w-3 h-3 rounded-sm border border-white/20" style={{ backgroundColor: scheme.colorAccent }} />
                                    </div>
                                    <span className="truncate max-w-[120px] font-medium">{scheme.name}</span>
                                  </button>
                                  <button
                                    onClick={(e) => deleteScheme(scheme.id, e)}
                                    title={(t as any).deleteSchemeTitle}
                                    className="w-5 h-5 flex items-center justify-center text-[#919B82] hover:text-[#ef4444] hover:bg-[#ef4444]/10 rounded-sm transition-colors shrink-0"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] uppercase text-[#919B82] ml-1" title={t.validationPathTooltip}>{t.validationPathInput}</label>
                <input 
                  type="text" 
                  value={validationPath}
                  onChange={(e) => setValidationPath(e.target.value)}
                  placeholder="napr. Crimson Desert"
                  className="w-full bg-[#131A11] border border-[#3E4B37] text-[#F5F7F2] rounded-[4px] px-2 py-1.5 text-xs focus:outline-none focus:border-[#919B82] transition-colors font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] uppercase text-[#919B82] ml-1" title={t.steamAppIdTooltip}>{t.steamAppIdInput}</label>
                <input 
                  type="text" 
                  value={steamAppId}
                  onChange={(e) => setSteamAppId(e.target.value)}
                  placeholder="napr. 123450"
                  className="w-full bg-[#131A11] border border-[#3E4B37] text-[#F5F7F2] rounded-[4px] px-2 py-1.5 text-xs focus:outline-none focus:border-[#919B82] transition-colors font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] uppercase text-[#919B82] ml-1" title={t.installRelativePathTooltip}>{t.installRelativePathInput}</label>
                <input 
                  type="text" 
                  value={installRelativePath}
                  onChange={(e) => setInstallRelativePath(e.target.value)}
                  placeholder="napr. Game\Content\Paks (nechajte prázdne pre koreň hry)"
                  className="w-full bg-[#131A11] border border-[#3E4B37] text-[#F5F7F2] rounded-[4px] px-2 py-1.5 text-xs focus:outline-none focus:border-[#919B82] transition-colors font-mono"
                />
              </div>
            </div>
                  </motion.div>
                )}
              </AnimatePresence>
          </section>

          <section className="bg-[#131A11] border border-[#3E4B37]/30 rounded-md shrink-0 focus-within:ring-1 focus-within:ring-[#3E4B37]/50">
              <button 
                onClick={() => setIsMultimediaExpanded(!isMultimediaExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between text-[11px] font-bold text-[#919B82] hover:text-[#F5F7F2] hover:bg-[#3E4B37]/10 uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>Multimédiá a Súbory</span>
                <motion.div
                  animate={{ rotate: isMultimediaExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <ChevronDown size={14} />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {isMultimediaExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-[#3E4B37]/20">
            <div className="flex flex-col gap-1.5 mb-3">
              <div className="flex gap-2">
                <input 
                  type="file" 
                  accept="image/png, image/jpeg" 
                  className="hidden" 
                  ref={bannerInputRef} 
                  onChange={handleBannerChange}
                />
                <input 
                  type="file" 
                  accept="image/png, image/jpeg" 
                  className="hidden" 
                  ref={qrInputRef} 
                  onChange={handleQrChange}
                />
                <button 
                  onClick={() => bannerInputRef.current?.click()}
                  className="flex-1 bg-transparent border border-[#3E4B37] text-[#919B82] rounded-[4px] py-1.5 text-[11px] font-semibold cursor-pointer hover:bg-[#3E4B37]/20 transition-colors truncate px-2"
                >
                  {t.addBannerBtn}
                </button>
                <button 
                  onClick={() => qrInputRef.current?.click()}
                  className="flex-1 bg-transparent border border-[#3E4B37] text-[#919B82] rounded-[4px] py-1.5 text-[11px] font-semibold cursor-pointer hover:bg-[#3E4B37]/20 transition-colors truncate px-2"
                >
                  {t.addQrBtn}
                </button>
              </div>

              <label className="flex items-center gap-2 cursor-pointer mt-0.5 pl-1 group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={fullWindowBackground}
                    onChange={(e) => setFullWindowBackground(e.target.checked)}
                    className="peer appearance-none w-3.5 h-3.5 rounded-sm border border-[#3E4B37] bg-[#131A11] checked:bg-[#3E4B37] transition-colors cursor-pointer"
                  />
                  <svg className="absolute w-2.5 h-2.5 text-[#F5F7F2] opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-[10px] lg:text-[11px] text-[#919B82] group-hover:text-[#F5F7F2] transition-colors">{t.fullWindowImageLabel}</span>
              </label>
            </div>
            <div className="space-y-3 mb-3">
              <input 
                type="file" 
                multiple
                className="hidden" 
                ref={filesInputRef} 
                onChange={handleFilesChange}
              />
              <input 
                type="file" 
                webkitdirectory=""
                multiple
                className="hidden" 
                ref={folderInputRef} 
                onChange={handleFolderChange}
              />
              
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => filesInputRef.current?.click()}
                className={`border border-dashed rounded-md p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  isDragActive 
                    ? "border-[#919B82] bg-[#3E4B37]/20 text-[#F5F7F2]" 
                    : "border-[#3E4B37] bg-[#131A11]/40 text-[#919B82] hover:bg-[#3E4B37]/10 hover:border-[#919B82]"
                }`}
              >
                <FolderOpen className="w-6 h-6 opacity-75 text-[#919B82]" />
                <span className="text-[11px] font-semibold tracking-wide">
                  {isDragActive ? t.dragAndDropActive : t.dragAndDropZone}
                </span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); filesInputRef.current?.click(); }}
                  className="flex-1 bg-transparent border border-[#3E4B37] text-[#919B82] rounded-[4px] py-1.5 text-[10px] lg:text-[11px] font-semibold cursor-pointer hover:bg-[#3E4B37]/20 transition-colors truncate px-2"
                >
                  {t.addFilesBtn}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); folderInputRef.current?.click(); }}
                  className="flex-1 bg-transparent border border-[#3E4B37] text-[#919B82] rounded-[4px] py-1.5 text-[10px] lg:text-[11px] font-semibold cursor-pointer hover:bg-[#3E4B37]/20 transition-colors truncate px-2"
                >
                  {t.addFolderBtn}
                </button>
              </div>
            </div>

            {bannerPreview && (
              <div className="mb-4 aspect-[4/1] w-full rounded-md overflow-hidden bg-black/50 border border-[#3E4B37] relative group">
                {bannerLoadError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-red-900/20 text-[#919B82] p-2 text-center">
                    <span className="text-2xl mb-1">⚠️</span>
                    <span className="text-[10px] uppercase tracking-wider">{t.bannerError}</span>
                  </div>
                ) : (
                  <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover opacity-80" onError={() => setBannerLoadError(true)} />
                )}
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setCropModalOpen(true)}
                    className="px-4 py-2 bg-[#3E4B37] hover:bg-[#4C5B43] text-[#F5F7F2] text-xs font-bold uppercase tracking-wider rounded transition-colors"
                  >
                    {t.editBtn}
                  </button>
                  <button 
                    onClick={() => { setBannerPreview(null); setBannerFile(null); setBannerLoadError(false); }}
                    className="px-4 py-2 bg-red-900/80 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
                  >
                    {t.deleteBtn}
                  </button>
                </div>
              </div>
            )}

            {qrCodePreview && (
              <div className="mb-4 aspect-square w-24 h-24 mx-auto rounded-md overflow-hidden bg-black/50 border border-[#3E4B37] relative group">
                {qrLoadError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-red-900/20 text-[#919B82] p-2 text-center">
                    <span className="text-xl mb-1">⚠️</span>
                    <span className="text-[9px] uppercase tracking-wider leading-tight">{t.qrError}</span>
                  </div>
                ) : (
                  <img src={qrCodePreview} alt="QR Code Preview" className="w-full h-full object-contain" onError={() => setQrLoadError(true)} />
                )}
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setQrCodePreview(null); setQrCodeFile(null); setQrLoadError(false); }}
                    className="px-2 py-1 bg-red-900/80 hover:bg-red-800 text-white text-[10px] font-bold uppercase tracking-wider rounded transition-colors"
                  >
                    {t.deleteBtn}
                  </button>
                </div>
              </div>
            )}
            
            {translationFiles.length > 0 && (
              <FileList 
                files={translationFiles} 
                onRemove={handleRemoveFile} 
                onClearAll={() => setTranslationFiles([])} 
              />
            )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
          </section>
          </div>

          <div className="p-4 md:px-5 md:py-4 border-t border-[#3E4B37]/20 shrink-0 bg-[#0D110C]">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-[#3E4B37] text-[#F5F7F2] rounded-[4px] py-2 lg:py-2.5 font-bold text-sm uppercase tracking-widest shadow-lg shadow-[#1A2416] border-none cursor-pointer hover:bg-[#4d5c44] transition-all duration-200 disabled:opacity-50"
            >
              {isGenerating ? t.generateBtnLoading : t.generateBtn}
            </button>
          </div>
        </aside>
        
        {/* RIGHT: Mockup Preview */}
        <section className="bg-[#090C08] relative flex items-center justify-center p-4 lg:p-12 overflow-hidden flex-1 z-0 min-h-[600px] lg:min-h-0">
          <div className="absolute top-8 left-10 text-[10px] uppercase tracking-widest text-[#3E4B37] font-bold hidden md:block">
            Live Preview &bull; WPF Patcher Mockup
          </div>
          
          <div className="w-full lg:w-[540px] h-auto lg:h-[460px] rounded-[12px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] border border-white/5 flex flex-col scale-90 sm:scale-100 transition-transform origin-center relative" style={{ backgroundColor: colorBg }}>
            
            {/* Full Window Background */}
            {fullWindowBackground && (
              <div className="absolute inset-0 z-0">
                {bannerPreview && !bannerLoadError ? (
                  <img src={bannerPreview} alt="Full Banner" className="w-full h-full object-cover" onError={() => setBannerLoadError(true)} />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1A2416] to-[#3E4B37] flex items-center justify-center">
                    {bannerLoadError && <span className="text-[#F5F7F2]/30 uppercase text-[10px] md:text-xs tracking-widest bg-black/20 px-3 py-1.5 md:px-4 md:py-2 rounded font-bold">⚠️ Chyba obrázka</span>}
                  </div>
                )}
              </div>
            )}
            
            {/* Top Gradient Overlay */}
            {fullWindowBackground ? (
              <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${colorBg}00, ${colorBg}ED 60%, ${colorBg}ED)` }}></div>
            ) : (
              <div className="absolute top-0 left-0 right-0 h-[120px] lg:h-[140px] z-10 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${colorBg}00, ${colorBg})` }}></div>
            )}

            <button className="absolute top-3 right-3 w-[30px] h-[30px] flex items-center justify-center bg-black/25 hover:bg-black/60 border-none rounded-sm z-30 transition-all hover:scale-105 font-bold text-sm cursor-pointer" style={{ color: colorTextButton }}>
              ✕
            </button>
            
            {/* Banner Content (only if not full window) */}
            <div className="h-[120px] lg:h-[140px] w-full shrink-0 relative z-20">
              {!fullWindowBackground && (
                <div className="w-full h-full bg-gradient-to-br from-[#1A2416] to-[#3E4B37] flex items-center justify-center overflow-hidden">
                  {bannerPreview && !bannerLoadError ? (
                    <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" onError={() => setBannerLoadError(true)} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full relative z-10 w-full px-4 text-center">
                      {bannerLoadError && <span className="text-[#F5F7F2]/30 uppercase text-[9px] tracking-widest bg-black/20 px-2 py-1 rounded mb-1 font-bold">⚠️ Chyba obrázka</span>}
                      <h3 className="text-xl lg:text-2xl font-serif italic text-[#F5F7F2] truncate w-full">{gameName || 'Nová Hra'}</h3>
                      <p className="text-[8px] lg:text-[10px] uppercase tracking-[0.3em] opacity-80 mt-1 lg:mt-2 text-[#F5F7F2]">Slovenský Preklad</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 px-6 py-5 lg:px-[30px] lg:py-[20px] flex flex-col z-20 relative bg-transparent">
              <div className="flex justify-between items-start mb-3 lg:mb-4">
                <div className="space-y-1 overflow-hidden pr-2">
                  <h4 className="text-base lg:text-lg font-light truncate w-full" style={{ color: colorTextTitle }}>Inštalácia Prekladu: {gameName || 'Nová Hra'}</h4>
                  <p className="text-[11px] lg:text-xs truncate w-full flex gap-1" style={{ color: textColorSecondary }}>
                    <span>Autor:</span>
                    {authorLink ? (
                      <a href={authorLink} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 truncate" style={{ color: colorTextLink }}>
                        {author || 'Flego'}
                      </a>
                    ) : (
                      <span className="truncate" style={{ color: textColorMain }}>{author || 'Flego'}</span>
                    )}
                  </p>
                  <p className="text-[11px] lg:text-xs truncate w-full" style={{ color: textColorSecondary }}>Pre verziu hry: {gameVersion}</p>
                  <a href={translationLink} target="_blank" rel="noopener noreferrer" className="text-[11px] lg:text-xs underline inline-block mt-1 truncate max-w-full hover:opacity-80 transition-opacity" style={{ color: colorTextLink }}>
                    {t.previewTranslationHelp}
                  </a>
                  <div className="flex flex-row items-center gap-3 mt-1 overflow-hidden w-full">
                    {supportText && qrCodePreview && (
                      <button 
                        onClick={() => setShowSupportQrMockup(true)}
                        className="text-[10px] lg:text-[11px] underline shrink-0 text-left truncate hover:opacity-80 transition-opacity" 
                        style={{ color: colorTextLink }}
                      >
                        {supportText}
                      </button>
                    )}
                    {changelog && (
                      <button 
                        onClick={() => setShowChangelogMockup(true)}
                        className="text-[10px] lg:text-[11px] underline shrink-0 text-left truncate hover:opacity-80 transition-opacity" 
                        style={{ color: colorTextLink }}
                      >
                        {t.previewShowNews}
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] lg:text-[10px] px-2 py-1 rounded border" style={{ color: colorTextBadge, backgroundColor: `${colorAccent}4C`, borderColor: colorAccent }}>{translationVersion || 'v1.0.0'}</span>
                </div>
              </div>
              
              <div className="my-1 lg:my-2">
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-[11px] lg:text-xs" style={{ color: textColorSecondary }}>{t.previewGamePath}</p>
                  <span className="text-[10px] text-[#4A5A40] italic truncate flex-1">({t.previewValidation}: {validationPath})</span>
                </div>
                <div className="flex gap-2.5 items-center">
                  <div className="flex-1 border px-2 h-8 text-[11px] lg:text-xs flex items-center" style={{ color: textColorMain, backgroundColor: colorSurface, borderColor: `${colorAccent}4C` }}>
                    
                  </div>
                  <button className="w-[100px] h-8 border text-[11px] hover:opacity-80 cursor-pointer transition-all hover:shadow-[0_0_8px_rgba(255,255,255,0.05)] shrink-0" style={{ backgroundColor: colorSurface, color: colorTextButton, borderColor: colorAccent }}>
                    {t.previewBrowse}
                  </button>
                </div>
              </div>
              
              <div className="mt-auto space-y-3 lg:space-y-[15px]">
                <div className="space-y-[5px]">
                  <div className="flex justify-between text-[9px] lg:text-[10px]" style={{ color: textColorSecondary }}>
                    <span>Pripravený na inštaláciu</span>
                    <span>0%</span>
                  </div>
                  <div className="h-[6px]" style={{ backgroundColor: colorSurface }}>
                    <div className="h-full w-0" style={{ backgroundColor: colorAccent }}></div>
                  </div>
                </div>
                <div className="flex gap-[10px] justify-end pb-1 lg:pb-0">
                  <button className="w-[100px] h-8 border text-[11px] lg:text-xs hover:opacity-80 cursor-pointer transition-all hover:shadow-[0_0_8px_rgba(255,255,255,0.05)]" style={{ backgroundColor: colorSurface, color: colorTextButton, borderColor: colorAccent }}>
                    {t.previewClose}
                  </button>
                  <button className="w-[140px] h-8 text-[11px] lg:text-xs font-bold border-none cursor-pointer hover:opacity-90 transition-all hover:-translate-y-[1px]" style={{ color: colorTextButtonPrimary, backgroundColor: colorAccent }}>
                    {t.previewInstall}
                  </button>
                </div>
              </div>
            </div>

            {/* QR Overlay Mockup */}
            {showSupportQrMockup && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
                <div className="border rounded-lg p-5 flex flex-col items-center shadow-2xl scale-[0.85] sm:scale-100 origin-center" style={{ backgroundColor: colorSurface, borderColor: colorAccent }}>
                  <h3 className="text-base font-bold mb-4" style={{ color: colorTextTitle }}>Podpora Prekladu</h3>
                  <div className="w-[180px] h-[180px] lg:w-[200px] lg:h-[200px] flex items-center justify-center bg-transparent mb-5 border border-transparent">
                    {qrCodePreview && !qrLoadError ? (
                      <img src={qrCodePreview} alt="QR Code" className="w-full h-full object-contain" onError={() => setQrLoadError(true)} />
                    ) : (
                      <span className="font-bold text-[10px] uppercase tracking-widest text-center" style={{ color: colorAccent }}>
                        {qrLoadError ? "⚠️ Chyba QR Kódu" : "Chýba QR Kód"}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowSupportQrMockup(false)}
                    className="w-[100px] h-[30px] font-bold text-xs border-none cursor-pointer hover:opacity-90 transition-colors rounded"
                    style={{ backgroundColor: colorAccent, color: colorTextButtonPrimary }}
                  >
                    {t.previewClose}
                  </button>
                </div>
              </div>
            )}

            {/* Changelog Overlay Mockup */}
            {showChangelogMockup && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-6 lg:p-10">
                <div className="border rounded-lg p-5 flex flex-col w-[90%] max-w-[440px] max-h-[300px] shadow-2xl scale-[0.95] sm:scale-100 origin-center" style={{ backgroundColor: colorSurface, borderColor: colorAccent }}>
                  <h3 className="text-base font-bold mb-4 shrink-0" style={{ color: colorTextTitle }}>Novinky v tejto verzii</h3>
                  <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar pr-2 min-h-[100px]">
                    <p className="text-xs whitespace-pre-wrap leading-relaxed" style={{ color: textColorSecondary }}>
                      {changelog || "Žiadne novinky k zobrazeniu."}
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowChangelogMockup(false)}
                    className="w-[100px] h-[30px] font-bold text-xs border-none cursor-pointer hover:opacity-90 transition-colors rounded self-end shrink-0"
                    style={{ backgroundColor: colorAccent, color: colorTextButtonPrimary }}
                  >
                    {t.previewClose}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-8 right-10 text-[9px] text-[#3E4B37] max-w-[200px] text-right uppercase hidden md:block">
            {language === 'cz' ? 'Návrh GUI instalátoru je generován automaticky podle XAML šablony Aegis.' : 'Návrh GUI inštalátora je generovaný automaticky podľa XAML šablóny Aegis.'}
          </div>

          {/* Notification Toast */}
          <div className={`absolute top-4 lg:top-8 right-1/2 translate-x-1/2 lg:translate-x-0 lg:right-8 bg-[#1A2416] border border-[#919B82] text-[#F5F7F2] px-6 py-4 rounded-md shadow-2xl flex items-center gap-3 transition-all duration-300 transform ${successMessage ? 'translate-y-0 opacity-100 z-50' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
            <CheckCircle2 className="text-[#919B82] w-5 h-5 flex-shrink-0" />
            <span className="font-semibold text-sm whitespace-nowrap">{successMessage}</span>
          </div>
        </section>
      </main>

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#131A11] border border-[#3E4B37] rounded-xl shadow-2xl overflow-hidden max-w-[800px] w-full flex flex-col">
            <div className="p-4 border-b border-[#3E4B37]/30 flex justify-between items-center bg-[#0D110C]">
              <h3 className="text-[#F5F7F2] font-bold uppercase tracking-wider text-sm">{t.cropTitle}</h3>
              <button 
                onClick={() => setCropModalOpen(false)}
                className="text-[#919B82] hover:text-[#F5F7F2] transition-colors text-sm font-semibold uppercase tracking-wider"
              >
                {t.cropCancel}
              </button>
            </div>
            <div className="p-6 overflow-auto bg-[#090C08] flex justify-center max-h-[60vh]">
              {cropImgSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={fullWindowBackground ? 540 / 460 : 540 / 140}
                  className="max-h-full"
                >
                  <img ref={imgRef} src={cropImgSrc} alt="Crop" onLoad={onImageLoad} className="max-w-full max-h-[50vh] object-contain" />
                </ReactCrop>
              )}
            </div>
            <div className="p-4 border-t border-[#3E4B37]/30 bg-[#0D110C] flex justify-end">
              <button
                onClick={handleSaveCrop}
                className="bg-[#3E4B37] text-[#F5F7F2] px-6 py-2 rounded-[6px] font-bold text-sm uppercase tracking-widest hover:bg-[#4d5c44] transition-colors cursor-pointer"
              >
                {t.cropApply}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

