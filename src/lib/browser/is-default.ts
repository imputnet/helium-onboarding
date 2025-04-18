import { writable, type Readable } from "svelte/store";
import * as cr from "../cr";

const _defaultBrowser = writable(false);

const browser = cr.DefaultBrowserBrowserProxyImpl.getInstance();
browser.requestDefaultBrowserState().then(
    state => _defaultBrowser.set(state.isDefault)
);

cr.addWebUiListener(
    'browser-default-state-changed',
    (state: cr.DefaultBrowserInfo) => _defaultBrowser.set(state.isDefault)
);

export const askToBeDefault = (/* 🥺👉👈 */) => {
    browser.setAsDefaultBrowser();
}

export const isDefaultBrowser: Readable<boolean> = _defaultBrowser;
