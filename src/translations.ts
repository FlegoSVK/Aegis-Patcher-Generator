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
    
    textColorMainInput: 'Farba Textu (Hlavná)',
    textColorMainTooltip: 'Hlavná farba textu (zvyčajne biela alebo svetlá).',
    
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
    scriptUpdate: 'Aktualizovať',
    scriptUninstall: 'Odinštalovať',
    scriptUninstalling: 'Odinštalujem...',
    scriptRestoring: 'Obnovujem:',
    scriptUninstallSuccess: 'Odinštalácia bola úspešná!',
    scriptBackupMissing: 'Záloha neexistuje, pôvodné súbory nebolo možné obnoviť.'
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
    
    textColorMainInput: 'Barva Textu (Hlavní)',
    textColorMainTooltip: 'Hlavní barva textu (obvykle bílá nebo světlá).',
    
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
    scriptUpdate: 'Aktualizovat',
    scriptUninstall: 'Odinstalovat',
    scriptUninstalling: 'Odinstalovávám...',
    scriptRestoring: 'Obnovuji:',
    scriptUninstallSuccess: 'Odinstalace byla úspěšná!',
    scriptBackupMissing: 'Záloha neexistuje, původní soubory nebylo možné obnovit.'
  }
};
