<script lang="ts">
    import { s } from "../lib/strings";
    import { setDefaultEngine } from "../lib/browser";
    import { searchEngineConfig, type SearchEngineName } from "../lib/search-engine-config";

    import Tooltip from "./Tooltip.svelte";

    import IconSearch from "../icons/tabler/IconSearch.svelte";

    import IconShieldCheck from "../icons/tabler/IconShieldCheck.svelte";
    import IconShieldExclamation from "../icons/tabler/IconShieldExclamation.svelte";
    import IconShieldOff from "../icons/tabler/IconShieldOff.svelte";
    import IconShieldQuestion from "../icons/tabler/IconShieldQuestion.svelte";

    type Props = {
        id: string;
        name: string;
        desc: string;
        iconPath: string;
        modelIndex: number;
        isDefault: boolean;
    };

    let { id, name, desc, iconPath, modelIndex, isDefault }: Props = $props();

    let brokenIcon = $state(false);

    const privacyMarkers = {
        private: IconShieldCheck,
        small: IconShieldExclamation,
        mainstream: IconShieldOff,
        custom: IconShieldQuestion,
    }

    const engineCategory = $derived.by(() => {
        if (Object.hasOwn(searchEngineConfig, id)) {
            return searchEngineConfig[id as SearchEngineName];
        }

        return "custom";
    });

    const PrivacyIcon = $derived(privacyMarkers[engineCategory]);
</script>

<button
    class="big"
    class:selected={isDefault}
    aria-pressed={isDefault}
    onclick={() => {
        setDefaultEngine(modelIndex);
    }}
>
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
                    {s.searchCategories[engineCategory]}
                {/snippet}
            </Tooltip>
            {name}
        </h4>
        {#if engineCategory !== "custom"}
            <p>{desc}</p>
        {/if}
    </div>
</button>

<style>
    button {
        gap: 18px;
        max-width: 600px;
    }

    .engine-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .engine-name {
        display: flex;
        align-items: center;
        gap: 4px;
        line-height: 1;
        margin-bottom: 2px;

        & :global(svg) {
            stroke-width: 2px;
            height: 19px;
            width: 19px;
        }
    }

    .engine-icon-container {
        background: var(--helium-elevated-30);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .engine-icon-container,
    .engine-icon {
        width: 32px;
        height: 32px;
        aspect-ratio: 1/1;
        border-radius: 8px;
    }
</style>
