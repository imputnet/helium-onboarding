<script lang="ts">
    import { s } from "../lib/strings";
    import Tooltip from "./Tooltip.svelte";
    import HeliumLogo from "../icons/HeliumLogo.svelte";
</script>

<div class="helium-partner">
    <Tooltip>
        {#snippet anchor()}
            <div class="helium-partner-badge">
                <HeliumLogo />
                {s.partner.title}
            </div>
        {/snippet}
        {#snippet content()}
            {s.partner.tooltip}
        {/snippet}
    </Tooltip>
</div>

<style>
    .helium-partner {
        display: flex;
        position: relative;
        width: fit-content;
        cursor: help;
    }

    .helium-partner-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        font-weight: 400;
        width: fit-content;
        line-height: 0;
        padding: 2px 0;

        & :global(svg) {
            width: 13px;
            height: 13px;
        }
    }
</style>
