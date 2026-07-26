<script lang="ts">
    import { IconWorld } from "@imput/helium-prism";
    import { s } from "../lib/strings";
    import type { BrowserProfile } from "../lib/cr";
    import { currentPage } from "../lib/onboarding-flow";
    import { importableProfiles } from "../lib/browser";
    import { browserIcons } from "../lib/nonfree-icons";

    import PageHeader from "../components/PageHeader.svelte";
    import ProfileImportOption from "../components/ProfileImportOption.svelte";

    import IconTransferIn from "../icons/tabler/IconTransferIn.svelte";

    const visible = $derived($currentPage === "DataImport");

    const sorted = $derived.by(() => {
        const grouped = $importableProfiles.reduce(
            (acc, profile) => {
                (acc[profile.name] ??= []).push(profile);
                return acc;
            },
            {} as Record<string, BrowserProfile[]>
        );

        return Object.entries(grouped)
            .sort(([a], [b]) => a.localeCompare(b));
    });

    const browserIconMap = {
        Arc: "arc",
        Brave: "brave",
        Chromium: "chromium",
        Dia: "dia",
        Opera: "opera",
        Safari: "safari",
        Vivaldi: "vivaldi",
        Yandex: "yandex",
        Zen: "zen",

        "Google Chrome": "chrome",
        "Google Chrome Beta": "chrome_beta",
        "Google Chrome Canary": "chrome_canary",
        "Google Chrome Dev": "chrome_dev",
        "Microsoft Edge": "edge",
        "Mozilla Firefox": "firefox",
        "NAVER Whale": "whale",
        "Perplexity Comet": "comet",
    } as const;
</script>

<div id="data-import-page" class="onboarding-page" class:visible>
    <div id="data-import-container" class="scrollable-page">
        <PageHeader
            title={s.dataImport.title}
            subtitle={s.dataImport.subtitle}
            Icon={IconTransferIn}
        />
        <div class="page-content">
            {#each sorted as [browser, profiles]}
                {@const icon = browserIconMap[browser as keyof typeof browserIconMap]}
                {@const url = icon && browserIcons[icon]}
                <div class="browser-header">
                    <div class="browser-icon">
                        {#if url}
                            <img src={url} alt="{browser} icon" />
                        {:else}
                            <IconWorld />
                        {/if}
                    </div>
                    <h4>{browser}</h4>
                </div>
                <div class="browser-profiles">
                    {#each profiles as profile}
                        <ProfileImportOption {profile} />
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    #data-import-container {
        max-width: 600px;
    }

    .page-content {
        gap: var(--gap-3);
    }

    .browser-header {
        display: flex;
        width: 100%;
        align-items: center;
        gap: 8px;

        & .browser-icon {
            width: 28px;
            height: 28px;
            display: flex;
            justify-content: center;
            align-items: center;

            & img {
                width: 28px;
                height: 28px;
            }
        }

        & > h4 {
            line-height: 1;
        }
    }

    .browser-profiles {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: var(--gap-1);
    }
</style>
