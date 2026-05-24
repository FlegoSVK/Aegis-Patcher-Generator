# Aegis Patcher Generator (Lokalizátor)

## Krátky popis
Aegis Patcher Generator je webová aplikácia určená pre autorov a distribútorov slovenských a českých herných prekladov (a iných módov). Umožňuje jednoducho a rýchlo vygenerovať profesionálny a vizuálne lákavý inštalátor (patcher) bez potreby programovania. Užívateľ vyplní základné údaje o preklade, priloží inštalačné súbory a obrázok (banner) a aplikácia vygeneruje hotový ZIP balíček obsahujúci spustiteľný inštalátor v prostredí PowerShell (WPF GUI).
<img width="1580" height="1217" alt="inst apka" src="https://github.com/user-attachments/assets/4280995f-9c41-4350-a32f-5c0547f6bc08" />

## Vlastnosti a funkcie programu

### 1. Základné Informácie (Konfigurácia Inštalátora)
*   **Názov Hry:** Názov hry, pre ktorú je preklad/inštalátor určený. Zobrazuje sa v hlavičke inštalátora.
*   **Autor Prekladu:** Meno autora alebo tímu zodpovedného za preklad.
*   **Link autora:** Odkaz na webovú stránku autora alebo tímu (napr. na komunitnú stránku).
*   **Verzia prekladu:** Aktuálna verzia balíčka lokalizácie (napr. v1.0.0). Zobrazí sa v dizajnovom štítku vpravo hore.
*   **Na verziu hry:** Údaj o verzii samotnej hry, s ktorou je preklad kompatibilný.
*   **Link na stránku prekladu:** URL odkaz na web, Discord alebo fórum, kam sa používateľ môže prekliknúť priamo z bežiaceho inštalátora.
*   **Text podpory a QR Kód (nepovinné):** Umožňuje zobraziť prispôsobiteľný text s výzvou na podporu tvorby. Po kliknutí na odkaz sa v inštalátore zobrazí vizuálny overlay s priloženým QR kódom (napr. PAY by square).
*   **Novinky v tejto verzii (Changelog):** Možnosť pridať zoznam zmien (changelog). V inštalátore sa vytvorí tlačidlo "Zobraziť novinky", po kliknutí sa zobrazí panel s textom aktualizácií.
*   **Farby textu (Hlavná a Sekundárna):** Možnosť prispôsobiť si farbu textov inštalátora, aby ladili s nahraným bannerom.
*   **Overovacia Cesta (napr. názov zložky hry):** Pomáha inštalátoru zistiť, či používateľ vybral na inštaláciu skutočne správnu zložku s hrou. Ak cieľový priečinok neobsahuje definovanú zložku (ako podsložku), inštalátor používateľa pri inštalácii upozorní.
*   **Steam App ID (voliteľné):** Zadajte číselné ID hry zo služby Steam. Výsledný inštalátor pri otvorení automaticky skontroluje systémové registre (`Uninstall\Steam App ID`) a pokúsi sa samostatne vyhľadať a predvyplniť cestu k nainštalovanej hre.
*   **Cesta na uloženie prekladu (nepovinné):** V prípade, že si inštalátor od používateľa žiada iba koreňovú zložku hry, no vaše súbory patria hlbšie do štruktúry (napr. `Game\Content\Paks`), tento parameter inštalátoru oznámi, kam presne má súbory skopírovať vzhľadom na zvolený priečinok.
*   **Informačné bubliny:** Pri prejdení myšou ponad názvy polí sa zobrazí krátka nápoveda (tooltip) vysvetľujúca funkciu jednotlivých parametrov.

