import { readable } from "svelte/store";
import * as cr from "../cr";

export const ntpBackgroundColor = readable('rgba(60, 60, 60, 1)', (set) => {
    cr.sendWithPromise('getBackgroundColor').then(set);
    cr.addWebUiListener(
        'ntp-background-changed',
        (rgba: string) => set(rgba)
    );
});
