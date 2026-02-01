import { SvelteSet } from "svelte/reactivity";
import { derived, get, writable } from "svelte/store";

import { preferences } from "../lib/browser";
import { canBeDefaultBrowser, importableProfiles, isDefaultBrowser } from "./browser";

export const flow = [
    "Welcome",
    "HeliumServices",
    "SearchEngine",
    "DataImport",
    "PasswordManager",
    "DefaultBrowser",
    "Finish"
] as const;

const index = writable(0);

export const currentPage = derived(
    index,
    $index => flow[$index]
);

const shouldSkip = (page: typeof flow[number]): boolean => {
    switch (page) {
        case 'DataImport':
            // skip if nothing to import
            return get(importableProfiles).length === 0;
        case 'PasswordManager':
            // skip if we aren't allowed to install extensions
            const pref = get(preferences);
            return !pref['services.ext_proxy'] || !pref['services.enabled'];
        case 'DefaultBrowser':
            // skip if we're already default (we can't undefault ourselves)
            return !canBeDefaultBrowser || get(isDefaultBrowser);
        default:
            return false;
    }
}

const getPageNumber = (current: number, direction = 1) => {
    let next = current + direction;

    while (
        next >= 0 &&
        next < flow.length &&
        shouldSkip(flow[next])
    ) {
        next += direction;
    }

    return Math.max(0, Math.min(next, flow.length - 1));
}

export const nextPage = () => {
    index.update((current) => getPageNumber(current));
}

export const previousPage = () => {
    index.update((current) => getPageNumber(current, -1));
}

export const userChoseHeliumAsDefault = writable(true);
export const selectedProfiles = writable(new SvelteSet<number>());
export const previouslyImportedProfiles = writable(new SvelteSet<number>());
