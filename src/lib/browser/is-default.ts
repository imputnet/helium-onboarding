import { readonly, writable } from "svelte/store";
import * as cr from "../cr";

const _defaultBrowser = writable(false);

export let canBeDefaultBrowser = true;

const browser = cr.DefaultBrowserBrowserProxyImpl.getInstance();
browser.requestDefaultBrowserState().then(
    state => {
        _defaultBrowser.set(state.isDefault);
        canBeDefaultBrowser = state.canBeDefault;
    }
);

cr.addWebUiListener(
    'browser-default-state-changed',
    (state: cr.DefaultBrowserInfo) => _defaultBrowser.set(state.isDefault)
);

export const askToBeDefault = (/* 🥺👉👈 */) => {
    browser.setAsDefaultBrowser();
}

export const isDefaultBrowser = readonly(_defaultBrowser);
