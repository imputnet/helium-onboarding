import { SvelteSet } from "svelte/reactivity";
import { derived, get, writable, type Updater } from "svelte/store";

import { canBeDefaultBrowser, importableProfiles, isDefaultBrowser } from "./browser";

export const flow = [
    "Welcome",
    "HeliumServices",
    "SearchEngine",
    "DataImport",
    "DefaultBrowser",
    "Finish"
] as const;

const index = writable(0);

export const currentPage = derived(
    index,
    $index => flow[$index]
);

const getPageNumber = (current: number, direction = 1) => {
    let next = current + direction;

    if (flow[next] === 'DataImport') {
        // skip if nothing to import
        if (get(importableProfiles).length === 0)
            next += direction;
    }

    if (flow[next] === 'DefaultBrowser') {
        // skip if we're already default (we can't undefault ourselves)
        if (!canBeDefaultBrowser || get(isDefaultBrowser))
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

export const working = writable(true);
export const userChoseHeliumAsDefault = writable(true);
export const selectedProfiles = writable(new SvelteSet<number>());
export const previouslyImportedProfiles = writable(new SvelteSet<number>());
