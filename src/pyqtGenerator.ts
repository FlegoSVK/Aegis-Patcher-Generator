import { InstallerEffectConfig } from './effectsConfig';

export interface PyInstallerScriptOptions {
  gameName: string;
  author: string;
  authorLink?: string;
  gameVersion: string;
  translationVersion: string;
  translationLink?: string;
  validationPath: string;
  steamAppId?: string;
  colorBg: string;
  colorSurface: string;
  colorAccent: string;
  textColorMain: string;
  textColorSecondary: string;
  colorTextTitle?: string;
  colorTextButton?: string;
  colorTextButtonPrimary?: string;
  supportText?: string;
  changelog?: string;
  thankYouText?: string;
  iban?: string;
  enableThankYouModule: boolean;
  hasBanner: boolean;
  hasQrCode: boolean;
  hasAudio: boolean;
  hasPostTool: boolean;
  postToolFolder?: string;
  effects: InstallerEffectConfig;
  language: 'sk' | 'cz';
}

/**
 * Generates the complete, production-grade PyQt6 installer script (installer.py)
 * dynamically embedding ONLY the visual and sound effects enabled by the user.
 */
export function generatePyQtInstallerScript(options: PyInstallerScriptOptions): string {
  const {
    gameName,
    author,
    authorLink = '',
    gameVersion,
    translationVersion,
    translationLink = '',
    validationPath,
    steamAppId = '',
    colorBg,
    colorSurface,
    colorAccent,
    textColorMain,
    textColorSecondary,
    colorTextTitle = textColorMain,
    colorTextButton = textColorMain,
    changelog = '',
    enableThankYouModule,
    thankYouText = '',
    iban = '',
    hasBanner,
    hasQrCode,
    hasAudio,
    effects,
    language,
  } = options;

  const isSk = language === 'sk';

  // Localization strings inside installer.py
  const loc = {
    title: isSk ? `Inštalátor - ${gameName} SK preklad` : `Instalátor - ${gameName} CZ překlad`,
    authorLbl: isSk ? 'Autor:' : 'Autor:',
    versionLbl: isSk ? 'Verzia hry:' : 'Verze hry:',
    transVerLbl: isSk ? 'Preklad:' : 'Překlad:',
    transPageBtn: isSk ? 'Stránka prekladu' : 'Stránka překladu',
    newsBtn: isSk ? 'Zobraziť novinky' : 'Zobrazit novinky',
    pathLbl: isSk ? 'Cesta k hre:' : 'Cesta ke hře:',
    validationLbl: isSk ? 'Overenie' : 'Ověření',
    browseBtn: isSk ? 'Prehľadávať...' : 'Procházet...',
    readyLbl: isSk ? 'Pripravený na inštaláciu' : 'Připraven k instalaci',
    installBtn: isSk ? 'Inštalovať Preklad' : 'Instalovat Překlad',
    closeBtn: isSk ? 'Zavrieť' : 'Zavřít',
    supportBtn: isSk ? 'Podpora' : 'Podpora',
    installingLbl: isSk ? 'Inštalujem súbory prekladu...' : 'Instaluji soubory překladu...',
    doneLbl: isSk ? 'Preklad bol úspešne nainštalovaný!' : 'Překlad byl úspěšně nainstalován!',
    errorPathTitle: isSk ? 'Neplatná cesta' : 'Neplatná cesta',
    errorPathMsg: isSk
      ? `Zvolená zložka neobsahuje očakávaný adresár alebo súbor '${validationPath}'. Chcete napriek tomu pokračovať?`
      : `Zvolená složka neobsahuje očekávaný adresář nebo soubor '${validationPath}'. Chcete přesto pokračovat?`,
    errorSelectPath: isSk ? 'Najprv vyberte platný priečinok s hrou!' : 'Nejprve vyberte platnou složku se hrou!',
    playBtn: isSk ? '🎮 Zavrieť a hrať' : '🎮 Zavřít a hrát',
    supportTitle: isSk ? 'Ďakujem za tvoju podporu! 💚' : 'Děkuji za tvou podporu! 💚',
    supportDesc: isSk ? 'Pre rýchly príspevok stačí naskenovať QR kód v bankovej aplikácii.' : 'Pro rychlý příspěvek stačí naskenovat QR kód v bankovní aplikaci.',
    ibanCopied: isSk ? 'IBAN bol skopírovaný do schránky!' : 'IBAN byl zkopírován do schránky!',
  };

  // Build modular PyQt6 code blocks based on active effects
  const pyImports = [
    'import sys',
    'import os',
    'import shutil',
    'import json',
    'import webbrowser',
    'from pathlib import Path',
    'try:\n    import winsound\nexcept ImportError:\n    winsound = None',
    'from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,',
    '                             QLabel, QPushButton, QProgressBar, QFileDialog, QMessageBox,',
    '                             QFrame, QGraphicsDropShadowEffect, QScrollArea, QDialog)',
    'from PyQt6.QtCore import Qt, QPoint, QPointF, QRect, QRectF, QPropertyAnimation, QEasingCurve, pyqtProperty, pyqtSignal, QThread',
    'from PyQt6.QtGui import QColor, QPainter, QPainterPath, QPen, QBrush, QFont, QPixmap, QIcon, QLinearGradient',
  ];

  if (effects.soundClickFeedback || hasAudio) {
    pyImports.push('from PyQt6.QtMultimedia import QSoundEffect, QAudioOutput, QMediaPlayer');
    pyImports.push('from PyQt6.QtCore import QUrl');
  }

  // Effect-specific modular helper classes
  const effectClasses: string[] = [];

  // 1. AnimatedButton with modular effects
  effectClasses.push(`
class AegisEffectButton(QPushButton):
    """
    Modern custom button with modular visual and tactile feedback effects.
    Active effects:
      - Ripple Effect: ${effects.rippleEffect}
      - Hover Glow Shimmer: ${effects.hoverGlowShimmer}
      - Pressed Depth Offset: ${effects.pressedDepthOffset}
      - Neon Pulse Border: ${effects.neonPulseBorder}
      - Scale Bounce: ${effects.scaleBounceOnHover}
      - Sound Click Feedback: ${effects.soundClickFeedback}
      - Glassmorphism Blur Highlight: ${effects.glassmorphismBlur}
      - Smooth Color Fade: ${effects.smoothColorFade}
    """
    def __init__(self, text="", parent=None, is_primary=False, accent_color="${colorAccent}"):
        super().__init__(text, parent)
        self.is_primary = is_primary
        self.accent_hex = accent_color
        self.setCursor(Qt.CursorShape.PointingHandCursor)
        self.setMinimumHeight(38)
        
        # Internal states for effects
        self._ripple_rad = 0.0
        self._ripple_center = QPoint()
        self._ripple_alpha = 0.0
        self._shimmer_pos = -1.0
        self._is_pressed = False
        self._pulse_alpha = 180
        self._scale_factor = 1.0
        
        # Audio effect
        self.sound_effect = None
        ${effects.soundClickFeedback ? `
        sound_path = os.path.join(os.path.dirname(__file__), "Assets", "audio", "click.wav")
        if os.path.exists(sound_path):
            try:
                self.sound_effect = QSoundEffect(self)
                self.sound_effect.setSource(QUrl.fromLocalFile(sound_path))
                self.sound_effect.setVolume(0.5)
            except Exception:
                self.sound_effect = None
        ` : ''}

        # Animations setup
        ${effects.rippleEffect ? `
        self.ripple_anim = QPropertyAnimation(self, b"ripple_radius")
        self.ripple_anim.setDuration(400)
        self.ripple_anim.setEasingCurve(QEasingCurve.Type.OutQuad)
        self.ripple_anim.finished.connect(self._reset_ripple)
        ` : ''}

        ${effects.hoverGlowShimmer ? `
        self.shimmer_anim = QPropertyAnimation(self, b"shimmer_offset")
        self.shimmer_anim.setDuration(600)
        self.shimmer_anim.setEasingCurve(QEasingCurve.Type.InOutSine)
        ` : ''}

        ${effects.scaleBounceOnHover ? `
        self.scale_anim = QPropertyAnimation(self, b"scale_factor")
        self.scale_anim.setDuration(180)
        self.scale_anim.setEasingCurve(QEasingCurve.Type.OutCubic)
        ` : ''}

        ${effects.neonPulseBorder ? `
        self.pulse_anim = QPropertyAnimation(self, b"pulse_alpha")
        self.pulse_anim.setDuration(1200)
        self.pulse_anim.setStartValue(100)
        self.pulse_anim.setEndValue(255)
        self.pulse_anim.setEasingCurve(QEasingCurve.Type.InOutSine)
        self.pulse_anim.setLoopCount(-1)
        if self.is_primary:
            self.pulse_anim.start()
        ` : ''}

        self.update_style()

    # --- Property Getters / Setters for QPropertyAnimation ---
    def get_ripple_radius(self):
        return self._ripple_rad
    def set_ripple_radius(self, r):
        self._ripple_rad = r
        self._ripple_alpha = max(0.0, 1.0 - (r / max(self.width(), self.height(), 1)))
        self.update()
    ripple_radius = pyqtProperty(float, get_ripple_radius, set_ripple_radius)

    def get_shimmer_offset(self):
        return self._shimmer_pos
    def set_shimmer_offset(self, pos):
        self._shimmer_pos = pos
        self.update()
    shimmer_offset = pyqtProperty(float, get_shimmer_offset, set_shimmer_offset)

    def get_pulse_alpha(self):
        return self._pulse_alpha
    def set_pulse_alpha(self, val):
        self._pulse_alpha = val
        self.update()
    pulse_alpha = pyqtProperty(int, get_pulse_alpha, set_pulse_alpha)

    def get_scale_factor(self):
        return self._scale_factor
    def set_scale_factor(self, s):
        self._scale_factor = s
        self.update()
    scale_factor = pyqtProperty(float, get_scale_factor, set_scale_factor)

    def _reset_ripple(self):
        self._ripple_rad = 0.0
        self._ripple_alpha = 0.0
        self.update()

    def update_style(self):
        ${effects.smoothColorFade ? 'fade_trans = "transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);"' : 'fade_trans = ""'}
        bg_col = self.accent_hex if self.is_primary else "${colorSurface}"
        border_col = "${colorAccent}" if self.is_primary else "#3E4B37"
        text_col = "${colorTextButton}"
        ${effects.glassmorphismBlur ? 'backdrop = "background-color: rgba(30, 40, 28, 0.75);"' : 'backdrop = ""'}

        self.setStyleSheet(f"""
            QPushButton {{
                background-color: {bg_col};
                color: {text_col};
                border: 1px solid {border_col};
                border-radius: 4px;
                padding: 6px 16px;
                font-weight: 600;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                {fade_trans}
            }}
            QPushButton:hover {{
                background-color: {self.accent_hex}DD;
                border-color: #919B82;
            }}
            QPushButton:disabled {{
                background-color: #1A2218;
                border-color: #263121;
                color: #55604C;
            }}
        """)

    def enterEvent(self, event):
        super().enterEvent(event)
        ${effects.hoverGlowShimmer ? `
        if self.isEnabled() and hasattr(self, 'shimmer_anim'):
            self.shimmer_anim.stop()
            self.shimmer_anim.setStartValue(0.0)
            self.shimmer_anim.setEndValue(1.0)
            self.shimmer_anim.start()
        ` : ''}
        ${effects.scaleBounceOnHover ? `
        if self.isEnabled() and hasattr(self, 'scale_anim'):
            self.scale_anim.stop()
            self.scale_anim.setStartValue(self._scale_factor)
            self.scale_anim.setEndValue(1.04)
            self.scale_anim.start()
        ` : ''}

    def leaveEvent(self, event):
        super().leaveEvent(event)
        self._shimmer_pos = -1.0
        ${effects.scaleBounceOnHover ? `
        if hasattr(self, 'scale_anim'):
            self.scale_anim.stop()
            self.scale_anim.setStartValue(self._scale_factor)
            self.scale_anim.setEndValue(1.0)
            self.scale_anim.start()
        ` : ''}
        self.update()

    def mousePressEvent(self, event):
        if event.button() == Qt.MouseButton.LeftButton and self.isEnabled():
            self._is_pressed = True
            ${effects.soundClickFeedback ? `
            sound_path = os.path.join(os.path.dirname(__file__), "Assets", "audio", "click.wav")
            if winsound and os.path.exists(sound_path):
                try:
                    winsound.PlaySound(sound_path, winsound.SND_ASYNC | winsound.SND_FILENAME)
                except Exception:
                    pass
            elif self.sound_effect:
                try:
                    self.sound_effect.play()
                except Exception:
                    pass
            ` : ''}
            ${effects.rippleEffect ? `
            self._ripple_center = event.position().toPoint()
            max_dim = max(self.width(), self.height()) * 1.5
            if hasattr(self, 'ripple_anim'):
                self.ripple_anim.stop()
                self.ripple_anim.setStartValue(0.0)
                self.ripple_anim.setEndValue(max_dim)
                self.ripple_anim.start()
            ` : ''}
        super().mousePressEvent(event)
        self.update()

    def mouseReleaseEvent(self, event):
        self._is_pressed = False
        super().mouseReleaseEvent(event)
        self.update()

    def paintEvent(self, event):
        super().paintEvent(event)
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)

        ${effects.pressedDepthOffset ? `
        # Visual depth push feedback
        if self._is_pressed:
            painter.fillRect(self.rect(), QColor(0, 0, 0, 40))
        ` : ''}

        ${effects.hoverGlowShimmer ? `
        # Shimmer light beam pass
        if self._shimmer_pos >= 0.0 and self.isEnabled():
            w = self.width()
            h = self.height()
            x = int(self._shimmer_pos * (w + 100)) - 50
            grad = QLinearGradient(x - 30, 0, x + 30, h)
            grad.setColorAt(0.0, QColor(255, 255, 255, 0))
            grad.setColorAt(0.5, QColor(255, 255, 255, 55))
            grad.setColorAt(1.0, QColor(255, 255, 255, 0))
            painter.fillRect(self.rect(), QBrush(grad))
        ` : ''}

        ${effects.rippleEffect ? `
        # Ripple wave animation from cursor contact point
        if self._ripple_rad > 0 and self._ripple_alpha > 0:
            painter.setPen(Qt.PenStyle.NoPen)
            ripple_color = QColor(255, 255, 255, int(self._ripple_alpha * 60))
            painter.setBrush(QBrush(ripple_color))
            painter.drawEllipse(self._ripple_center, int(self._ripple_rad), int(self._ripple_rad))
        ` : ''}

        ${effects.neonPulseBorder ? `
        # Breathing neon pulse border
        if self.is_primary and self.isEnabled():
            pen = QPen(QColor(145, 155, 130, self._pulse_alpha))
            pen.setWidth(1)
            painter.setPen(pen)
            painter.setBrush(Qt.BrushStyle.NoBrush)
            painter.drawRoundedRect(self.rect().adjusted(1, 1, -1, -1), 4, 4)
        ` : ''}
        painter.end()
`);

  // 2. Shake error animation for buttons or windows
  if (effects.shakeErrorAnimation) {
    effectClasses.push(`
def trigger_shake_animation(widget):
    """Oscillates the target widget horizontally to signal an error/missing validation path."""
    orig_pos = widget.pos()
    anim = QPropertyAnimation(widget, b"pos", widget)
    anim.setDuration(350)
    anim.setEasingCurve(QEasingCurve.Type.InOutSine)
    anim.setKeyValueAt(0.0, orig_pos)
    anim.setKeyValueAt(0.2, QPoint(orig_pos.x() - 8, orig_pos.y()))
    anim.setKeyValueAt(0.4, QPoint(orig_pos.x() + 8, orig_pos.y()))
    anim.setKeyValueAt(0.6, QPoint(orig_pos.x() - 5, orig_pos.y()))
    anim.setKeyValueAt(0.8, QPoint(orig_pos.x() + 5, orig_pos.y()))
    anim.setKeyValueAt(1.0, orig_pos)
    anim.start()
    widget._shake_anim = anim
`);
  } else {
    effectClasses.push(`
def trigger_shake_animation(widget):
    pass
`);
  }

  // 3. Success particle burst overlay
  if (effects.successParticleBurst) {
    effectClasses.push(`
import random

class ParticleBurstWidget(QWidget):
    """Generates a joyful celebratory particle burst overlay on installation completion."""
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setAttribute(Qt.WidgetAttribute.WA_TransparentForMouseEvents)
        self.setAttribute(Qt.WidgetAttribute.WA_TranslucentBackground)
        self.particles = []
        self._fade = 1.0

        self.fade_anim = QPropertyAnimation(self, b"fade_progress")
        self.fade_anim.setDuration(1200)
        self.fade_anim.setEasingCurve(QEasingCurve.Type.OutQuad)
        self.fade_anim.finished.connect(self.hide)

    def get_fade_progress(self):
        return self._fade
    def set_fade_progress(self, val):
        self._fade = val
        for p in self.particles:
            p['x'] += p['vx']
            p['y'] += p['vy']
            p['vy'] += 0.25 # Gravity
        self.update()
    fade_progress = pyqtProperty(float, get_fade_progress, set_fade_progress)

    def burst(self, center_point):
        self.particles.clear()
        colors = ["${colorAccent}", "#919B82", "#F5F7F2", "#E8A838", "#4ADE80"]
        for _ in range(45):
            angle = random.uniform(0, 6.28)
            speed = random.uniform(2.5, 7.5)
            self.particles.append({
                'x': float(center_point.x()),
                'y': float(center_point.y()),
                'vx': speed * random.uniform(0.5, 1.2) * (1 if random.random() > 0.5 else -1),
                'vy': -random.uniform(3.0, 8.0),
                'size': random.uniform(3.0, 6.0),
                'color': QColor(random.choice(colors))
            })
        self.show()
        self.raise_()
        self.fade_anim.stop()
        self.fade_anim.setStartValue(1.0)
        self.fade_anim.setEndValue(0.0)
        self.fade_anim.start()

    def paintEvent(self, event):
        if not self.particles or self._fade <= 0:
            return
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        for p in self.particles:
            col = QColor(p['color'])
            col.setAlphaF(max(0.0, self._fade))
            painter.setBrush(QBrush(col))
            painter.setPen(Qt.PenStyle.NoPen)
            painter.drawEllipse(QPointF(p['x'], p['y']), p['size'], p['size'])
        painter.end()
`);
  }

  // Installation worker thread logic
  const installerWorkerClass = `
class InstallWorker(QThread):
    progress = pyqtSignal(int, str)
    finished = pyqtSignal(bool, str)

    def __init__(self, target_dir, validation_subpath):
        super().__init__()
        self.target_dir = Path(target_dir)
        self.validation_subpath = validation_subpath

    def run(self):
        try:
            assets_dir = Path(__file__).parent / "Assets"
            if not assets_dir.exists():
                self.finished.emit(False, "Chýba zložka Assets!")
                return

            self.progress.emit(10, "${loc.installingLbl}")
            
            # 1. Collect files to copy
            files_to_copy = []
            for root, dirs, files in os.walk(assets_dir):
                # Ignore audio, banner, qrcode
                for f in files:
                    full_p = Path(root) / f
                    rel_p = full_p.relative_to(assets_dir)
                    if str(rel_p).startswith("audio") or rel_p.name in ["banner.jpg", "qrcode.jpg", "checksums.json"]:
                        continue
                    files_to_copy.append((full_p, rel_p))

            total = len(files_to_copy)
            if total == 0:
                self.progress.emit(80, "Súbory boli overené...")
            else:
                for idx, (src, rel) in enumerate(files_to_copy):
                    dest = self.target_dir / rel
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(src, dest)
                    pct = int(10 + (idx + 1) / total * 75)
                    self.progress.emit(pct, f"Kopírujem: {rel.name}")

            self.progress.emit(100, "${loc.doneLbl}")
            self.finished.emit(True, "${loc.doneLbl}")
        except Exception as e:
            self.finished.emit(False, str(e))
`;

  // Thank you dialog class
  const thankYouDialog = `
class ThankYouDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("${loc.supportTitle}")
        self.setFixedSize(480, 520)
        self.setWindowFlags(self.windowFlags() | Qt.WindowType.FramelessWindowHint)
        self.setStyleSheet("""
            QDialog {
                background-color: ${colorBg};
                border: 1px solid #3E4B37;
                border-radius: 8px;
            }
            QLabel {
                color: ${textColorMain};
            }
        """)

        layout = QVBoxLayout(self)
        layout.setContentsMargins(24, 24, 24, 24)
        layout.setSpacing(16)

        title = QLabel("${loc.supportTitle}")
        title.setFont(QFont("Arial", 14, QFont.Weight.Bold))
        title.setStyleSheet("color: #F5F7F2;")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(title)

        desc = QLabel("${thankYouText || loc.supportDesc}".replace('\\n', '\\n'))
        desc.setWordWrap(True)
        desc.setFont(QFont("Arial", 9))
        desc.setStyleSheet("color: ${textColorSecondary}; line-height: 1.4;")
        layout.addWidget(desc)

        ${hasQrCode ? `
        qr_path = os.path.join(os.path.dirname(__file__), "Assets", "qrcode.jpg")
        if os.path.exists(qr_path):
            qr_lbl = QLabel()
            pix = QPixmap(qr_path).scaled(140, 140, Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation)
            qr_lbl.setPixmap(pix)
            qr_lbl.setAlignment(Qt.AlignmentFlag.AlignCenter)
            layout.addWidget(qr_lbl)
        ` : ''}

        ${iban ? `
        iban_frame = QFrame()
        iban_frame.setStyleSheet("background-color: ${colorSurface}; border: 1px solid #3E4B37; border-radius: 4px; padding: 6px;")
        iban_layout = QHBoxLayout(iban_frame)
        iban_val = QLabel("${iban}")
        iban_val.setFont(QFont("Arial", 10, QFont.Weight.Bold))
        iban_val.setStyleSheet("color: #F5F7F2;")
        copy_btn = QPushButton("Kopírovať")
        copy_btn.setStyleSheet("background-color: #3E4B37; color: white; border: none; padding: 4px 8px; border-radius: 3px;")
        copy_btn.clicked.connect(lambda: (QApplication.clipboard().setText("${iban}"), QMessageBox.information(self, "IBAN", "${loc.ibanCopied}")))
        iban_layout.addWidget(iban_val)
        iban_layout.addWidget(copy_btn)
        layout.addWidget(iban_frame)
        ` : ''}

        close_btn = AegisEffectButton("${loc.playBtn}", is_primary=True, accent_color="${colorAccent}")
        close_btn.clicked.connect(self.accept)
        layout.addWidget(close_btn)
`;

  // MainWindow class
  const mainWindowClass = `
class AegisMainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("${loc.title}")
        self.setFixedSize(700, 520)
        self.target_game_path = self.detect_game_path()

        # Main styling
        self.setStyleSheet("""
            QMainWindow {
                background-color: ${colorBg};
            }
            QLabel {
                color: ${textColorMain};
            }
        """)

        central = QWidget()
        self.setCentralWidget(central)
        main_layout = QVBoxLayout(central)
        main_layout.setContentsMargins(16, 16, 16, 16)
        main_layout.setSpacing(12)

        # Header with Banner
        ${hasBanner ? `
        banner_path = os.path.join(os.path.dirname(__file__), "Assets", "banner.jpg")
        if os.path.exists(banner_path):
            banner_lbl = QLabel()
            pix = QPixmap(banner_path).scaled(668, 140, Qt.AspectRatioMode.KeepAspectRatioByExpanding, Qt.TransformationMode.SmoothTransformation)
            banner_lbl.setPixmap(pix)
            banner_lbl.setFixedHeight(140)
            banner_lbl.setStyleSheet("border-radius: 6px; overflow: hidden; border: 1px solid #3E4B37;")
            banner_lbl.setAlignment(Qt.AlignmentFlag.AlignCenter)
            main_layout.addWidget(banner_lbl)
        ` : ''}

        # Game Title & Info row
        title_row = QHBoxLayout()
        title_box = QVBoxLayout()
        game_title = QLabel("${gameName}")
        game_title.setFont(QFont("Arial", 16, QFont.Weight.Bold))
        game_title.setStyleSheet("color: ${colorTextTitle};")
        
        info_sub = QLabel("${loc.authorLbl} ${author}  ·  ${loc.versionLbl} ${gameVersion}  ·  ${loc.transVerLbl} ${translationVersion}")
        info_sub.setFont(QFont("Arial", 9))
        info_sub.setStyleSheet("color: ${textColorSecondary};")

        title_box.addWidget(game_title)
        title_box.addWidget(info_sub)
        title_row.addLayout(title_box)
        title_row.addStretch()

        ${translationLink ? `
        link_btn = AegisEffectButton("${loc.transPageBtn}")
        link_btn.clicked.connect(lambda: webbrowser.open("${translationLink}"))
        title_row.addWidget(link_btn)
        ` : ''}

        main_layout.addLayout(title_row)

        # Changelog or description card
        ${changelog ? `
        news_frame = QFrame()
        news_frame.setStyleSheet("background-color: ${colorSurface}; border: 1px solid #3E4B37; border-radius: 4px; padding: 8px;")
        news_layout = QVBoxLayout(news_frame)
        news_title = QLabel("${loc.newsBtn}")
        news_title.setFont(QFont("Arial", 9, QFont.Weight.Bold))
        news_title.setStyleSheet("color: #919B82;")
        news_desc = QLabel("${changelog.replace(/\n/g, ' ')}")
        news_desc.setFont(QFont("Arial", 9))
        news_desc.setWordWrap(True)
        news_layout.addWidget(news_title)
        news_layout.addWidget(news_desc)
        main_layout.addWidget(news_frame)
        ` : ''}

        main_layout.addStretch()

        # Game Path Selection card
        path_card = QFrame()
        path_card.setStyleSheet("background-color: ${colorSurface}; border: 1px solid #3E4B37; border-radius: 4px; padding: 10px;")
        path_layout = QVBoxLayout(path_card)
        path_layout.setSpacing(6)

        path_header = QHBoxLayout()
        path_title = QLabel("${loc.pathLbl}")
        path_title.setFont(QFont("Arial", 9, QFont.Weight.Bold))
        path_title.setStyleSheet("color: ${textColorSecondary};")
        
        val_sub = QLabel("(${loc.validationLbl}: ${validationPath})")
        val_sub.setFont(QFont("Arial", 8))
        val_sub.setStyleSheet("color: #55604C;")

        path_header.addWidget(path_title)
        path_header.addWidget(val_sub)
        path_header.addStretch()
        path_layout.addLayout(path_header)

        path_sel_row = QHBoxLayout()
        self.path_lbl = QLabel(self.target_game_path or "Nevybratá žiadna cesta...")
        self.path_lbl.setFont(QFont("Arial", 9))
        self.path_lbl.setStyleSheet("color: #F5F7F2; background: ${colorBg}; border: 1px solid #263121; border-radius: 3px; padding: 6px;")
        
        self.browse_btn = AegisEffectButton("${loc.browseBtn}")
        self.browse_btn.clicked.connect(self.browse_path)
        path_sel_row.addWidget(self.path_lbl, 1)
        path_sel_row.addWidget(self.browse_btn)
        path_layout.addLayout(path_sel_row)
        main_layout.addWidget(path_card)

        # Progress bar
        self.prog_bar = QProgressBar()
        self.prog_bar.setFixedHeight(8)
        self.prog_bar.setTextVisible(False)
        self.prog_bar.setStyleSheet("""
            QProgressBar {
                background-color: ${colorSurface};
                border: 1px solid #3E4B37;
                border-radius: 2px;
            }
            QProgressBar::chunk {
                background-color: ${colorAccent};
                border-radius: 2px;
            }
        """)
        self.status_lbl = QLabel("${loc.readyLbl}")
        self.status_lbl.setFont(QFont("Arial", 9))
        self.status_lbl.setStyleSheet("color: ${textColorSecondary};")
        main_layout.addWidget(self.status_lbl)
        main_layout.addWidget(self.prog_bar)

        # Bottom buttons
        btn_row = QHBoxLayout()
        ${enableThankYouModule ? `
        self.support_btn = AegisEffectButton("${loc.supportBtn}")
        self.support_btn.clicked.connect(self.show_thank_you)
        btn_row.addWidget(self.support_btn)
        ` : ''}

        btn_row.addStretch()

        self.close_btn = AegisEffectButton("${loc.closeBtn}")
        self.close_btn.clicked.connect(self.close)
        btn_row.addWidget(self.close_btn)

        self.install_btn = AegisEffectButton("${loc.installBtn}", is_primary=True, accent_color="${colorAccent}")
        self.install_btn.clicked.connect(self.start_installation)
        btn_row.addWidget(self.install_btn)
        main_layout.addLayout(btn_row)

        ${effects.successParticleBurst ? `
        # Particle Burst overlay
        self.particle_burst = ParticleBurstWidget(central)
        self.particle_burst.resize(self.size())
        ` : ''}

    def resizeEvent(self, event):
        super().resizeEvent(event)
        ${effects.successParticleBurst ? 'self.particle_burst.resize(self.size())' : ''}

    def detect_game_path(self):
        """Attempts to auto-detect game directory from common Steam/Epic library paths."""
        ${steamAppId ? `
        steam_paths = [
            Path("C:/Program Files (x86)/Steam/steamapps/common/${validationPath}"),
            Path("D:/Steam/steamapps/common/${validationPath}"),
            Path("E:/Steam/steamapps/common/${validationPath}"),
        ]
        for p in steam_paths:
            if p.exists():
                return str(p)
        ` : ''}
        return ""

    def browse_path(self):
        folder = QFileDialog.getExistingDirectory(self, "Vyberte zložku hry", self.target_game_path or "C:/")
        if folder:
            self.target_game_path = folder
            self.path_lbl.setText(folder)

    def start_installation(self):
        if not self.target_game_path or not os.path.exists(self.target_game_path):
            trigger_shake_animation(self.install_btn)
            QMessageBox.warning(self, "Upozornenie", "${loc.errorSelectPath}")
            return

        # Path validation check
        val_file = Path(self.target_game_path) / "${validationPath}"
        if not val_file.exists():
            trigger_shake_animation(self.install_btn)
            reply = QMessageBox.question(self, "${loc.errorPathTitle}", "${loc.errorPathMsg}", QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No)
            if reply != QMessageBox.StandardButton.Yes:
                return

        self.install_btn.setEnabled(False)
        self.browse_btn.setEnabled(False)

        self.worker = InstallWorker(self.target_game_path, "${validationPath}")
        self.worker.progress.connect(self.on_progress)
        self.worker.finished.connect(self.on_finished)
        self.worker.start()

    def on_progress(self, val, msg):
        self.prog_bar.setValue(val)
        self.status_lbl.setText(msg)

    def on_finished(self, success, msg):
        self.install_btn.setEnabled(True)
        self.browse_btn.setEnabled(True)
        if success:
            self.status_lbl.setText(msg)
            self.install_btn.setText("HOTOVO")
            self.install_btn.setEnabled(False)

            ${effects.successParticleBurst ? `
            # Trigger particle explosion
            center = self.install_btn.geometry().center()
            self.particle_burst.burst(center)
            ` : ''}

            ${enableThankYouModule ? 'self.show_thank_you()' : ''}
        else:
            trigger_shake_animation(self.install_btn)
            QMessageBox.critical(self, "Chyba", f"Inštalácia zlyhala: {msg}")

    def show_thank_you(self):
        dlg = ThankYouDialog(self)
        dlg.exec()
`;

  // Main launcher entry
  const mainRunner = `
def main():
    app = QApplication(sys.argv)
    app.setStyle('Fusion')
    window = AegisMainWindow()
    window.show()
    sys.exit(app.exec())

if __name__ == '__main__':
    main()
`;

  return [
    '# -*- coding: utf-8 -*-',
    '# Generated by Aegis Patcher Generator',
    '# Modern PyQt6 Installer with Active Modular Effects',
    ...pyImports,
    ...effectClasses,
    installerWorkerClass,
    thankYouDialog,
    mainWindowClass,
    mainRunner,
  ].join('\n');
}

/**
 * Batch script to build executable using PyInstaller on Windows.
 */
export function generatePyInstallerBatchScript(): string {
  return `@echo off
chcp 65001 >nul
echo ========================================================
echo       AEGIS PATCHER - PYINSTALLER COMPILER
echo ========================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [CHYBA] Python nie je nainštalovaný alebo nie je v PATH!
    pause
    exit /b 1
)

echo [1/3] Kontrola PyQt6 a PyInstaller...
python -m pip install --quiet PyQt6 pyinstaller

echo [2/3] Kompilácia inštalátora do samostatného EXE...
pyinstaller --noconfirm --onedir --windowed --add-data "Assets;Assets" installer.py

if %ERRORLEVEL% equ 0 (
    echo.
    echo [3/3] HOTOVO! Inštalátor bol úspešne vygenerovaný v zložke 'dist/installer'.
) else (
    echo.
    echo [CHYBA] Kompilácia zlyhala.
)
pause
`;
}
