<script lang="ts">
    import { s } from "../lib/strings";
    import { passwordManagerIcons } from "../lib/nonfree-icons";

    import {
        extensionStatus,
        installExtension,
        WebstoreInstallErrorCode,
        type InstallResponse,
    } from "../lib/browser";

    import type { PasswordManagerInfo } from "../lib/password-managers";

    import Spinner from "./Spinner.svelte";
    import HeliumPartner from "./HeliumPartner.svelte";

    import IconKey from "../icons/tabler/IconKey.svelte";
    import IconDownload from "../icons/tabler/IconDownload.svelte";
    import IconExternalLink from "../icons/tabler/IconExternalLink.svelte";

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
    <a
        class="button action-link"
        target="_blank"
        rel="noopener noreferrer"
        href={url}
    >
        {title}
        {#if Icon}
            <Icon />
        {/if}
    </a>
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
                    IconExternalLink,
                )}
            {/if}
            {#if info.setupGuide}
                {@render link(
                    info.setupGuide,
                    s.password.setupGuide,
                    IconExternalLink,
                )}
            {/if}
            {@render link(
                info.privacyPolicy,
                s.password.privacy,
                IconExternalLink,
            )}
        </div>

        <button
            class="button action-link"
            class:primary={!installed && !error}
            disabled={installed || !!error || working}
            onclick={install}
        >
            {#if installed}
                {s.password.installed}
            {:else if error}
                {s.password.error} {error}
            {:else}
                {s.password.install}
                {#if working}
                    <Spinner />
                {:else}
                    <IconDownload />
                {/if}
            {/if}
        </button>
    </div>
</div>

<style>
    .pm-option {
        display: flex;
        flex-direction: column;
        text-align: left;
        padding: 16px;
        gap: 16px;
        border-radius: 16px;
        max-width: 420px;
        height: -webkit-fill-available;
        justify-content: space-between;
        background-color: var(--helium-elevated-15);
        outline: 1.5px var(--helium-elevated-25) solid;
        outline-offset: -1.5px;
    }

    .pm-top {
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: var(--gap-1);
    }

    .pm-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .button {
        text-decoration: none;
    }

    .action-row,
    .button-group {
        display: flex;
        flex-direction: row;
        gap: calc(var(--gap-1) / 2);
    }

    .action-row {
        justify-content: space-between;
        width: 100%;
    }

    .action-link {
        padding: 9px 16px;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 500;
        gap: 6px;

        & :global(svg) {
            height: 16px;
            width: 16px;
            stroke-width: 2px;
        }
    }

    .action-link:not(.primary) {
        &:not(:hover) {
            background: var(--helium-elevated-20);
        }
    }

    .pm-icon-container {
        background: var(--helium-elevated-20);
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
