<script lang="ts">
    import { s } from "../lib/strings";
    import HeliumLogo from "../icons/HeliumLogo.svelte";

    let tooltip = $state(false);
    let tooltipX = $state(0);
    let tooltipY = $state(0);

    const cursorPosition = (e: MouseEvent) => {
        tooltipX = e.clientX;
        tooltipY = e.clientY;
    }
</script>

<div
    class="helium-partner"
    onmousemove={cursorPosition}
    onmouseover={() => (tooltip = true)}
    onmouseleave={() => (tooltip = false)}
    onfocus={() => (tooltip = true)}
    onfocusout={() => (tooltip = false)}
    role="tooltip"
>
    <div class="helium-partner-badge">
        <HeliumLogo />
        {s.partner.title}
    </div>

    <div
        class="tooltip-container"
        class:visible={tooltip}
        style:left="{tooltipX}px"
        style:top="{tooltipY}px"
    >
        <div class="partner-tooltip">
            {s.partner.tooltip}
        </div>
    </div>
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
        padding: 1px 0;

        & :global(svg) {
            width: 13px;
            height: 13px;
        }
    }

    .partner-tooltip {
        background-color: var(--helium-gradient-mid);
        outline: 1.5px var(--helium-elevated-30) solid;
        outline-offset: -1.5px;

        text-wrap: pretty;
        padding: 10px 12px;
        font-size: 14px;

        border-radius: 12px;
        border-top-left-radius: 6px;
        box-shadow: 4px 4px 10px 2px rgba(var(--helium-gradient-mid-rgb), 0.9);
    }

    .tooltip-container {
        position: fixed;
        width: 214px;
        padding: 6px;
        pointer-events: none;

        opacity: 0;
        transform: scale(0.8);
        transform-origin: left;
        visibility: hidden;
        transition: transform 0.15s, opacity 0.15s, visibility 0.15s;
        will-change: transform, opacity, visibility, top, left;
    }

    .tooltip-container.visible {
        opacity: 1;
        transform: none;
        transform-origin: top left;
        visibility: visible;
    }
</style>
