import { readonly, writable } from "svelte/store";
import * as cr from "../cr";

export type Preferences = {
    'completed_onboarding': boolean,
    'services.bangs': boolean,
    'services.enabled': boolean,
    'services.ext_proxy': boolean,
    'services.origin_override': string,
    'services.user_consented': boolean,
    'services.spellcheck_files': boolean,
};

export type PrefKey = keyof Preferences;

const _preferences = writable({} as Preferences);

cr.sendWithPromise('getPrefs').then(
    prefs => _preferences.set(prefs)
);

cr.addWebUiListener(
    'helium-prefs-changed',
    (prefs: Preferences) => _preferences.set(prefs)
);

export const preferences = readonly(_preferences);

export const setPref = async <
    Key extends PrefKey,
    Value extends Preferences[PrefKey]
>(name: Key, value: Value): Promise<void> => {
    await cr.sendWithPromise('setPref', name, value);
}
