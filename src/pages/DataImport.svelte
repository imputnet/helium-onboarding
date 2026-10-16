<script lang="ts">
    import { tick } from "svelte";
    import { get } from "svelte/store";
    import { fade } from "svelte/transition";
    import { getBoolean, s } from "../lib/strings";
    import { currentPage } from "../lib/onboarding-flow";
    import type { BrowserProfile } from "../lib/cr";
    import { importableProfiles, importDiscovery } from "../lib/browser";

    import PageHeader from "../components/PageHeader.svelte";
    import ImportNotice from "../components/ImportNotice.svelte";
    import ImportPrompt from "../components/ImportPrompt.svelte";
    import MacImportNotice from "../components/MacImportNotice.svelte";
    import BrowserProfileGroup from "../components/BrowserProfileGroup.svelte";
    import BrowserImportGraphic from "../components/BrowserImportGraphic.svelte";

    import IconTransferIn from "../icons/tabler/IconTransferIn.svelte";

    const PROMPT_FADE_DURATION = 80;

    // The browser only sets this where users can grant access to protected
    // browsers (macOS 27+).
    const showMacNotice = getBoolean("showMacImportPermissionNotice");

    const visible = $derived($currentPage === "DataImport");
    const discovered = $derived($importDiscovery.status === "loaded");
    const animateDiscovery = get(importDiscovery).status !== "loaded";
    let importContainer = $state<HTMLDivElement>();

    $effect.pre(() => {
        if (!discovered || !animateDiscovery || !importContainer) {
            return;
        }

        const container = importContainer;
        const style = getComputedStyle(container);
        const from = `${container.getBoundingClientRect().height}px`;

        tick().then(() => container.animate([{ height: from, offset: 0 }], {
            duration: parseFloat(style.transitionDuration) * 1000,
            easing: style.transitionTimingFunction,
        }));
    });

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
</script>

<div id="data-import-page" class="onboarding-page" class:visible inert={!visible}>
    <div
        id="data-import-container"
        bind:this={importContainer}
        class={["scrollable-page", { "prompt-only": !discovered }]}
        style:--prompt-fade-duration={`${PROMPT_FADE_DURATION}ms`}
    >
        {#if animateDiscovery}
            <BrowserImportGraphic visible={!discovered} />
        {/if}
        <PageHeader
            title={s.dataImport.title}
            subtitle={s.dataImport.subtitle}
            noTopMargin={!discovered}
            Icon={IconTransferIn}
        />
        <div class="import-content">
            {#if !discovered}
                <div
                    class="page-content prompt-content"
                    out:fade={{ duration: PROMPT_FADE_DURATION }}
                >
                    <ImportPrompt />
                </div>
            {:else}
                <div class={["page-content", { animate: animateDiscovery }]}>
                    {#if $importableProfiles.length === 0}
                        <ImportNotice role="status">
                            <p>{s.dataImport.noBrowsers}</p>
                        </ImportNotice>
                    {/if}
                    {#each sorted as [browser, profiles] (browser)}
                        <BrowserProfileGroup {browser} {profiles} />
                    {/each}
                    {#if showMacNotice}
                        <MacImportNotice />
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    #data-import-container {
        --resize-duration: 450ms;
        --resize-easing: cubic-bezier(0.22, 1, 0.36, 1);

        height: calc-size(auto, min(size, 100%));
        max-width: 600px;
        box-sizing: border-box;
        transition: padding var(--resize-duration) var(--resize-easing);

        &.prompt-only {
            /*
             * This state drops the bottom padding that normally keeps content
             * clear of the fixed navigation buttons, so reserve that space here.
             */
            max-height: calc(100dvh - 120px);
            padding-block: 6px;
            mask-image: none;
        }
    }

    #data-import-container :global(.page-header) {
        transition: margin-top var(--resize-duration) var(--resize-easing);
    }

    .import-content {
        display: grid;
    }

    .page-content {
        grid-area: 1 / 1;
    }

    .prompt-content {
        align-self: start;
    }

    .animate {
        animation: page-in 0.3s 0.05s backwards;
    }

    @media (prefers-reduced-motion: reduce) {
        #data-import-container {
            --resize-duration: 0ms;
        }
    }
</style>
