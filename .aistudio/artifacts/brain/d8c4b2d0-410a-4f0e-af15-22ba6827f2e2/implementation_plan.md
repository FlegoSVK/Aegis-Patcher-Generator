# Plán obnovy maximálnej spoľahlivosti inštalátorov Aegis Patcher

Komplexná oprava a stabilizácia generátora exportovaných inštalátorov (`Spustit_Preklad.bat` a `Install.ps1`) tak, aby sa inštalátor garantovane a okamžite spustil na každom počítači so systémom Windows bez nutnosti inštalovať ďalší softvér.

## Používateľské rozhodnutia a potvrdené voľby

> [!IMPORTANT]
> Na základe Vašich odpovedí v 1. fáze plánovania sme potvrdili nasledovné kľúčové princípy:

- **Potvrdené rozhodnutie 1 (Priorita spúšťania)**: Štartovací skript `Spustit_Preklad.bat` spúšťa priamo čistý a overený PowerShell WPF inštalátor (`Install.ps1`). Odstránia sa nespoľahlivé volania Pythona a Microsoft Store aliasov, ktoré na cudzích počítačoch spôsobovali okamžité pády a blikanie okna.
- **Potvrdené rozhodnutie 2 (Stabilita vizuálnych efektov)**: Vizuálne a zvukové efekty (kliknutie, animácia chyby, častice) zostanú plne zachované, no budú implementované bezpečným natívnym spôsobom (bezpečné XAML šablóny a izolované `try-catch` bloky v PowerShell), ktoré nemôžu narušiť štart inštalátora ani na starších či prísne zabezpečených Windows systémoch.

---

## 1. Prehľad a podstata riešenia

- **Čo riešenie prináša**: Návrat k overenej 100 % stabilite predchádzajúcej verzie s ponechaním moderných vizuálnych a zvukových efektov. Exportovaný archív bude fungovať "na prvý dvojklik" na Windows 10, 11 aj starších verziách bez akýchkoľvek predpokladov (bez nutnosti mať Python, PyQt6 či vývojárske nástroje).
- **Cieľová skupina**: Bežní hráči a používatelia prekladov, ktorí si stiahnu ZIP balíček a chcú jednoducho spustiť `Spustit_Preklad.bat`.
- **Kľúčová hodnota**: Odstránenie chýb typu `is not recognized`, zamedzenie zatváraniu okna dávkového súboru a bezchybný nábeh grafického rozhrania.

---

## 2. Používateľský zážitok a vizuálna stránka

- **Spustenie pre používateľa**:
  1. Používateľ rozbalí ZIP archív s prekladom.
  2. Dvojklikom otvorí `Spustit_Preklad.bat`.
  3. Dávkový súbor nastaví pracovný priečinok (`cd /d "%~dp0"`), overí integritu rozbalenia a okamžite vyvolá WPF grafické rozhranie.
  4. Okno inštalátora Aegis sa zobrazí vycentrované, s plynulými interaktívnymi tlačidlami, bannerom hry a overovacou cestou.
- **Bezpečné efekty**:
  - **Zvuková odozva (Sound Click Feedback)**: Prehratie `click.wav` cez vstavaný Windows multimediálny systém s tichým fallbackom (ak používateľ nemá zvukové zariadenie, inštalátor normálne pokračuje).
  - **Animácia zatrasenia (Shake Animation)**: Pri neplatnej ceste sa vstup vizuálne zatrasie cez štandardný WPF `DoubleAnimation`.
  - **Efekt častíc (Particle Burst)**: Po úspešnom nainštalovaní sa na obrazovke zobrazí oslavná animácia dokončenia.
  - **Reakcia tlačidiel**: Plynulá zmena priesvitnosti, svetelný obrys pri prejdení myšou a fyzické stlačenie bez poškodenia XAML schémy.

---

## 3. Kľúčové produktové a technické rozhodnutia

- **Rozhodnutie 1: Návrat k priamemu spúšťaniu cez PowerShell WPF**
  - *Zvolený prístup*: `Spustit_Preklad.bat` priamo volá `powershell.exe -NoProfile -ExecutionPolicy Bypass -STA -File "%~dp0Install.ps1"`.
  - *Prečo*: Windows 10 a 11 majú PowerShell a WPF natívne zabudovaný v každej inštalácii. Pokusy o detekciu `python.exe` spôsobovali spúšťanie Windows Store stubov a pád s chybami v príkazovom riadku.
  - *PyQt6 podpora*: Skript `installer.py` a dávkový skript `compile_pyqt.bat` v archíve zostávajú pre autorov, ktorí chcú skompilovať standalone `.exe`. Hlavný launcher však bežnému hráčovi vždy spoľahlivo spustí overený natívny inštalátor.

- **Rozhodnutie 2: Ošetrenie pracovného priečinka a medzier v cestách**
  - *Zvolený prístup*: Použitie `cd /d "%~dp0"` na začiatku `.bat` skriptu a dynamické určenie `$PSScriptRoot` v PowerShell.
  - *Prečo*: Ak je inštalátor v priečinku s medzerami (napr. `D:\Hry\Preklad 2\`), relatívne cesty a parametre musia byť presne definované.

- **Rozhodnutie 3: Bezpečná XAML šablóna s dvojitým fallbackom**
  - *Zvolený prístup*: Využitie osvedčeného `[System.Xml.XmlNodeReader]` s fallbackom na `[System.Windows.Markup.XamlReader]::Parse`.
  - *Prečo*: Zabraňuje akejkoľvek nekompatibilite XML parsera v rôznych jazykových lokalizáciách Windows.

---

## 4. Technická architektúra a tok dát

### Schéma spúšťania a toku inštalátora

```
┌────────────────────────────────────────────────────────┐
│                   ZIP ARCHÍV PREKLADU                  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
              ┌───────────────────────────┐
              │    Spustit_Preklad.bat    │
              │  - Nastaví kódovanie UTF-8│
              │  - cd /d "%~dp0"          │
              │  - Overí rozbalenie ZIPu  │
              └─────────────┬─────────────┘
                            │ Spúšťa s -STA a Bypass
                            ▼
              ┌───────────────────────────┐
              │        Install.ps1        │
              │  - Zistí $PSScriptRoot    │
              │  - Načíta bezpečné WPF    │
              │  - Spustí UI a Eventy     │
              └─────────────┬─────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
 ┌─────────────────────┐         ┌─────────────────────┐
 │ Grafické okno (WPF) │         │   Nainštalovanie    │
 │ - Banner a téma     │         │ - Záloha originálov │
 │ - Efekty tlačidiel  │         │ - Kopírovanie dát   │
 │ - Zvuk kliknutia    │         │ - Overenie hashov   │
 │ - Zatrasenie chýb   │         │ - Časticový efekt   │
 └─────────────────────┘         └─────────────────────┘
```

### Kľúčové technické kroky implementácie:

1. **Optimalizácia `generateBatchScript` v `src/App.tsx`**:
   - Čistý, bezpečný dávkový súbor bez mätúcich vetiev, zaručujúci okamžité otvorenie inštalátora.
   - Správne CRLF konce riadkov.
2. **Revízia a stabilizácia XAML šablóny v `generatePowerShellScript`**:
   - Odstránenie riskantných vnorených transformácií v XAML triggéroch, ktoré zlyhávali pri parsovaní.
   - Presunutie dynamických efektov (Scale, Glow, Click Sound, Shake) do bezpečného PowerShell kódu zaisteného cez `try-catch`.
3. **Overenie buildu a syntaxe**:
   - Spustenie `compile_applet` a `lint_applet` pre overenie bezchybnej kompilácie.
