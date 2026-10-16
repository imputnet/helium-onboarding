import { derived, get, writable } from "svelte/store";
import * as cr from "../cr";

const browser = cr.ImportDataBrowserProxyImpl.getInstance();

const importableProfilesRaw = writable<cr.BrowserProfile[]>([]);

export const importDiscovery = writable<{
    status: 'initial' | 'loading' | 'loaded' | 'error';
    refreshing: boolean;
}>({
    status: 'initial',
    refreshing: false,
});

enum _HeliumImportType {
    EXTENSIONS = 'import_dialog_extensions',
};

export const HeliumImportType = {
    ...cr.ImportType,
    ..._HeliumImportType,
} as const;
export type HeliumImportType = _HeliumImportType | cr.ImportType;
export type HeliumImportTypes = Record<HeliumImportType, boolean>;

type Action = () => void;
// The import in progress stays at the front until it finishes.
const queue: [number, HeliumImportTypes, Action, Action][] = [];

const fetchProfiles = async () => {
    importableProfilesRaw.set(await browser.initializeImportDialog());
}

export const openFilesAndFoldersSettings = () => {
    chrome.send('openFilesAndFoldersSettings');
}

export const loadImportableProfiles = async () => {
    importDiscovery.update(d => ({ ...d, status: 'loading' }));

    const status = await fetchProfiles().then(
        () => 'loaded' as const,
        () => 'error' as const,
    );
    importDiscovery.update(d => ({ ...d, status }));
}

// Re-detects profiles without leaving the loaded state. Skipped while imports
// are queued or running, since they reference profiles by index; the queue
// refreshes the list itself once it drains.
export const refreshImportableProfiles = async () => {
    if (get(importDiscovery).refreshing || queue.length) {
        return;
    }

    importDiscovery.update(d => ({ ...d, refreshing: true }));

    // Keep the previous list if detection fails
    await fetchProfiles().catch(() => {});
    importDiscovery.update(d => ({ ...d, refreshing: false }));
}

const convertTasks = (tasks: WhatToImport): HeliumImportTypes => {
    return {
        import_dialog_autofill_form_data: !!tasks.autofillFormData,
        import_dialog_bookmarks: !!tasks.bookmarks,
        import_dialog_history: !!tasks.history,
        import_dialog_saved_passwords: !!tasks.savedPasswords,
        import_dialog_search_engine: !!tasks.searchEngine,
        import_dialog_extensions: !!tasks.extensions
    };
}

const runNext = () => {
    if (queue.length === 0) {
        return;
    }

    const [ index, tasks, resolve, reject ] = queue[0];

    const me = cr.addWebUiListener('import-data-status-changed', (status: cr.ImportDataStatus) => {
        if (status === cr.ImportDataStatus.FAILED)
            reject();
        else if (status === cr.ImportDataStatus.SUCCEEDED)
            resolve();
        else
            return;

        cr.removeWebUiListener(me);
        queue.shift();

        if (queue.length) {
            runNext();
        } else {
            refreshImportableProfiles();
        }
    });

    browser.importData(index, tasks);
}

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

export const importProfile = (index: number, tasks: WhatToImport) => {
    const wrappedTasks = convertTasks(tasks);

    return new Promise<void>((resolve, reject) => {
        if (queue.push([ index, wrappedTasks, resolve, reject ]) === 1) {
            runNext();
        }
    });
}
