export const s = {
    button: {
        useDefaults: "Use defaults",
        configure: "Configure",
        next: "Next",
        back: "Back",
        getStarted: "Get started"
    },
    welcome: {
        greeting: "Meet Helium",
        body: "Let's configure your browser just the way you want it. If you're in a rush, you can stick to defaults with best privacy and comfort.",
        defaultsNote: "If you use defaults, Helium services will be enabled.\nYou can skip setup and come back later, but Helium services won't be enabled."
    },
    finish: {
        title: "Welcome to Helium!",
        body: "The setup is complete, we're really glad you're here.\nLet's get the browsing started!"
    },
    services: {
        title: "Helium services",
        subtitle: "All services are anonymous, private, and self-hostable.\nChanges will be applied after you go to the next page.",

        connection_title: "Allow connecting to Helium services",
        connection_desc: "Helium services provide additional functionality, such as extension downloads and native !bangs. Helium will not be able to pre-install uBlock Origin if online services are disabled.",

        bangs_title: "Allow downloading the !bangs list",
        bangs_desc: "Helium will fetch a list of bangs that help you browse the Internet faster, such as !w or !gh. When disabled, bangs will not work.",

        extensions_title: "Proxy extension downloads and updates",
        extensions_desc: "When enabled, Helium will proxy extension downloads and updates to protect your privacy. When disabled, downloading and updating extensions will not work.",

        autoupdates_title: "Allow automatic browser updates",
        autoupdates_title_unavailable: "Allow automatic browser updates (in the future)",
        autoupdates_desc: "Helium will automatically download and install browser updates as they become available. We recommend keeping this setting enabled to ensure you get the latest security patches and features.",
        autoupdates_linux: "\n\nIn-browser auto-updates are not available on Linux yet, but they may become available in the future. For now, please use external software to keep Helium's AppImage up-to-date. We already provide .zsync files along with releases.",
        autoupdates_windows: "\n\nIn-browser auto-updates are not available on Windows yet, but they may become available in the future. For now, please use external software or install updates manually to keep Helium up-to-date.",

        spellcheck_title: "Allow downloading dictionary files for spell checking",
        spellcheck_desc: "Helium will fetch dictionary files used for spell checking when requested. When disabled, spell checking will not work.",

        instance_title: "Use your own instance of Helium services",
        instance_desc: "You can host your own instance of Helium services and use it in your browser instead of the pre-hosted server. If you have one, you can set it in Helium settings.",
    },
    search: {
        title: "Choose a search engine",
        subtitle: "Search engines listed here are shown in random order.\nYou can update your choice later in Settings."
    },
    searchEngines: {
        duckduckgo: "Privacy-respecting. Relies on Bing for search results.",
        kagi: "Privacy-respecting, feature-rich, and customizable. Includes domain ranking, zero tracking, and no ads. Requires an account.",
        qwant: "Based in Europe. Uses results from Bing. Sends tracking data to Microsoft.",
        ecosia: "May plant trees for clicking ads. Relies on Bing and Google. Sends tracking data to Microsoft and Google.",
        bing: "An overwhelming search engine with no privacy.",
        google: "Well, you know already. Consider trying something else."
    },
    defaultBrowser: {
        title: "Ready to make the switch?",
        subtitle: "Make all links open in Helium by default.\nGonna feel just like home, but better.",
        yes: "Yes",
        no: "No",
        yes_desc: "Make Helium my default browser.",
        no_desc: "Just trying Helium for now."
    },
    dataImport: {
        title: "Take your stuff with you",
        subtitle: "Transfer your most important bookmarks, history,\n and extensions from other browsers.",
        bookmarks: "Bookmarks",
        history: "History",
        extensions: "Extensions"
    },
    trademarkDisclaimer: "All product names, logos, and brands are property of their respective owners.\n They are used on this page for identification purposes only. No endorsement is implied."
}
