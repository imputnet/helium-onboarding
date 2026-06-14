import type { Platform } from "./platform";
import { s } from "./strings";

export type PasswordManagerInfo = {
    title: string;
    description: string;
    partner?: boolean;
    extensionId: string;
    importGuide?: string;
    setupGuide?: string;
    privacyPolicy: string;
    platforms?: Platform[];
};

export const passwordManagers: Record<string, PasswordManagerInfo> = {
    protonPass: {
        title: "Proton Pass",
        description: s.passwordManagers.protonPass,
        extensionId: "ghmbeldphafepmbegfdlkpapadhbakde",
        importGuide: "https://proton.me/support/pass-import",
        privacyPolicy: "https://proton.me/pass/privacy-policy",
    },
    bitwarden: {
        title: "Bitwarden",
        description: s.passwordManagers.bitwarden,
        extensionId: "nngceckbapebfimnlniiiahkandclblb",
        importGuide: "https://bitwarden.com/help/import-data/",
        privacyPolicy: "https://bitwarden.com/privacy/"
    },
    onePassword: {
        title: "1Password",
        description: s.passwordManagers.onePassword,
        extensionId: "aeblfdkhhhdcdjpifhhbdiojplfjncoa",
        setupGuide: "https://support.1password.com/additional-browsers/",
        importGuide: "https://support.1password.com/import/",
        privacyPolicy: "https://1password.com/legal/privacy"
    },
    dashlane: {
        title: "Dashlane",
        description: s.passwordManagers.dashlane,
        extensionId: "fdjamakpfbbddfjaooikfcpapjohcfmg",
        importGuide: "https://support.dashlane.com/hc/en-us/articles/360004101920-Import-your-data-into-Dashlane",
        privacyPolicy: "https://www.dashlane.com/privacy"
    },
    icloudPasswords: {
        title: "iCloud Passwords",
        description: s.passwordManagers.icloudPasswords,
        extensionId: "pejdijmoenmkgeppbflobdenhhabjlaj",
        privacyPolicy: "https://www.apple.com/legal/privacy/",
        platforms: ["windows", "macos"],
    },
    keePassXC: {
        title: "KeePassXC",
        description: s.passwordManagers.keePassXc,
        extensionId: "oboonakemofpalcgghocfoadofidjkkk",
        setupGuide: "https://keepassxc.org/docs/KeePassXC_UserGuide",
        importGuide: "https://keepassxc.org/docs/KeePassXC_UserGuide#_importing_databases",
        privacyPolicy: "https://keepassxc.org/privacy/#privacy-keepassxc",
    },
};
