import * as cr from './cr';
import type { DefaultBrowserInfo } from './cr/default_browser_browser_proxy';
import type { SearchEngine, SearchEnginesInfo } from './cr/search_engines_browser_proxy';

declare namespace globalThis {
    namespace chrome {
        function send(msg: string, params?: any[]): void;
    }
}

if (import.meta.env.DEV) {

let chrome: Record<string, Function> = {};

if (!('chrome' in globalThis)) {
    Object.assign(globalThis, { chrome });
} else {
    chrome = globalThis.chrome as typeof chrome;
}

const prefs: Record<string, unknown> = {
    'completed_onboarding': false,
    'services.bangs': true,
    'services.enabled': true,
    'services.ext_proxy': true,
    'services.origin_override': '',
    'services.user_consented': false,
    'services.spellcheck_files': true,
    'services.browser_updates': true,
};

const searchEngineTemplate: SearchEngine = {
    canBeActivated: false,
    canBeDeactivated: false,
    canBeDefault: true,
    canBeEdited: true,
    canBeRemoved: true,
    default: false,
    displayName: '',
    iconPath: 'chrome://theme/IDR_DUMMY_ICON_DOT_COM@2x',
    iconURL: "https://dummy.invalid/favicon.ico",
    id: -1,
    isManaged: false,
    isOmniboxExtension: false,
    isPrepopulated: true,
    isStarterPack: false,
    keyword: 'domain.com',
    modelIndex: -1,
    name: 'Search',
    shouldConfirmDeletion: true,
    url: 'https://dummy.invalid/suggest?q=%s',
    urlLocked: true
};

const searchEngines: SearchEnginesInfo = {
    actives: [],
    defaults: [],
    extensions: [],
    others: []
};

let currentDefault = 0;

const actualDefaults: [string, number, string, number, boolean][] = [
    ["DuckDuckGo", 6, "duckduckgo.com", 0, true],
    ["Kagi", 7, "kagi.com", 1, false],
    ["Ecosia", 3, "ecosia.org", 2, false],
    ["Qwant", 4, "qwant.com", 3, false],
    ["Microsoft Bing", 2, "bing.com", 4, false],
    ["Google", 5, "google.com", 5, false],
];

for (const [ name, id, keyword, modelId, isDefault ] of actualDefaults) {
    const engine = structuredClone(searchEngineTemplate);
    engine.name = name;
    engine.displayName = name;
    if (isDefault) engine.displayName += ` (Default)`;
    engine.id = id;
    engine.modelIndex = modelId;
    engine.keyword = keyword;
    engine.default = isDefault;
    searchEngines.defaults.push(engine);
}

const defaultBrowser: DefaultBrowserInfo = {
    canBeDefault: true,
    isDefault: false,
    isDisabledByPolicy: false,
    isUnknownError: false,
};

let profileName = 'Work';

let importerListLoaded = false;

const ff_has = new Set(["autofillFormData", "favorites", "history"]);
const chrome_has = new Set(["extensions", "history", "passwords"]);
const chrome_has_favs = new Set([...chrome_has, "favorites"]);
const safari_has = new Set(["favorites"]);

const importerListSimple = [
    [ "Mozilla Firefox", "default release", ff_has ],
    [ "Google Chrome", "Your Chrome", chrome_has_favs ],
    [ "Google Chrome Beta", "Your Chrome", chrome_has_favs ],
    [ "Google Chrome Dev", "Your Chrome", chrome_has_favs ],
    [ "Google Chrome Canary", "Your Chrome", chrome_has_favs ],
    [ "Chromium", "Work", chrome_has ],
    [ "Chromium", "Play", chrome_has ],
    [ "Vivaldi", "Work", chrome_has_favs ],
    [ "Opera", "lalala", chrome_has_favs ],
    [ "Yandex", "сидим пердим", chrome_has_favs ],
    [ "NAVER Whale", "Work", chrome_has ],
    [ "Arc", "Person 1", chrome_has ],
    [ "Microsoft Edge", "Profile 1", chrome_has ],
    [ "Microsoft Edge", "Bill Gates", chrome_has ],
    [ "Brave", "Work", chrome_has_favs ],
    [ "Brave", "Jork", chrome_has_favs ],
    [ "Brave", "New Jork", chrome_has_favs ],
    [ "Safari", "", safari_has ],
    [ "Bookmarks HTML File", "", safari_has ]
] as const;

const importerList: cr.BrowserProfile[] = importerListSimple.map((data, index) => {
    const [ name, profileName, features ] = data;
    return {
        name,
        index,
        profileName,
        history: features.has('history'),
        favorites: features.has('favorites'),
        passwords: features.has('passwords'),
        search: features.has('search'),
        autofillFormData: features.has('autofillFormData'),
        extensions: features.has('extensions')
    };
});

const necessary_keys: (keyof cr.WhatToImport)[] = [
    'import_dialog_autofill_form_data',
    'import_dialog_bookmarks',
    'import_dialog_history',
    'import_dialog_saved_passwords',
    'import_dialog_search_engine',
    'import_dialog_extensions'
];

const _send_polyfill = (msg: string, params?: any[]) => {
    console.log(msg, params);

    if (msg === 'getPrefs') {
        cr.webUIResponse(params![0], true, { ...prefs });
    } else if (msg === 'setPref') {
        const [id, name, new_val] = params! as [string, string, any];

        const cur_val = prefs[name];
        if (typeof name !== 'string') {
            cr.webUIResponse(id, false, 'invalid name');
        } else if (cur_val === undefined) {
            cr.webUIResponse(id, false, `helium.${name} does not exist`);
        } else if (typeof cur_val !== typeof new_val) {
            cr.webUIResponse(id, false, 'invalid value type');
        } else {
            prefs[name] = new_val;
            cr.webUIResponse(id, true, null);
            cr.webUIListenerCallback('helium-prefs-changed', {...prefs});
        }
    } else if (msg === 'getSearchEnginesList') {
        cr.webUIResponse(params![0], true, searchEngines);
    } else if (msg === 'getProfileName') {
        cr.webUIResponse(params![0], true, profileName);
    } else if (msg === 'setProfileName') {
        profileName = params![0];
    } else if (msg === 'setDefaultSearchEngine') {
        const currentDefaultEngine = searchEngines.defaults[currentDefault];
        currentDefaultEngine.displayName = currentDefaultEngine.name;
        currentDefaultEngine.default = false;
        if (params && params.length >= 1) {
            const modelIndex = +params[0];
            const nextDefaultEngine = searchEngines.defaults[modelIndex];
            nextDefaultEngine.default = true;
            nextDefaultEngine.displayName = `${nextDefaultEngine.name} (Default)`;
            currentDefault = modelIndex;
        }
        cr.webUIListenerCallback('search-engines-changed', structuredClone(searchEngines));
    } else if (msg === 'requestDefaultBrowserState') {
        cr.webUIResponse(params![0], true, defaultBrowser);
    } else if (msg === 'setAsDefaultBrowser') {
        defaultBrowser.isDefault = true;
        cr.webUIListenerCallback('browser-default-state-changed', structuredClone(defaultBrowser));
    } else if (msg === 'initializeImportDialog') {
        importerListLoaded = true;
        cr.webUIResponse(params![0], true, structuredClone(importerList));
    } else if (msg === 'importData' || msg === 'importFromBookmarksFile') {
        if (!importerListLoaded) {
            return;
        }

        if (msg !== 'importFromBookmarksFile') {
            const id: number = params![0];
            const imports: cr.WhatToImport = params![1];

            if (id < 0 || id > importerList.length) {
                return cr.webUIListenerCallback(
                    'import-data-status-changed',
                    cr.ImportDataStatus.FAILED
                );
            }

            if (necessary_keys.some(k => typeof imports[k] !== 'boolean')) {
                return alert('browser crash');
            }
        }

        setTimeout(() => {
            cr.webUIListenerCallback('import-data-status-changed', cr.ImportDataStatus.IN_PROGRESS);
        }, 100);

        setTimeout(() => {
            cr.webUIListenerCallback(
                'import-data-status-changed',
                Math.random() < 0.5
                ? cr.ImportDataStatus.FAILED
                : cr.ImportDataStatus.SUCCEEDED
            );
        }, 2000);
    } else if (params?.[0]) {
        cr.webUIResponse(params[0], false, 'unknown method');
    }
}

if (!('send' in chrome)) {
    chrome.send = _send_polyfill;
    console.log('polyfilled chrome.send()');
}

} /* if(import.meta.env.DEV) */
