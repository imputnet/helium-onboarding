import { derived, writable } from "svelte/store";
import * as cr from "../cr";

const browser = cr.SearchEnginesBrowserProxyImpl.getInstance();
const _searchEngines = writable<cr.SearchEngine[]>([]);

browser.getSearchEnginesList().then(
    engines => _searchEngines.set(engines.defaults)
);

cr.addWebUiListener(
    'search-engines-changed',
    (state: cr.SearchEnginesInfo) => _searchEngines.set(state.defaults)
);

export const searchEngines = derived(_searchEngines, $ => $);

export const setDefaultEngine = (modelIndex: number) => {
    browser.setDefaultSearchEngine(
        modelIndex,
        cr.ChoiceMadeLocation.CHOICE_SCREEN,
        null
    );
}
