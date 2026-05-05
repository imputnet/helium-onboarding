import { get, writable } from "svelte/store";
import * as cr from "../cr";

export const profileName = writable("");

export const setup = () => {
    cr.sendWithPromise<string>('getProfileName')
    .then(profileName.set)
    .then(setupChangeListener);
}

const setupChangeListener = () => {
    let previousName = get(profileName);
    profileName.subscribe(name => {
        if (name !== previousName) {
            previousName = name;
            chrome.send('setProfileName', [ name ]);
        }
    });
}
