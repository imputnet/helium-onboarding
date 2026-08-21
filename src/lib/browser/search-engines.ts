import * as cr from "../cr";
import { readonly, writable } from "svelte/store";
import { searchEngineConfig } from "../search-engine-config";

const browser = cr.SearchEnginesBrowserProxyImpl.getInstance();
const _searchEngines = writable<cr.SearchEngine[]>([]);

const engineOrder = Object.fromEntries(
    Object.keys(searchEngineConfig).map((key, i) => [key, i])
);

export const getKeyword = (engine: cr.SearchEngine) => {
    if (!engine.isPrepopulated) return `custom-${engine.id}`;

    // Prepopulated keywords are expected to use a single-label public suffix.
    // A keyword such as "google.com.au" will be parsed incorrectly (as "com").
    const labels = engine.keyword.replace(/[^\x00-\x7F]/g, "").split(".");
    return labels[labels.length - 2] ?? labels[0];
}

// Follow the order from searchEnginesConfig and place custom engines last.
const engineIndex = (engine: cr.SearchEngine) =>
    engineOrder[getKeyword(engine)] ?? Infinity;

const sortEngines = (engines: cr.SearchEngine[]) => {
    return engines.sort((a, b) =>
        engineIndex(a) - engineIndex(b)
    );
};

export const setup = () => {
    browser.getSearchEnginesList().then(
        engines => _searchEngines.set(sortEngines(engines.defaults))
    );
}

cr.addWebUiListener(
    'search-engines-changed',
    (state: cr.SearchEnginesInfo) =>
        _searchEngines.set(sortEngines(state.defaults))
);

export const searchEngines = readonly(_searchEngines);

export const setDefaultEngine = (browserIndex: number) => {
    browser.setDefaultSearchEngine(
        browserIndex,
        cr.ChoiceMadeLocation.OTHER,
        null
    );
}
