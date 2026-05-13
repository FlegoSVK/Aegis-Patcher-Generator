# Aegis Patcher Generator (Lokalizátor)

## Krátky popis
Aegis Patcher Generator je webová aplikácia určená pre autorov a distribútorov slovenských herných prekladov (a iných módov). Umožňuje jednoducho a rýchlo vygenerovať profesionálny a vizuálne lákavý inštalátor (patcher) bez potreby programovania. Užívateľ vyplní základné údaje o preklade, priloží inštalačné súbory a obrázok (banner) a aplikácia vygeneruje hotový ZIP balíček obsahujúci spustiteľný inštalátor v prostredí PowerShell (WPF GUI).
<img width="1564" height="1110" alt="image" src="https://github.com/user-attachments/assets/246f767b-177f-43a3-b55a-6289d6b211b2" />

## Vlastnosti a funkcie programu

### 1. Základné Informácie (Konfigurácia Inštalátora)
*   **Názov Hry:** Názov hry, pre ktorú je preklad/inštalátor určený. Zobrazuje sa v hlavičke inštalátora.
*   **Autor Prekladu:** Meno autora alebo tímu zodpovedného za preklad.
*   **Verzia prekladu:** Aktuálna verzia balíčka lokalizácie (napr. v1.0.0). Zobrazí sa v dizajnovom štítku vpravo hore.
*   **Na verziu hry:** Údaj o verzii samotnej hry, s ktorou je preklad kompatibilný.
*   **Link na stránku prekladu:** URL odkaz na web, Discord alebo fórum, kam sa používateľ môže prekliknúť priamo z bežiaceho inštalátora.
*   **Overovacia Cesta (napr. názov zložky hry):** Veľmi dôležitý prvok. Pomáha inštalátoru zistiť, či používateľ vybral na inštaláciu skutočne správnu zložku s hrou. Inštalátor vyhľadá tento reťazec alebo parsuje cestu, aby znížil riziko zlej inštalácie z dôvodu nepozornosti používateľa.
*   **Cesta na uloženie prekladu (nepovinné):** V prípade, že si inštalátor od používateľa žiada iba koreňovú zložku hry, no vaše súbory patria hlbšie do štruktúry (napr. `Content\Paks`), tento parameter inštalátoru oznámi, kam presne má súbory skopírovať.

### 2. Multimédiá a Súbory
*   **Obrázok / Banner:** Vizuálna stránka je pre inštalátory veľmi podstatná. Aplikácia umožňuje nahrať vlastný obrázok (ideálne screenshot z hry). Obsahuje **integrovaný nástroj na výrez (crop)**, takže si ho prispôsobíte presne pre potreby okna inštalátora.
*   **Obrázok na celé okno inštalátora:** Môžete si vybrať z dvoch dizajnov úvodného bannera - môže byť umiestnený len vo vrchnej časti (klasický banner) s elegantným prechodom do popredia, alebo rozložený na celú veľkosť okna (full-window mód).
*   **Pridanie súborov a priečinkov:** Sem vložíte všetky súbory prekladu, ktoré sa majú dostať k finálnemu hráčovi. Systém podporuje výber viacerých individuálnych súborov, ale aj nahranie celých stromových priečinkov.

### 3. Sledovanie histórie a relácií
*   **História predvolieb:** Nemusíte zakaždým všetko vyplňovať ručne. Ak generujete inštalátory pravidelne, stačí otvoriť sekciu "História" na hornej lište a jedným kliknutím načítať predchádzajúci projekt na danú hru.
*   Aplikácia si zachováva všetky nastavenia a projekty u Vás v internej pamäti prehliadača (LocalStorage). Vaše dáta necestujú na cudzí server.

### 4. Živý Náhľad (Live Preview)
*   **WPF Patcher Mockup Náhľad:** Všetky zmeny (názov hry, verzie, obrázky, výber zobrazenia okna) sa živo a interaktívne renderujú vo vizuálnom systéme priamo na pravej strane obrazovky. Ešte pred vygenerovaním ZIP súboru vidíte podobu okna inštalátora.

### 5. Generovanie ZIP Balíka
*   Stlačením tlačidla **"Vygenerovať ZIP Balík"** aplikácia všetky dáta spracuje a plne klientsky vytvorí inštalátorský archív s využitím JSZip priamo v pamäti Vášho prehliadača.
*   **Výsledný balík obsahuje:**
    *   `Assets/` priečinok: Zabezpečené a priložené obrázky a všetky podadresáre, do ktorých ste vložili inštalačné súbory daného prekladu.
    *   `Install.ps1`: Generovaný interaktívny Windows PowerShell skript využívajúci PresentationFramework (WPF). Reálny funkčný inštalátor obsahujúci dizajnové GUI, logiku vyhľadávania a validácie vybratého repozitára, kopírovania a informovania užívateľa o stave a prípadných chybách.
    *   `Spustit_Preklad.bat`: Mini-spúšťač, na ktorý používateľ klikne po extrahovaní vo svojom systéme (Bypass politika PowerShell skriptov).

## Zhrnutie
Aplikácia efektívne odstraňuje potrebu manuálne programovať custom inštalátory. Na jeden klik vygeneruje elegantný, temne ladený Windows inštalátor pre Váš preklad so zabezpečením proti hlúpym chybám pri výbere hernej inštalačnej cesty koncovým používateľom.
