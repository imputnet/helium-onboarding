import * as Prefs from "./prefs";
import * as Profile from "./profile";
import * as Importer from "./importer";
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
    Profile.setup();
    Importer.setup();
    Extensions.setup();
    SearchEngines.setup();
    DefaultBrowser.setup();
}
