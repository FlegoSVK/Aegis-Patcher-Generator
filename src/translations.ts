export type Language = 'sk' | 'cz';

export const translations = {
  sk: {
    // Header & Meta
    appTitle: 'Aegis Patcher Generator',
    buildEngine: 'Build Engine v2.4.0',
    session: 'Session:',
    historyBtn: 'História',
    
    // History Modal
    historyTitle: 'História nastavení',
    historyClose: 'Zavrieť',
    historyEmpty: 'Žiadna história. Vygenerujte inštalátor pre novú hru.',
    historyGeneratedFor: 'Hra:',
    historyTranslation: 'Preklad:',
    historyDeleteSettings: 'Naozaj chcete vymazať nastavenia pre hru',
    historyDeleteBtn: 'Vymazať',
    
    // Core Info Section
    coreInfoSection: 'Základné Informácie',
    
    gameNameInput: 'Názov Hry',
    gameNameTooltip: 'Zadajte oficiálny názov hry, pre ktorú je preklad určený.',
    
    authorInput: 'Autor Prekladu',
    authorTooltip: 'Vaše meno, prezývka alebo názov prekladateľského tímu.',
    
    authorLinkInput: 'Link autora',
    authorLinkTooltip: 'Zadajte webovú stránku autora (vynechať pre žiadny odkaz).',
    
    transVersionInput: 'Verzia prekladu',
    transVersionTooltip: 'Aktuálna verzia tohto prekladu (napr. v1.0.0, 1.5, a pod.).',
    
    gameVersionInput: 'Na verziu hry',
    gameVersionTooltip: 'Pre akú verziu hry je tento preklad otestovaný a určený.',
    
    transLinkInput: 'Link na stránku prekladu',
    transLinkTooltip: 'Odkaz na stránku, kde si môžu hráči stiahnuť najnovšiu verziu prekladu.',
    
    supportTextInput: 'Text podpory (nepovinné)',
    supportTextTooltip: 'Krátky text, ktorý sa zobrazí vedľa QR kódu, napr. "Podporte vývojára". Nechajte prázdne, ak nechcete zobraziť.',
    
    changelogInput: 'Novinky v tejto verzii (Changelog)',
    changelogTooltip: 'Stručný prehľad zmien a opráv v tejto verzii prekladu.',
    changelogPlaceholder: 'Aké zmeny prináša táto verzia?',
    
    presetInput: 'Farebná Schéma (Predvoľba)',
    presetTooltip: 'Vyberte si predvolenú sadu farieb.',
    presetCustom: 'Vlastná',
    presetDark: 'Tmavá',
    presetLight: 'Svetlá',
    presetCyberpunk: 'Cyberpunk',
    presetForest: 'Lesná',

    advancedSettingsTitle: 'Rozšírené Farebné Nastavenia',
    saveSchemePlaceholder: 'Názov uloženej schémy',
    saveSchemeButton: 'Uložiť',
    savedSchemesTitle: 'Uložené schémy',
    deleteSchemeTitle: 'Vymazať schému',

    colorBgInput: 'Farba Pozadia',
    colorSurfaceInput: 'Farba Povrchu (Polia)',
    colorAccentInput: 'Farba Akcentu (Tlačidlá)',
    randomSchemeButton: 'Generovať náhodnú schému',
    
    colorTextTitleInput: 'Farba Textu (Nadpis)',
    colorTextLinkInput: 'Farba Textu (Odkazy)',
    colorTextStatusInput: 'Farba Textu (Stav)',
    colorTextButtonInput: 'Farba Textu (Tlačidlá)',
    colorTextButtonPrimaryInput: 'Farba Textu (Hlavné tlačidlo)',
    colorTextBadgeInput: 'Farba Textu (Odznak verzie)',

    textColorMainInput: 'Farba Textu (Všeobecná)',
    textColorMainTooltip: 'Hlavná farba textu (zvyčajne biela alebo svetlá).',
    
    contrastLabel: 'Kontrast',
    contrastWarningTitle: 'Nízky kontrast',
    contrastWarningText: 'Kontrastný pomer k pozadiu je príliš nízky ({ratio}:1). Hlavný text by sa mohol zle čítať. Odporúča sa pomer aspoň 4.5:1.',
    
    textColorSecInput: 'Farba Textu (Sekundárna)',
    textColorSecTooltip: 'Menej výrazná farba textu (napr. pre popisky a drobné texty).',
    
    validationPathInput: 'Overovacia Cesta (napr. názov zložky hry)',
    validationPathTooltip: 'Časť cesty inštalácie hry (napr. "Crimson Desert"), pre overenie správneho priečinka.',
    
    steamAppIdInput: 'Steam App ID (voliteľné)',
    steamAppIdTooltip: 'Identifikačné číslo hry na Steame pre automatické nájdenie inštalačného priečinka.',
    
    installRelativePathInput: 'Cesta na uloženie prekladu (nepovinné)',
    installRelativePathTooltip: 'Podpriečinok v inštalačnej zložke, kam sa majú presne nakopírovať súbory prekladu.',
    
    // Media & Visuals Section
    mediaSection: 'Médiá a Vizuál',
    fullWindowImageLabel: 'Obrázok na celé okno inštalátora',
    addBannerBtn: '+ Banner',
    addQrBtn: '+ QR Kód',
    editBtn: 'Upraviť',
    deleteBtn: 'Odstrániť',
    bannerError: 'Chyba pri načítaní bannera',
    qrError: 'Chyba QR',
    
    cropTitle: 'Vystrihnúť Banner',
    cropCancel: 'Zrušiť',
    cropApply: 'Použiť výrez',
    
    // Translation Files Section
    filesSection: 'Pripojené Súbory Prekladu',
    addFilesBtn: '+ Súbory',
    addFolderBtn: '+ Priečinok',
    noFilesFound: 'Žiadne súbory. Pridajte prekladové súbory.',
    dragAndDropZone: 'Sem pretiahnite súbory alebo priečinok, prípadne kliknite pre výber',
    dragAndDropActive: 'Pustite súbory sem...',
    
    // Generator Details
    generateBtn: 'Vygenerovať ZIP Balík',
    generateBtnLoading: 'Generujem Balík...',
    alertMissingFields: 'Prosím, vyplňte všetky povinné polia (Názov Hry, Autor Prekladu, Verzia prekladu, Na verziu hry, Link na stránku prekladu, Overovacia Cesta).',
    alertGenerateError: 'Došlo k chybe pri vytváraní archívu.',
    successMessage: 'ZIP archív bol úspešne vygenerovaný!',
    largeSizeWarningTitle: 'Upozornenie na veľkosť súborov',
    largeSizeWarningText: 'Celková veľkosť pripojených súborov prekladu je {size} MB. Generovanie veľmi veľkých balíkov prekladov môže byť neefektívne a vytvorí nadmerne veľký inštalátor. Chcete napriek tomu vygenerovať balík?',
    largeCountWarningText: 'Upozornenie: Pridali ste veľký počet súborov ({count}). Inštalácia prekladu môže na strane koncového hráča prebiehať veľmi dlho. Odporúča sa pribaliť iba skutočne zmenené/preložené súbory (nie celé nemodifikované priečinky hry). Chcete napriek tomu vygenerovať balík?',
    scriptSyntaxWarning: 'Upozornenie: Vygenerovaný inštalačný skript obsahuje nevyvážené zátvorky (možná chyba syntaxe). ZIP archív bude vygenerovaný, ale skript nemusí fungovať správne.',
    
    // Live Preview
    previewLabel: 'ŽIVÝ NÁHĽAD VZHĽADU',
    previewTranslationHelp: 'Stránka prekladu',
    previewShowNews: 'Zobraziť novinky',
    previewGamePath: 'Cesta k hre:',
    previewBrowse: 'Prehľadávať...',
    previewClose: 'Zavrieť',
    previewInstall: 'Inštalovať Preklad',
    previewValidation: 'Overenie',
    
    // Generated Script Localization
    scriptInstallerTitle: 'Inštalátor - {name} SK preklad',
    scriptAuthor: 'Autor:',
    scriptForGameVersion: 'Pre verziu hry:',
    scriptTranslationPage: 'Stránka prekladu',
    scriptShowNews: 'Zobraziť novinky',
    scriptGamePath: 'Cesta k hre:',
    scriptValidation: 'Overenie',
    scriptBrowse: 'Prehľadávať...',
    scriptReady: 'Pripravený na inštaláciu',
    scriptClose: 'Zavrieť',
    scriptInstall: 'Inštalovať Preklad',
    scriptSupportTitle: 'Podpora Prekladu',
    scriptNewsTitle: 'Novinky v tejto verzii',
    scriptBrowseTitle: 'Vyberte hlavnú zložku hry',
    scriptErrInvalidPath: 'Prosím, vyberte platnú cestu k hre.',
    scriptErrMismatchTitle: 'Upozornenie',
    scriptErrMismatchText: 'Vybraná cesta ($selectedPath) sa pravdepodobne nezhoduje s očakávanou hrou ($ValidationPath).\\n\\nChcete napriek tomu inštalovať do tejto zložky?',
    scriptInstalling: 'Inštalujem...',
    scriptCopying: 'Kopírujem:',
    scriptSuccess: 'Inštalácia bola úspešná!',
    scriptDone: 'Hotovo',
    scriptFailTitle: 'Chyba',
    scriptCriticalErr: 'Kritická chyba inštalátora:',
    scriptBatchEcho: 'Spustam instalator prekladu...',
    scriptBatchErrorExtract: 'Musíte najprv rozbaliť celý ZIP archív (Extrahovať) pred spustením inštalátora!',
    scriptUpdate: 'Aktualizovať',
    scriptUninstall: 'Odinštalovať',
    scriptUninstalling: 'Odinštalujem...',
    scriptRestoring: 'Obnovujem:',
    scriptUninstallSuccess: 'Odinštalácia bola úspešná!',
    scriptBackupMissing: 'Záloha neexistuje, pôvodné súbory nebolo možné obnoviť.',
    
    // Readme text
    readmeSupportTitle: '--- PODPORA PREKLADU ---',
    readmeSupportText: 'Ak chcete podporiť tvorbu tohto prekladu alebo iné komunitné preklady, môžete využiť priložený QR kód v inštalátore (tlačidlo Podpora) alebo v adresári Assets/qrcode.jpg. Ďakujeme!',
    readmeChangelogTitle: '--- NOVINKY V TEJTO VERZII ---',
    readmeInstructionTitle: '--- NÁVOD NA INŠTALÁCIU ---',
    readmeInstStep1: '1. Rozbaľte (Extrahujte) celý obsah stiahnutého ZIP archívu do prázdnej zložky vo vašom PC.',
    readmeInstStep1Desc: '   (Nerozbaľujte a nespúšťajte inštalátor priamo v archíve!)',
    readmeInstStep2: '2. Spustite súbor "Spustit_Preklad.bat".',
    readmeInstStep3: '3. Inštalátor sa pokúsi automaticky nájsť cestu k hre. Ak sa mu to nepodarí, kliknite na tlačidlo "Prehľadávať..." a vyberte hlavný priečinok s hrou.',
    readmeInstStep4: '4. Po správnom výbere cesty sa odomkne tlačidlo "Inštalovať". Kliknite naň.',
    readmeInstStep5: '5. Inštalátor automaticky zazálohuje pôvodné súbory (ak ich prepisuje) a skopíruje preklad.',
    readmeUninstallTitle: '--- ODINŠTALÁCIA ---',
    readmeUninstStep1: '1. Opäť spustite "Spustit_Preklad.bat" (inštalátor).',
    readmeUninstStep2: '2. Uistite sa, že máte vybratú správnu cestu k hre.',
    readmeUninstStep3: '3. Objaví sa tlačidlo "Odinštalovať". Kliknite naň.',
    readmeUninstStep4: '4. Inštalátor zmaže preložené súbory a obnoví originálne herné súbory zo zálohy (ak sa prepisovali).',
    readmeEnjoy: 'Užite si preklad!'
  },
  cz: {
    // Header & Meta
    appTitle: 'Aegis Patcher Generator',
    buildEngine: 'Build Engine v2.4.0',
    session: 'Session:',
    historyBtn: 'Historie',
    
    // History Modal
    historyTitle: 'Historie nastavení',
    historyClose: 'Zavřít',
    historyEmpty: 'Žádná historie. Vygenerujte instalátor pro novou hru.',
    historyGeneratedFor: 'Hra:',
    historyTranslation: 'Překlad:',
    historyDeleteSettings: 'Opravdu chcete smazat nastavení pro hru',
    historyDeleteBtn: 'Smazat',
    
    // Core Info Section
    coreInfoSection: 'Základní Informace',
    
    gameNameInput: 'Název Hry',
    gameNameTooltip: 'Zadejte oficiální název hry, pro kterou je překlad určen.',
    
    authorInput: 'Autor Překladu',
    authorTooltip: 'Vaše jméno, přezdívka nebo název překladatelského týmu.',
    
    authorLinkInput: 'Odkaz na autora',
    authorLinkTooltip: 'Zadejte webovou stránku autora (vynechat pro žádný odkaz).',
    
    transVersionInput: 'Verze překladu',
    transVersionTooltip: 'Aktuální verze tohoto překladu (např. v1.0.0, 1.5, apod.).',
    
    gameVersionInput: 'Na verzi hry',
    gameVersionTooltip: 'Pro jakou verzi hry je tento překlad otestován a určen.',
    
    transLinkInput: 'Odkaz na stránku překladu',
    transLinkTooltip: 'Odkaz na stránku, kde si mohou hráči stáhnout nejnovější verzi překladu.',
    
    supportTextInput: 'Text podpory (nepovinné)',
    supportTextTooltip: 'Krátký text, který se zobrazí vedle QR kódu, např. "Podpořte vývojáře". Nechte prázdné, pokud nechcete zobrazit.',
    
    changelogInput: 'Novinky v této verzi (Changelog)',
    changelogTooltip: 'Stručný přehled změn a oprav v této verzi překladu.',
    changelogPlaceholder: 'Jaké změny přináší tato verze?',
    
    presetInput: 'Barevné Schéma (Předvolba)',
    presetTooltip: 'Vyberte si předvolenou sadu barev.',
    presetCustom: 'Vlastní',
    presetDark: 'Tmavá',
    presetLight: 'Světlá',
    presetCyberpunk: 'Cyberpunk',
    presetForest: 'Lesní',

    advancedSettingsTitle: 'Rozšířená Barevná Nastavení',
    saveSchemePlaceholder: 'Název uloženého schématu',
    saveSchemeButton: 'Uložit',
    savedSchemesTitle: 'Uložená schémata',
    deleteSchemeTitle: 'Vymazat schéma',

    colorBgInput: 'Barva Pozadí',
    colorSurfaceInput: 'Barva Povrchu (Pole)',
    colorAccentInput: 'Barva Akcentu (Tlačítka)',
    randomSchemeButton: 'Generovat náhodné schéma',
    
    colorTextTitleInput: 'Barva Textu (Nadpis)',
    colorTextLinkInput: 'Barva Textu (Odkazy)',
    colorTextStatusInput: 'Barva Textu (Stav)',
    colorTextButtonInput: 'Barva Textu (Tlačítka)',
    colorTextButtonPrimaryInput: 'Barva Textu (Hlavní tlačítko)',
    colorTextBadgeInput: 'Barva Textu (Odznak verze)',

    textColorMainInput: 'Barva Textu (Obecná)',
    textColorMainTooltip: 'Hlavní barva textu (obvykle bílá nebo světlá).',
    
    contrastLabel: 'Kontrast',
    contrastWarningTitle: 'Nízký kontrast',
    contrastWarningText: 'Kontrastní poměr k pozadí je příliš nízký ({ratio}:1). Hlavní text by se mohl špatně číst. Doporučuje se poměr alespoň 4.5:1.',
    
    textColorSecInput: 'Barva Textu (Sekundární)',
    textColorSecTooltip: 'Méně výrazná barva textu (např. pro popisky a drobné texty).',
    
    validationPathInput: 'Ověřovací Cesta (např. název složky hry)',
    validationPathTooltip: 'Část cesty instalace hry (např. "Crimson Desert"), pro ověření správné složky.',
    
    steamAppIdInput: 'Steam App ID (volitelné)',
    steamAppIdTooltip: 'Identifikační číslo hry na Steamu pro automatické nalezení instalační složky.',
    
    installRelativePathInput: 'Cesta k uložení překladu (nepovinné)',
    installRelativePathTooltip: 'Podsložka v instalační složce, kam se mají přesně nakopírovat soubory překladu.',
    
    // Media & Visuals Section
    mediaSection: 'Média a Vizuál',
    fullWindowImageLabel: 'Obrázek na celé okno instalátoru',
    addBannerBtn: '+ Banner',
    addQrBtn: '+ QR Kód',
    editBtn: 'Upravit',
    deleteBtn: 'Odstranit',
    bannerError: 'Chyba při načítání banneru',
    qrError: 'Chyba QR',
    
    cropTitle: 'Vyříznout Banner',
    cropCancel: 'Zrušit',
    cropApply: 'Použít výřez',
    
    // Translation Files Section
    filesSection: 'Připojené Soubory Překladu',
    addFilesBtn: '+ Soubory',
    addFolderBtn: '+ Složka',
    noFilesFound: 'Žádné soubory. Přidejte soubory překladu.',
    dragAndDropZone: 'Sem přetáhněte soubory nebo složku, případně klikněte pro výběr',
    dragAndDropActive: 'Pusťte soubory sem...',
    
    // Generator Details
    generateBtn: 'Vygenerovat ZIP Balíček',
    generateBtnLoading: 'Generuji Balíček...',
    alertMissingFields: 'Prosím, vyplňte všechna povinná pole (Název Hry, Autor Překladu, Verze překladu, Na verzi hry, Odkaz na stránku překladu, Ověřovací Cesta).',
    alertGenerateError: 'Došlo k chybě při vytváření archivu.',
    successMessage: 'ZIP archiv byl úspěšně vygenerován!',
    largeSizeWarningTitle: 'Upozornění na velikost souborů',
    largeSizeWarningText: 'Celková velikost připojených souborů překladu je {size} MB. Generování velmi velkých balíčků překladů může být neefektivní a vytvoří nadměrně velký instalátor. Chcete přesto vygenerovat balíček?',
    largeCountWarningText: 'Upozornění: Přidali jste velký počet souborů ({count}). Instalace překladu může na straně koncového hráče probíhat velmi dlouho. Doporučuje se přibalit pouze skutečně změněné/přeložené soubory (ne celé nemodifikované složky hry). Chcete přesto vygenerovat balíček?',
    scriptSyntaxWarning: 'Upozornění: Vygenerovaný instalační skript obsahuje nevyvážené závorky (možná chyba syntaxe). ZIP archiv bude vygenerován, ale skript nemusí fungovat správně.',
    
    // Live Preview
    previewLabel: 'ŽIVÝ NÁHLED VZHLEDU',
    previewTranslationHelp: 'Stránka překladu',
    previewShowNews: 'Zobrazit novinky',
    previewGamePath: 'Cesta k hře:',
    previewBrowse: 'Procházet...',
    previewClose: 'Zavřít',
    previewInstall: 'Instalovat Překlad',
    previewValidation: 'Ověření',
    
    // Generated Script Localization
    scriptInstallerTitle: 'Instalátor - {name} CZ překlad',
    scriptAuthor: 'Autor:',
    scriptForGameVersion: 'Pro verzi hry:',
    scriptTranslationPage: 'Stránka překladu',
    scriptShowNews: 'Zobrazit novinky',
    scriptGamePath: 'Cesta k hře:',
    scriptValidation: 'Ověření',
    scriptBrowse: 'Procházet...',
    scriptReady: 'Připraven k instalaci',
    scriptClose: 'Zavřít',
    scriptInstall: 'Instalovat Překlad',
    scriptSupportTitle: 'Podpora Překladu',
    scriptNewsTitle: 'Novinky v této verzi',
    scriptBrowseTitle: 'Vyberte hlavní složku hry',
    scriptErrInvalidPath: 'Prosím, vyberte platnou cestu k hře.',
    scriptErrMismatchTitle: 'Upozornění',
    scriptErrMismatchText: 'Vybraná cesta ($selectedPath) se pravděpodobně neshoduje s očekávanou hrou ($ValidationPath).\\n\\nChcete přesto instalovat do této složky?',
    scriptInstalling: 'Instaluji...',
    scriptCopying: 'Kopíruji:',
    scriptSuccess: 'Instalace byla úspěšná!',
    scriptDone: 'Hotovo',
    scriptFailTitle: 'Chyba',
    scriptCriticalErr: 'Kritická chyba instalátoru:',
    scriptBatchEcho: 'Spoustim instalator prekladu...',
    scriptBatchErrorExtract: 'Musíte nejprve rozbalit celý ZIP archiv (Extrahovat) před spuštěním instalátoru!',
    scriptUpdate: 'Aktualizovat',
    scriptUninstall: 'Odinstalovat',
    scriptUninstalling: 'Odinstalovávám...',
    scriptRestoring: 'Obnovuji:',
    scriptUninstallSuccess: 'Odinstalace byla úspěšná!',
    scriptBackupMissing: 'Záloha neexistuje, původní soubory nebylo možné obnovit.',
    
    // Readme text
    readmeSupportTitle: '--- PODPORA PŘEKLADU ---',
    readmeSupportText: 'Pokud chcete podpořit tvorbu tohoto překladu nebo jiné komunitní překlady, můžete využít přiložený QR kód v instalátoru (tlačítko Podpora) nebo v adresáři Assets/qrcode.jpg. Děkujeme!',
    readmeChangelogTitle: '--- NOVINKY V TÉTO VERZI ---',
    readmeInstructionTitle: '--- NÁVOD K INSTALACI ---',
    readmeInstStep1: '1. Rozbalte (Extrahujte) celý obsah staženého ZIP archivu do prázdné složky ve vašem PC.',
    readmeInstStep1Desc: '   (Nerozbalujte a nespouštějte instalátor přímo v archivu!)',
    readmeInstStep2: '2. Spusťte soubor "Spustit_Preklad.bat".',
    readmeInstStep3: '3. Instalátor se pokusí automaticky najít cestu k hře. Pokud se mu to nepodaří, klikněte na tlačítko "Procházet..." a vyberte hlavní složku s hrou.',
    readmeInstStep4: '4. Po správném výběru cesty se odemkne tlačítko "Instalovat". Klikněte na něj.',
    readmeInstStep5: '5. Instalátor automaticky zazálohuje původní soubory (pokud je přepisuje) a zkopíruje překlad.',
    readmeUninstallTitle: '--- ODINSTALACE ---',
    readmeUninstStep1: '1. Opět spusťte "Spustit_Preklad.bat" (instalátor).',
    readmeUninstStep2: '2. Ujistěte se, že máte vybranou správnou cestu k hře.',
    readmeUninstStep3: '3. Objeví se tlačítko "Odinstalovat". Klikněte na něj.',
    readmeUninstStep4: '4. Instalátor smaže přeložené soubory a obnoví originální herní soubory ze zálohy (pokud se přepisovaly).',
    readmeEnjoy: 'Užijte si překlad!'
  }
};
