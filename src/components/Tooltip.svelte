<script lang="ts">
    import type { Snippet } from "svelte";

    type Props = {
        anchor: Snippet;
        content: Snippet;
    }

    let { anchor, content }: Props = $props();

    let popover: HTMLDivElement;

    let tooltipX = $state(0);
    let tooltipY = $state(0);

    let visible = $state(false);

    const offsetY = 12;
    const offsetX = 16;

    const updatePosition = (e: MouseEvent) => {
        tooltipX = e.clientX - offsetX;
        tooltipY = e.clientY - offsetY;
    };

    $effect(() => {
        if (!popover) return;

        if (visible) {
            popover.showPopover();
        } else {
            popover.hidePopover();
        }
    });
</script>

<div
    class="tooltip-anchor"
    onmousemove={updatePosition}
    onmouseover={() => (visible = true)}
    onmouseleave={() => (visible = false)}
    onfocus={() => (visible = true)}
    onfocusout={() => (visible = false)}
    role="tooltip"
>
    {@render anchor()}
</div>

<div
    bind:this={popover}
    popover="manual"
    class="tooltip-container"
    style:left="{tooltipX}px"
    style:top="{tooltipY}px"
>
    <div class="tooltip-content">
        {@render content()}
    </div>
</div>

<style>
    .tooltip-anchor {
        display: flex;
        position: relative;
        width: fit-content;
        height: fit-content;
        gap: 6px;
    }

    .tooltip-container {
        position: fixed;
        margin: 0;
        padding: 16px;
        border: none;
        background: none;
        pointer-events: none;

        opacity: 0;
        transform: scale(0.8);
        transform-origin: left;
        transition: transform 0.15s, opacity 0.15s;
    }

    .tooltip-container:popover-open {
        opacity: 1;
        transform: none;
        transform-origin: top left;
    }

    @starting-style {
        .tooltip-container:popover-open {
            opacity: 0;
            transform: scale(0.8);
        }
    }

    .tooltip-content {
        color: var(--white);
        background-color: var(--helium-gradient-mid);
        outline: 1.5px solid var(--helium-elevated-30);
        outline-offset: -1.5px;

        text-wrap: pretty;
        padding: 10px 12px;
        font-size: 14px;
        white-space: pre;
        line-height: 1.2;

        border-radius: 12px;
        border-top-left-radius: 4px;
        box-shadow: 4px 4px 10px 0px rgba(var(--helium-gradient-mid-rgb), 0.9);
    }
</style>
