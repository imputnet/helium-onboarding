<script lang="ts">
    import { s } from "../lib/strings";
    import type { BrowserProfile } from "../lib/cr";
    import { currentPage } from "../lib/onboarding-flow";
    import { importableProfiles } from "../lib/browser";
    import { browserIcons } from "../lib/nonfree-icons";

    import PageHeader from "../components/PageHeader.svelte";
    import ProfileImportOption from "../components/ProfileImportOption.svelte";

    import IconWorld from "../icons/tabler/IconWorld.svelte";
    import IconTransferIn from "../icons/tabler/IconTransferIn.svelte";

    const visible = $derived($currentPage === "DataImport");

    const groupedProfiles = $derived(
        $importableProfiles.reduce(
            (acc, profile) => {
                (acc[profile.name] ??= []).push(profile);
                return acc;
            },
            {} as Record<string, BrowserProfile[]>
        )
    );

    const sorted = $derived(
        Object.entries(groupedProfiles).sort(([a], [b]) => a.localeCompare(b))
    );

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
        <div id="content" class="page-content">
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
    <p id="data-import-footer" class="trademark-disclaimer">
        {s.trademarkDisclaimer}
    </p>
</div>

<style>
    #data-import-page {
        justify-content: flex-start;
        visibility: hidden;

        &.visible {
            visibility: visible;
            animation: zoom-blur-in 0.5s;
            animation-delay: 0.02s;
            animation-fill-mode: backwards;
        }

        &:not(.visible) {
            animation: zoom-blur-out 0.2s;
            animation-fill-mode: forwards;
        }
    }

    #data-import-container {
        max-width: 600px;
        width: 100%;
    }

    #content {
        gap: var(--gap-1);
    }

    .browser-header {
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: center;
        gap: 8px;

        & > :global(svg) {
            stroke-width: 1.5px;
        }

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
        gap: calc(var(--gap-1) / 2);
    }
</style>
