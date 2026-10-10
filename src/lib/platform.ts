const ua = navigator.userAgent.toLowerCase();

const android = globalThis.loadTimeData
    ? globalThis.loadTimeData.getString("platform") === "android"
    : ua.includes("android");

const platform = {
    is: {
        macos: ua.includes("mac os"),
        android,
        linux: ua.includes("linux") && !android,
        windows: ua.includes("windows"),
    },
    get name() {
        if (this.is.android) return "android";
        if (this.is.linux) return "linux";
        if (this.is.windows) return "windows";
        return "macos";
    },
}

export type Platform = keyof typeof platform['is'];

export { platform };
