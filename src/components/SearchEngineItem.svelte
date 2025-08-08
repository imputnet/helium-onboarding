<script lang="ts">
    import { setDefaultEngine } from "../lib/browser";
    import IconSearch from "../icons/tabler/IconSearch.svelte";

    type Props = {
        name: string;
        desc: string;
        iconPath: string;
        modelIndex: number;
        isDefault: boolean;
    };

    let { name, desc, iconPath, modelIndex, isDefault }: Props = $props();

    let brokenIcon = $state(false);
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
        <h4>{name}</h4>
        <p>{desc}</p>
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
