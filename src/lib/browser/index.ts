import { platform } from "../platform";

export * from "./prefs";
export * from "./profile";
export * from "./importer";
export * from "./extensions";
export * from "./is-default";
export * from "./search-engines";

export { setup } from "./setup";

export const openNewTab = () => {
    const url = platform.is.android ? "chrome-native://newtab/"
                                    : "chrome://newtab";
    window.open(url, "_self");
}
