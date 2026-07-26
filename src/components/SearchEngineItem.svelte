<script lang="ts">
    import { Button, IconSearch, Tooltip } from "@imput/helium-prism";
    import { s } from "../lib/strings";
    import { setDefaultEngine } from "../lib/browser";
    import { searchEngineConfig } from "../lib/search-engine-config";

    import IconShieldCheck from "../icons/tabler/IconShieldCheck.svelte";
    import IconShieldExclamation from "../icons/tabler/IconShieldExclamation.svelte";
    import IconShieldOff from "../icons/tabler/IconShieldOff.svelte";
    import IconShieldQuestion from "../icons/tabler/IconShieldQuestion.svelte";

    type Props = {
        id: string;
        name: string;
        desc: string;
        iconPath: string;
        browserId: number;
        isDefault: boolean;
    };

    let { id, name, desc, iconPath, browserId, isDefault }: Props = $props();

    let brokenIcon = $state(false);

    const privacyMarkers = {
        private: IconShieldCheck,
        small: IconShieldExclamation,
        mainstream: IconShieldOff,
        custom: IconShieldQuestion,
    }

    const engineCategory = $derived.by(() => {
        if (Object.hasOwn(searchEngineConfig, id)) {
            return searchEngineConfig[id];
        }

        return "custom";
    });

    const PrivacyIcon = $derived(privacyMarkers[engineCategory]);
</script>

<Button
    card
    selected={isDefault}
    aria-label={`${name}. ${s.searchCategories[engineCategory]}${engineCategory === "custom" ? "" : ` ${desc}`}`}
    aria-pressed={isDefault}
    onclick={() => {
        setDefaultEngine(browserId);
    }}
>
    <div class="engine-layout">
        <div class="engine-icon-container" aria-hidden="true">
            {#if !brokenIcon}
                <img
                    class="engine-icon"
                    width="32"
                    height="32"
                    src={iconPath}
                    alt="{name} logo"
                    onerror={() => (brokenIcon = true)}
                />
            {:else}
                <IconSearch />
            {/if}
        </div>
        <div class="engine-text">
            <h4 class="engine-name">
                <Tooltip>
                    {#snippet anchor()}
                        <PrivacyIcon />
                    {/snippet}
                    {#snippet content()}
                        <div class="tooltip-content">
                            {s.searchCategories[engineCategory]}
                        </div>
                    {/snippet}
                </Tooltip>
                {name}
            </h4>
            {#if engineCategory !== "custom"}
                <p>{desc}</p>
            {/if}
        </div>
    </div>
</Button>

<style>
    .engine-layout {
        display: grid;
        grid-template-columns: 32px minmax(0, 1fr);
        align-items: center;
        gap: 16px;
        width: 100%;
    }

    .engine-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
        text-align: left;
    }

    .engine-name {
        display: flex;
        align-items: center;
        gap: 4px;
        line-height: 1;
        margin-bottom: 2px;

        & :global(svg) {
            stroke-width: 2px;
            height: 18px;
            width: 18px;
        }
    }

    .engine-icon-container {
        background: var(--helium-elevated-10);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .engine-icon-container,
    .engine-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
    }

    .tooltip-content {
        max-width: 230px;
        line-break: pretty;
        white-space: normal;
    }
</style>
