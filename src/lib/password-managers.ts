export type PasswordManagerInfo = {
    title: string;
    description: string;
    partner?: boolean;
    extensionId: string;
    importGuide?: string;
    setupGuide?: string;
    privacyPolicy: string;
};

export const passwordManagers: Record<string, PasswordManagerInfo> = {
    protonPass: {
        title: "Proton Pass",
        description: "Secure and privacy-focused password manager by Proton. Stores data in Europe. All clients are open-source. Free with an optional paid plan.",
        extensionId: "ghmbeldphafepmbegfdlkpapadhbakde",
        importGuide: "https://proton.me/support/pass-import",
        privacyPolicy: "https://proton.me/pass/privacy-policy",
    },
    bitwarden: {
        title: "Bitwarden",
        description: "The most popular open-source password manager. Offers data storage in Europe or US. Free with an optional paid plan. Can be self-hosted.",
        extensionId: "nngceckbapebfimnlniiiahkandclblb",
        importGuide: "https://bitwarden.com/help/import-data/",
        privacyPolicy: "https://bitwarden.com/privacy/"
    },
    onePassword: {
        title: "1Password",
        description: "Popular, paid, and closed-source password manager. Offers data storage in Europe or US. May not work correctly with Helium due to negligence.",
        extensionId: "aeblfdkhhhdcdjpifhhbdiojplfjncoa",
        setupGuide: "https://support.1password.com/additional-browsers/",
        importGuide: "https://support.1password.com/import/",
        privacyPolicy: "https://1password.com/legal/privacy"
    },
    dashlane: {
        title: "Dashlane",
        description: "Popular, paid, and closed-source password manager. Stores data in Europe. Known for aggressive upselling tactics.",
        extensionId: "fdjamakpfbbddfjaooikfcpapjohcfmg",
        importGuide: "https://support.dashlane.com/hc/en-us/articles/360004101920-Import-your-data-into-Dashlane",
        privacyPolicy: "https://www.dashlane.com/privacy"
    },
    icloudPasswords: {
        title: "iCloud Passwords",
        description: "Free password manager by Apple. Will nag you about using Safari and require re-authentication on browser restart. Can't generate passwords.",
        extensionId: "pejdijmoenmkgeppbflobdenhhabjlaj",
        privacyPolicy: "https://www.apple.com/legal/privacy/",
    },
    keePassXC: {
        title: "KeePassXC",
        description: "Local, free, and open-source password manager for advanced users. Requires technical knowledge to set up and use.",
        extensionId: "oboonakemofpalcgghocfoadofidjkkk",
        setupGuide: "https://keepassxc.org/docs/KeePassXC_UserGuide",
        importGuide: "https://keepassxc.org/docs/KeePassXC_UserGuide#_importing_databases",
        privacyPolicy: "https://keepassxc.org/privacy/#privacy-keepassxc",
    },
};
