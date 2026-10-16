<script lang="ts">
    import { Button, Link, Spinner } from "@imput/helium-prism";
    import { s } from "../lib/strings";
    import { parseLocalizedString } from "../lib/i18n";
    import {
        importDiscovery,
        openFilesAndFoldersSettings,
        refreshImportableProfiles,
    } from "../lib/browser";

    import ImportNotice from "./ImportNotice.svelte";
    import IconReload from "../icons/tabler/IconReload.svelte";

    const settingsUrl =
        "x-apple.systempreferences:com.apple.settings.PrivacySecurity.extension?Privacy_FilesAndFolders";
    const bodyParts = parseLocalizedString(s.dataImport.macNoticeBody);

    // Refreshing usually changes nothing visible, so keep the spinner up long
    // enough for the user to see that it happened.
    const MIN_SPINNER_DURATION_MS = 800;

    let waiting = $state(false);
    const refreshing = $derived(waiting || $importDiscovery.refreshing);

    const refresh = async () => {
        waiting = true;
        await Promise.all([
            refreshImportableProfiles(),
            new Promise(r => setTimeout(r, MIN_SPINNER_DURATION_MS)),
        ]);
        waiting = false;
    };

    const openSettings = (event: MouseEvent) => {
        event.preventDefault();
        openFilesAndFoldersSettings();
    };
</script>

<ImportNotice tag="aside" title={s.dataImport.macNoticeTitle} dashed>
    <p>
        {#each bodyParts as part}
            {#if part.kind === "linkSettings"}
                <Link href={settingsUrl} onclick={openSettings}>{part.text}</Link>
            {:else}
                {part.text}
            {/if}
        {/each}
    </p>

    {#snippet action()}
        <Button
            circle
            aria-label={s.dataImport.refresh}
            title={s.dataImport.refresh}
            disabled={refreshing}
            onclick={refresh}
        >
            {#if refreshing}
                <Spinner size={20} class="refresh-spinner" />
            {:else}
                <span class="reload-icon">
                    <IconReload />
                </span>
            {/if}
        </Button>
    {/snippet}
</ImportNotice>

<style>
    .reload-icon {
        display: flex;

        & :global(svg) {
            width: 22px;
            height: 22px;
        }
    }

    :global(.refresh-spinner) {
        rotate: 45deg;
    }
</style>
