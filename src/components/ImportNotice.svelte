<script lang="ts">
    import type { Snippet } from "svelte";

    type Props = {
        title?: string;
        tag?: "div" | "aside";
        role?: "status" | "alert";
        dashed?: boolean;
        action?: Snippet;
        children: Snippet;
    };

    const { title, tag = "div", role, dashed, action, children }: Props = $props();
    const titleId = $props.id();
</script>

<svelte:element
    this={tag}
    class={["import-notice", { dashed }]}
    {role}
    aria-labelledby={title ? titleId : undefined}
>
    {#if dashed}
        <!-- Drawn in SVG since CSS dashed borders can't round or space out dashes. -->
        <svg class="dashed-border" aria-hidden="true">
            <rect />
        </svg>
    {/if}
    <div class="notice-text">
        {#if title}
            <h4 id={titleId}>{title}</h4>
        {/if}
        {@render children()}
    </div>
    {#if action}
        <div class="notice-action">
            {@render action()}
        </div>
    {/if}
</svelte:element>

<style>
    .import-notice {
        --border-radius: 14px;

        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--gap-3);
        width: 100%;
        box-sizing: border-box;
        padding: 16px 21px;
        border-radius: var(--border-radius);
        background-color: var(--helium-elevated-7);
        text-align: left;
    }

    .dashed {
        --stroke-width: 2px;

        position: relative;
        background-color: var(--helium-elevated-5);
    }

    .dashed-border {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;

        & rect {
            /* Inset by half the stroke so it sits fully inside the box. */
            x: calc(var(--stroke-width) / 2);
            y: calc(var(--stroke-width) / 2);
            width: calc(100% - var(--stroke-width));
            height: calc(100% - var(--stroke-width));
            rx: calc(var(--border-radius) - var(--stroke-width) / 2);
            fill: none;
            stroke: var(--helium-elevated-30);
            stroke-width: var(--stroke-width);
            stroke-dasharray: 6 10;
            stroke-linecap: round;
        }
    }

    .notice-text {
        display: flex;
        flex: 1;
        min-width: 0;
        flex-direction: column;
        gap: 4px;

        & h4 {
            font-size: 17px;
        }

        & :global(p),
        & :global(a) {
            font-size: 15px;
        }
    }

    .notice-action {
        display: flex;
        flex-shrink: 0;
    }

    @media (max-width: 480px) {
        .import-notice {
            flex-wrap: wrap;
        }

        /* Move the action onto its own row, right-aligned. */
        .notice-action {
            flex-basis: 100%;
            justify-content: flex-end;
        }
    }
</style>
