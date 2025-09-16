import * as cr from "../cr";
import { readonly, writable } from "svelte/store";

const browser = cr.SearchEnginesBrowserProxyImpl.getInstance();
const _searchEngines = writable<cr.SearchEngine[]>([]);

const _keys: Record<number, number> = {};
const shuffleKey = (engine: cr.SearchEngine) =>
    (_keys[engine.id] ??= Math.random());

const shuffle = (array: cr.SearchEngine[]) => {
    return array
        .map(value => ({ value, sort: shuffleKey(value) }))
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
