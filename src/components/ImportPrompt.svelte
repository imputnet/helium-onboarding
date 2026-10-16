<script lang="ts">
    import { Button, IconCheck, Spinner } from "@imput/helium-prism";
    import { s } from "../lib/strings";
    import { importDiscovery, loadImportableProfiles } from "../lib/browser";

    import ImportNotice from "./ImportNotice.svelte";

    const busy = $derived(
        $importDiscovery.status === "loading" || $importDiscovery.status === "loaded"
    );
</script>

<ImportNotice title={s.dataImport.promptTitle}>
    <p>{s.dataImport.promptPermission}</p>
    {#if $importDiscovery.status === "error"}
        <p role="alert">{s.dataImport.discoveryError}</p>
    {/if}

    {#snippet action()}
        <Button primary disabled={busy} onclick={loadImportableProfiles}>
            {#if busy}
                <Spinner size={18} />
            {:else}
                <IconCheck />
            {/if}
            {s.dataImport.allow}
        </Button>
    {/snippet}
</ImportNotice>
