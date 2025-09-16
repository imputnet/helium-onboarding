import * as cr from "../cr";
import { readonly, writable } from "svelte/store";

const browser = cr.SearchEnginesBrowserProxyImpl.getInstance();
const _searchEngines = writable<cr.SearchEngine[]>([]);

const shuffle = (array: cr.SearchEngine[]) => {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

browser.getSearchEnginesList().then(
    engines => _searchEngines.set(
        shuffle(engines.defaults)
    )
);

cr.addWebUiListener(
    'search-engines-changed',
    (state: cr.SearchEnginesInfo) => _searchEngines.set(
        shuffle(state.defaults)
    )
);

export const searchEngines = readonly(_searchEngines);

export const setDefaultEngine = (modelIndex: number) => {
    browser.setDefaultSearchEngine(
        modelIndex,
        cr.ChoiceMadeLocation.CHOICE_SCREEN,
        null
    );
}
