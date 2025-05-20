import { derived, readable } from "svelte/store";
import * as cr from "../cr";

let setProfiles: (_: cr.BrowserProfile[]) => void;

const browser = cr.ImportDataBrowserProxyImpl.getInstance();

const importableProfilesRaw = readable<cr.BrowserProfile[]>([], (set) => {
    browser.initializeImportDialog().then(set);
    setProfiles = set;
});

export const importableProfiles = derived(importableProfilesRaw, $profiles => {
    return $profiles.filter(p => {
        return !p.name.toLowerCase().includes('html');
    });
});

export type WhatToImport = Partial<{
    autofillFormData: boolean,
    bookmarks: boolean,
    history: boolean,
    savedPasswords: boolean,
    searchEngine: boolean,
    extensions: boolean
}>;

const convertTasks = (tasks: WhatToImport): cr.WhatToImport => {
    return {
        import_dialog_autofill_form_data: !!tasks.autofillFormData,
        import_dialog_bookmarks: !!tasks.bookmarks,
        import_dialog_history: !!tasks.history,
        import_dialog_saved_passwords: !!tasks.savedPasswords,
        import_dialog_search_engine: !!tasks.searchEngine,
        import_dialog_extensions: !!tasks.extensions
    };
}

type Action = () => void;
let queue: [number, cr.WhatToImport, Action, Action][] = [];

const runNext = () => {
    if (queue.length === 0) {
        return;
    }

    const [ index, tasks, resolve, reject ] = queue.pop()!;

    const me = cr.addWebUiListener('import-data-status-changed', (status: cr.ImportDataStatus) => {
        if (status === cr.ImportDataStatus.FAILED)
            reject();
        else if (status === cr.ImportDataStatus.SUCCEEDED)
            resolve();
        else
            return;

        cr.removeWebUiListener(me);

        if (queue.length) {
            runNext();
        } else {
            browser.initializeImportDialog().then(setProfiles);
        }
    });

    browser.importData(index, tasks);
}

export const importProfile = (index: number, tasks: WhatToImport) => {
    const wrappedTasks = convertTasks(tasks);

    return new Promise<void>((resolve, reject) => {
        if (queue.push([ index, wrappedTasks, resolve, reject ]) === 1) {
            runNext();
        }
    });
}
