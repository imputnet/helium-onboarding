export const s = {
    button: {
        useDefaults: "Use defaults",
        configure: "Configure",
        next: "Next",
        back: "Back",
        letsGo: "Let's go!"
    },
    welcome: {
        greeting: "Meet Helium",
        body: "Let's configure your browser just the way you want it. If you're in a rush, you can stick to defaults with best privacy and comfort.",
        terms_note: "By continuing, you agree to the",
        terms_privacy: "privacy policy",
        terms_and: "and",
        terms_use: "terms of use",
        defaults: "You can skip setup and come back later, but Helium services won't work until then."
    },
    finish: {
        title: "Ready to browse?",
        body: "The setup is complete, thank you for choosing Helium.\nTime to enjoy the Internet again.",
    },
    services: {
        title: "Helium services",
        subtitle: "All services are anonymous, private, and self-hostable.\nChanges will be applied after you go to the next page.",

        connection_title: "Allow connecting to Helium services",
        connection_desc: "Helium services provide additional functionality, such as: extension downloads, native !bangs, filter list updates, and browser updates. When disabled, none of these features will work, but Helium will not make any web requests.",

        bangs_title: "Allow downloading the !bangs list",
        bangs_desc: "Helium will fetch a list of bangs that help you browse the Internet faster, such as !w or !gh. When disabled, bangs will not work.",

        extensions_title: "Proxy extension downloads and updates",
        extensions_desc: "When enabled, Helium will proxy extension downloads and updates to protect your privacy. When disabled, downloading and updating extensions will not work.",

        ublock_title: "Allow downloading filter lists for uBlock Origin",
        ublock_desc: "Helium will fetch fresh filter lists for uBlock Origin. All requests to lists are proxied to protect your privacy. When disabled, default filter lists will be loaded from local storage, which are only updated along with Helium. Optional filter lists will be requested without proxying.",

        autoupdates_title: "Allow automatic browser and component updates",
        autoupdates_desc: "Helium will automatically download and install browser and component updates as they become available. We recommend keeping this setting enabled to ensure you get the latest features and security updates.",
        autoupdates_linux: "\n\nAutomatic browser updates are not available on Linux yet, but component updates are. For now, please use external software to keep Helium's AppImage up-to-date. We already provide .zsync files along with releases.",
        autoupdates_windows: "\n\nAutomatic browser updates are not available on Windows yet, but component updates are. For now, please use external software or install updates manually to keep Helium up-to-date.",

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
        duckduckgo: "Privacy-focused. Relies on Bing results but never tracks or profiles you.",
        kagi: "Privacy-focused. Customizable results without ads or tracking. Requires a paid account.",
        qwant: "Based in Europe. Uses Bing results. Sends tracking data to Microsoft.",
        ecosia: "May plant trees for clicking ads. Relies on Bing and Google. Sends tracking data to Microsoft and Google.",
        bing: "Collects extensive personal data. Privacy controls are buried and limited. Subjectively overwhelming UI.",
        google: "Your personal data fuels its monopoly. Market-dominant due to anti-competitive and anti-consumer practices."
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
