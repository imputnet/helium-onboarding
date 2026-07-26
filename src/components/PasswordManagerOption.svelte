<script lang="ts">
    import {
        Button,
        IconDownload,
        IconExternalLink,
        Link,
        Spinner,
    } from "@imput/helium-prism";
    import { s } from "../lib/strings";
    import { passwordManagerIcons } from "../lib/nonfree-icons";

    import {
        extensionStatus,
        installExtension,
        WebstoreInstallErrorCode,
        type InstallResponse,
    } from "../lib/browser";

    import type { PasswordManagerInfo } from "../lib/password-managers";

    import HeliumPartner from "./HeliumPartner.svelte";

    import IconKey from "../icons/tabler/IconKey.svelte";

    let { id, info }: { id: string, info: PasswordManagerInfo } = $props();

    let brokenIcon = $state(false);
    const iconPath = $derived(passwordManagerIcons[id.toLowerCase()] ?? "");

    let installed = $derived($extensionStatus[info.extensionId]);
    let working = $state(false);
    let error = $state(0);

    const handleInstall = (res: InstallResponse) => {
        // Show an error if anything but UserCancelled occurred
        const isError = !res.success &&
            res.code !== WebstoreInstallErrorCode.UserCancelled;

        if (!isError) return;

        error = res.code;
        console.error(
            `Failed to install ${info.extensionId}:\n` +
            `   [${res.code}] ${res.error}`
        )
    }

    const install = async () => {
        // Install function is expected to never be called when
        // either of these states is true, but we handle it
        // here just in case.
        if (installed || working || error) return;

        working = true;

        await installExtension(info.extensionId)
            .then(handleInstall)
            .finally(() => working = false);
    }
</script>

{#snippet link(
    url: string,
    title: string,
    Icon?: ConstructorOfATypedSvelteComponent,
)}
    <Link class="button" href={url}>
        {#if Icon}
            <Icon />
        {/if}
        {title}
    </Link>
{/snippet}

<div class="pm-option">
    <div class="pm-top">
        <div class="pm-icon-container" aria-hidden="true">
            {#if !brokenIcon}
                <img
                    class="pm-icon"
                    width="32"
                    height="32"
                    src={iconPath}
                    alt="{info.title} logo"
                    onerror={() => (brokenIcon = true)}
                />
            {:else}
                <IconKey />
            {/if}
        </div>
        <div class="pm-text">
            {#if info.partner}
                <HeliumPartner />
            {/if}
            <h4>{info.title}</h4>
            <p>{info.description}</p>
        </div>
    </div>
    <div class="action-row">
        <div class="button-group">
            {#if info.importGuide}
                {@render link(
                    info.importGuide,
                    s.password.importGuide,
                )}
            {/if}
            {#if info.setupGuide}
                {@render link(
                    info.setupGuide,
                    s.password.setupGuide,
                )}
            {/if}
            {@render link(
                info.privacyPolicy,
                s.password.privacy,
            )}
        </div>

        <Button
            primary={!installed && !error}
            disabled={installed || !!error || working}
            onclick={install}
        >
            {#if installed}
                {s.password.installed}
            {:else if error}
                {s.password.error} {error}
            {:else}
                {#if working}
                    <Spinner size={18} />
                {:else}
                    <IconDownload />
                {/if}
                {s.password.install}
            {/if}
        </Button>
    </div>
</div>

<style>
    .pm-option {
        display: flex;
        flex-direction: column;
        text-align: left;
        width: 100%;
        min-width: 0;
        max-width: 480px;
        padding: 16px;
        gap: 16px;
        border-radius: 16px;
        align-self: stretch;
        justify-content: space-between;
        background-color: var(--helium-elevated-5);
    }

    .pm-top {
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: var(--gap-3);
        min-width: 0;
    }

    .pm-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
    }

    .button-group {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap: calc(var(--gap-1) / 2);
        min-width: 0;

        > :global(a) {
            font-size: 14px;
        }
    }

    .action-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: calc(var(--gap-1) / 2);
        width: 100%;
        min-width: 0;
        flex-wrap: balance;
        row-gap: calc(var(--gap-1) / 2);
    }

    .pm-icon-container {
        background: var(--helium-elevated-10);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .pm-icon-container,
    .pm-icon {
        width: 42px;
        height: 42px;
        aspect-ratio: 1/1;
        border-radius: 8px;
    }
</style>
