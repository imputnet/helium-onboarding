export type PasswordManagerInfo = {
    title: string;
    description: string;
    installUrl: string;
    importGuide?: string;
    setupGuide?: string;
    privacyPolicy: string;
};

export const passwordManagers: Record<string, PasswordManagerInfo> = {
    bitwarden: {
        title: "Bitwarden",
        description: "The most popular open-source password manager. Offers data storage in Europe. Can be self-hosted. Free with an optional paid plan.",
        installUrl: "https://chromewebstore.google.com/detail/nngceckbapebfimnlniiiahkandclblb",
        importGuide: "https://bitwarden.com/help/import-data/",
        privacyPolicy: "https://bitwarden.com/privacy/"
    },
    protonPass: {
        title: "Proton Pass",
        description: "A secure password manager from the makers of Proton Mail. Open source and based in Switzerland. Free with an optional paid plan.",
        installUrl: "https://chromewebstore.google.com/detail/ghmbeldphafepmbegfdlkpapadhbakde",
        importGuide: "https://proton.me/support/pass-import",
        privacyPolicy: "https://proton.me/pass/privacy-policy"
    },
    onePassword: {
        title: "1Password",
        description: "A paid and closed-source password manager. Offers data storage in Europe. May not work correctly with Helium due to 1P's negligence.",
        installUrl: "https://chromewebstore.google.com/detail/aeblfdkhhhdcdjpifhhbdiojplfjncoa",
        setupGuide: "https://support.1password.com/additional-browsers/",
        importGuide: "https://support.1password.com/import/",
        privacyPolicy: "https://1password.com/legal/privacy"
    },
    icloudPasswords: {
        title: "iCloud Passwords",
        description: "A free password manager by Apple. Will nag you about using Safari and require re-authentication on browser restart. Can't generate passwords.",
        installUrl: "https://chromewebstore.google.com/detail/pejdijmoenmkgeppbflobdenhhabjlaj",
        privacyPolicy: "https://www.apple.com/legal/privacy/",
    },
    keePassXC: {
        title: "KeePassXC",
        description: "Free and open-source password manager for advanced users. Self-hosted. Requires technical knowledge to set up and use.",
        installUrl: "https://chromewebstore.google.com/detail/oboonakemofpalcgghocfoadofidjkkk",
        setupGuide: "https://keepassxc.org/docs/KeePassXC_UserGuide",
        importGuide: "https://keepassxc.org/docs/KeePassXC_UserGuide#_importing_databases",
        privacyPolicy: "https://keepassxc.org/privacy/#privacy-keepassxc",
    },
};
