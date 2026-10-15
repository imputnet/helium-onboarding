<script lang="ts">
    import { s } from "../lib/strings";
    import type { BrowserProfile } from "../lib/cr";
    import { currentPage } from "../lib/onboarding-flow";
    import { importableProfiles } from "../lib/browser";

    import PageHeader from "../components/PageHeader.svelte";
    import BrowserProfileGroup from "../components/BrowserProfileGroup.svelte";

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
</script>

<div id="data-import-page" class="onboarding-page" class:visible>
    <div id="data-import-container" class="scrollable-page">
        <PageHeader
            title={s.dataImport.title}
            subtitle={s.dataImport.subtitle}
            Icon={IconTransferIn}
        />
        <div class="page-content">
            {#each sorted as [browser, profiles] (browser)}
                <BrowserProfileGroup {browser} {profiles} />
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
</style>
