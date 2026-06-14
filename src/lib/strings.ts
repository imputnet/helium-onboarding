import type { SearchCategory, SearchEngineName } from "./search-engine-config";

export const s = {
    button: {
        useDefaults: "Use defaults",
        configure: "Configure",
        next: "Next",
        back: "Back",
        letsGo: "Let's go!"
    },
    partner: {
        title: "Helium Partner",
        tooltip: "Paying for this service will support\nthe development of Helium."
    },
    welcome: {
        greeting: "Meet Helium",
        body: "Configure your browser just the way you want it, or use\nthe default preset with best privacy and comfort.",
        termsNote: "By continuing, you agree to the",
        termsPrivacy: "privacy policy",
        termsAnd: "and",
        termsUse: "terms of use",
        footer: "You can skip setup and come back later, but Helium services won't work without it.",
    },
    finish: {
        title: "Ready to browse?",
        body: "The setup is complete, thank you for choosing Helium.\nTime to enjoy the Internet again.",
    },
    services: {
        title: "Helium services",
        subtitle: "Services are not active until you consent to using them.\nChanges will be applied after you go to the next page.",

        connectionTitle: "Allow connecting to Helium services",
        connectionDesc: "Helium services provide additional functionality, such as: extension downloads, native !bangs, filter list updates, and browser updates. When disabled, none of these features will work, but Helium will not make any web requests.",

        bangsTitle: "Allow downloading the !bangs list",
        bangsDesc: "Helium will fetch a list of bangs that help you browse the Internet faster, such as !w or !gh. When disabled, bangs will not work.",

        extensionsTitle: "Proxy extension downloads and updates",
        extensionsDesc: "When enabled, Helium will proxy extension downloads and updates to protect your privacy. When disabled, downloading and updating extensions will not work.",

        ublockTitle: "Allow downloading filter lists for uBlock Origin",
        ublockDesc: "Helium will fetch fresh filter lists for uBlock Origin. All requests to lists are proxied to protect your privacy. When disabled, default filter lists will be loaded from local storage, which are only updated along with Helium. Optional filter lists will be requested without proxying.",

        autoupdatesTitle: "Allow automatic browser updates",
        autoupdatesDesc: "Helium will automatically check for updates and install them. This includes browser and component updates. We recommend keeping this setting enabled to ensure you get the latest features and security updates.",

        autoupdatesTitleLinux: "Allow automatic component updates",
        autoupdatesDescLinux: "Helium will automatically check for component updates and install them. We recommend keeping this setting enabled. On Linux, browser updates are handled by your distro's package manager. Please check for Helium package updates at least every week.",

        spellcheckTitle: "Allow downloading dictionary files for spell checking",
        spellcheckDesc: "Helium will fetch dictionary files used for spell checking when requested. When disabled, spell checking will not work.",

        instanceTitle: "Use your own instance of Helium services",
        instanceDesc: "You can host your own instance of Helium services and use it in your browser instead of the pre-hosted server. If you have one, you can set it in Helium settings.",
    },
    search: {
        title: "Default search engine",
        subtitle: "You can change your choice later in Settings.\nEngines are ordered by privacy.",
    },
    searchCategories: {
        private: "A privacy-first search engine which\ndoesn't profile or track you.",
        small: "Transparent, but not privacy-focused.\nOffers better privacy than mainstream\nsearch engines.",
        mainstream: "A mainstream search engine which\ncollects extensive personal data.",
        custom: "A custom search engine. Its privacy\nwasn't verified by Helium.",
    } satisfies Record<SearchCategory, string>,
    searchEngines: {
        duckduckgo: "Privacy-focused. Relies on Bing results but promises to never track or profile you.",
        kagi: "Privacy-focused. Customizable results without ads or tracking. Requires a paid account.",
        qwant: "Based in Europe. Uses Bing results. Sends tracking data to Microsoft.",
        ecosia: "May plant trees for clicking ads. Relies on Bing and Google. Sends tracking data to Microsoft and Google.",
        bing: "Collects extensive personal data. Privacy controls are buried and limited. Subjectively overwhelming UI.",
        google: "It's Google. It dominates the search market, collects extensive personal data, and profiles you."
    } satisfies Record<SearchEngineName, string>,
    defaultBrowser: {
        title: "Ready to switch to Helium?",
        subtitle: "Better privacy, speed, and comfort. All in one click.\nLet's make links open in Helium by default.",
        yes: "Yes",
        no: "No",
        yesDesc: "Make Helium my default browser.",
        noDesc: "Just trying Helium for now."
    },
    dataImport: {
        title: "Take your stuff with you",
        subtitle: "Transfer your most important bookmarks, history,\n and extensions from other browsers.",
        bookmarks: "Bookmarks",
        history: "History",
        extensions: "Extensions"
    },
    password: {
        title: "Password manager",
        subtitle: "Helium doesn't have a built-in password manager, by design.\n Would you like to install a browser-agnostic one?",
        importGuide: "Import",
        setupGuide: "Setup",
        privacy: "Privacy",
        install: "Install",
        installed: "Installed",
        error: "Error:",
    },
    passwordManagers: {
        protonPass: "Secure and privacy-focused password manager by Proton. Stores data in Europe. All clients are open-source. Free with an optional paid plan.",
        bitwarden: "The most popular open-source password manager. Offers data storage in Europe or US. Free with an optional paid plan. Can be self-hosted.",
        onePassword: "Popular, paid, and closed-source password manager. Offers data storage in Europe or US. May not work correctly with Helium due to negligence.",
        dashlane: "Popular, paid, and closed-source password manager. Stores data in Europe. Known for aggressive upselling tactics.",
        icloudPasswords: "Free password manager by Apple. Will nag you about using Safari and require re-authentication on browser restart. Can't generate passwords.",
        keePassXc: "Local, free, and open-source password manager for advanced users. Requires technical knowledge to set up and use.",
    },
}
