import { platform } from "../platform";

import * as Prefs from "./prefs";
import * as Profile from "./profile";
import * as Extensions from "./extensions";
import * as DefaultBrowser from "./is-default";
import * as SearchEngines from "./search-engines";

let g_did_setup = false;
export const setup = () => {
    if (g_did_setup) {
        // We expect to hit this while working in dev mode/hot reload,
        // so let's just log to console instead of loudly alerting.
        console.error('BUG: setup() called more than once');
        return;
    }
    g_did_setup = true;

    Prefs.setup();
    SearchEngines.setup();
    if (!platform.is.android) {
        Profile.setup();
        // TODO: explore extension support on android
        Extensions.setup();
        // TODO: wire default browser setup to android's browser role request
        DefaultBrowser.setup();
    }
}
