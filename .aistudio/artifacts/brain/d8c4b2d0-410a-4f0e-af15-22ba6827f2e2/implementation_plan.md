# Grafický Redizajn a Vylepšenie Ovládacích Prvkov: Aegis Patcher Generator

## Prehľad Cieľa

Vylepšenie celkového používateľského rozhrania, ovládacích prvkov a loga aplikácie na štýl **Sleek Modern Studio**:
- **Tmavý grafit a sklenený glassmorphism** s jemným backdrop-blur a luxusnými tenkými ohraničeniami.
- **Nové logo aplikácie v hlavičke**: Štylizovaný taktický Aegis štít s geometriou písmena „A“, vnútorným jadrom a jemnou svetelnou aurou.
- **Moderné ovládacie prvky**: Zjemnené zaoblenia (smooth rounded corners `rounded-lg`), precízne input stavy s mikro-prechodmi a jemným zameriavacím krúžkom (focus ring), vylepšené prepínače platforiem a prémiová typografia s jasnou hierarchiou.
- **Zachovanie funkčných systémov**: Všetky existujúce formuláre, automatické detekcie, skripty, generovanie ZIP, validácie a zvukové efekty zostávajú stopercentne zachované a funkčné.

---

## 1. Nové Logo a Hlavička (Top Bar Contract)

### Vizuál loga Aegis Shield:
- Taktický štít so skosenou geometriou formujúcou písmeno **A** (Aegis).
- Gradientový prechod z prémiovej titánovo-šmaragdovej `#4E6544` do hlbokej grafitovej zelenej `#232E20` s jemným vnútorným jadrom a vonkajším odleskom (subtle aura glow `drop-shadow-[0_0_12px_rgba(110,140,95,0.35)]`).
- Moderný typografický nápis: **AEGIS** s rozšíreným rozostupom (`tracking-[0.18em] font-extrabold`) a decentným podnázvom **PATCHER STUDIO** v elegantnom grafitovom tóne.

### Štýl hlavičky:
- Glassmorphism lišta: `bg-[#0B0F0B]/85 backdrop-blur-md border-b border-[#2A3725]/60`.
- Tlačidlo **Nový projekt**: Prémiový vzhľad s jemným hover glowom a ikonou.
- Prepínač jazyka (SK / CZ): Elegantný segmentovaný prepínač v štýle štúdiového hardvéru.
- Tlačidlo **História**: Tlačidlo s jemným ohraničením a indikátorom uložených projektov.

---

## 2. Architektúra Vzhľadu a Farebná Paleta (Sleek Modern Studio)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛡️ AEGIS PATCHER STUDIO     [+ Nový Projekt]            [SK|CZ] [História] │
├───────────────────────────────┬───────────────────────────────┬─────────────┤
│ Ľavý Panel (Konfigurácia)     │ Živý Náhľad (Live Preview)    │ Pravý Panel │
│  · Grafitové karty            │  · Elegantná floating platform│  · Médiá    │
│  · Jemné border-slate/green   │  · Monochromatický backdrop   │  · 10 Efekt.│
│  · Focus-ring indikátory      │  · Bezrámový herný displej    │  · Súbory   │
│  · Prémiové prepínače platf.  │  · Reálne reagujúce tlačidlá  │  · Generuj  │
└───────────────────────────────┴───────────────────────────────┴─────────────┘
```

- **Pozadie aplikácie**: Hlboký grafit `#090D09` s veľmi jemným ambientným radiálnym gradientom pre hĺbku.
- **Karty a sekcie**: Zjednotené pozadie `#111710` s tenkým ohraničením `#263421`, jemným zaoblením `rounded-lg` a vnútorným paddingom bez zbytočného šumu.
- **Vstupné polia (Inputs)**: Čisté grafitové polia s výškou `h-9`, hladkým textom, decentným placeholderom a moderným focus ringom vo farbe akcentu (`focus:border-[#6E885F] focus:ring-1 focus:ring-[#6E885F]/30`).
- **Tlačidlá a prepínače**: Segmentovaný výber platforiem (Steam, Epic, GOG...) dostane moderné štúdiové vyhotovenie s jasným aktívnym stavom.

---

## 3. Pravý panel a Sekcia Efektov

- Prispôsobenie sekcií (Vizuál a Zvuky, Efekty inštalátora, Priečinky a Súbory) novému vizuálnemu štýlu:
  - Karty efektov s elegantnými tenkými líniami, plynulým zaoblením a aktívnym odleskom.
  - Tlačidlo **Vygenerovať Inštalátor** dostane silný prémiový štúdiový vzhľad s pulzujúcim svetelným lemom, ktorý okamžite upúta pozornosť.

---

## 4. Krok-za-krokom implementácia

1. Vytvorenie dedikovaného SVG komponentu `AegisLogo` s taktickým štítom písmena A a svetelnou aurou.
2. Aktualizácia hlavičky `header` v `src/App.tsx` podľa zmluvy čistého layoutu s novým logom a štúdiovými ovládacími prvkami.
3. Vylepšenie tried formulárových polí, sekcií a akordeónov na štýl Sleek Modern Studio.
4. Overenie a kontrola pomocou `compile_applet` a `lint_applet` pre zaručenie stopercentnej stability.
