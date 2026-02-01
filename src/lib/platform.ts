const ua = navigator.userAgent.toLowerCase();

const platform = {
    is: {
        macos: ua.includes("mac os"),
        linux: ua.includes("linux"),
        windows: ua.includes("windows"),
    },
    get name() {
        if (this.is.linux) return "linux";
        if (this.is.windows) return "windows";
        return "macos";
    },
}

export type Platform = keyof typeof platform['is'];

export { platform };