### 2. Vzhľad a Multimédiá
*   **Dve Jazykové verzie (Mód SK / CZ):** Priamo v aplikácii si môžete v hornej lište prepnúť rozhranie do Češtiny. Vygenerovaný inštalátor potom bude plne poslovenčený alebo počeštený (tlačidlá, hlášky a texty inštalačného okna odpovedajú zvolenému jazyku).
*   **Obrázok / Banner a QR Kód:** Vizuálna stránka je pre inštalátory veľmi podstatná. Aplikácia umožňuje nahrať vlastný obrázok (banner) a QR kód. Obsahuje **integrovaný nástroj na výrez (crop) bannerov**, takže si ich prispôsobíte presne pre potreby okna inštalátora.
*   **Obrázok na celé okno inštalátora:** Môžete si vybrať z dvoch dizajnov úvodného bannera - klasický banner s elegantným prechodom alebo rozložený na celú veľkosť okna (full-window mód).
*   **Prispôsobenie farieb:** Plná kontrola nad farebnou schémou textov. Môžete zmeniť hlavnú farbu textu a sekundárnu farbu doplňujúcich prvkov a prispôsobiť tak vizuál okna presne vašim požiadavkám (podpora pre farby v Hex kóde s farebným výberníkom).

### 3. Súbory a Inštalačný proces
*   **Pridanie súborov a priečinkov:** Sem vložíte všetky súbory prekladu, ktoré sa majú dostať k finálnemu hráčovi. Systém podporuje výber viacerých individuálnych súborov, ale aj nahranie celých stromových priečinkov.
*   **Bezpečné kopírovanie s ukazovateľom priebehu:** Samotný inštalátor disponuje funkciou Progress Baru, priebežným výpisom názvu kopírovaného súboru, výpočtom celkových percent a validáciou inštalačných adresárov. Pred vygenerovaním ZIP súboru aplikácia rovnako validuje, či ste vyplnili všetky potrebné inštalačné polia.

### 4. Sledovanie histórie a relácií
*   **História predvolieb:** Nemusíte zakaždým všetko vyplňovať ručne. Ak generujete inštalátory pravidelne, stačí otvoriť sekciu "História" na hornej lište a jedným kliknutím načítať predchádzajúci projekt na danú hru.
*   Aplikácia si zachováva všetky nastavenia, históriu a projekty u Vás v internej pamäti prehliadača (LocalStorage). Vaše dáta necestujú na cudzí server.

### 5. Živý Náhľad (Live Preview)
*   **WPF Patcher Mockup Náhľad:** Všetky zmeny (názov hry, verzie, obrázky, farby textov, changelog, QR) sa živo a interaktívne renderujú vo vizuálnom okne priamo v aplikácii, dokonca vrátane dizajnu vyskakovacích (overlay) okien pre podporu a zoznam zmien. Ešte pred vygenerovaním ZIP súboru vidíte finálnu podobu inštalátora v mierke.

### 6. Generovanie ZIP Balíka
*   Stlačením tlačidla **"Vygenerovať ZIP Balík"** (ak sú všetky parametre v poriadku) aplikácia dáta spracuje a priamo klientsky vytvorí inštalátorský archív s využitím JSZip v pamäti Vášho prehliadača.
*   **Výsledný balík obsahuje:**
    *   `Assets/` priečinok: Zabezpečené a priložené obrázky (tzv. `banner.jpg` a `qrcode.jpg`) a doň sa nakopírujú aj všetky inštalačné súbory a priečinky predvyplnené pre lokalizáciu.
    *   `Install.ps1`: Generovaný interaktívny Windows PowerShell skript (s WPF GUI). Plnohodnotný nástroj vybavený ošetrením udalostí, progress barmi, XAML šablónou užívateľského rozhrania, validáciou správne umiestnenej hry, podporou, changelog-om a logikou extrakcie/kopírovania suborov k samotnému užívateľovi.
    *   `Spustit_Preklad.bat`: Jednoduchší, koncovým zákazníkom spúšťaný bootloader, ktorý odovzdáva príkazy (a obchádza reštrikciu exekúcie) hlavnému `Install.ps1` skriptu.

## Zhrnutie
Aplikácia rýchlo, efektívne a dizajnovo odstraňuje potrebu manuálne programovať custom inštalátory pre komunitné lokalizácie. Na jedno kliknutie zostaví kompletný a moderný patch inštalátor na platforme Windows s ohľadom na prevenciu bežných koncových užívateľských chýb.
