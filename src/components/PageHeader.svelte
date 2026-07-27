<script lang="ts">
    import type { Component } from "svelte";

    type Props = {
        title: string;
        subtitle: string;
        noTopMargin?: boolean;
        verticalTitle?: boolean;
        iconHeight?: string;
        Icon: Component;
    };

    const {
        title,
        subtitle,
        noTopMargin,
        verticalTitle,
        iconHeight,
        Icon,
    }: Props = $props();
</script>

<div class="page-header" class:no-top-margin={noTopMargin}>
    <div class="title" class:vertical={verticalTitle}>
        <div class="header-icon">
            {#if iconHeight}
                <Icon height={iconHeight} />
            {:else}
                <Icon />
            {/if}
        </div>
        <h2>{title}</h2>
    </div>
    <p>{subtitle}</p>
</div>

<style>
    .page-header {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: var(--gap-2);
        margin-top: 48px;

        &.no-top-margin {
            margin-top: 0;
        }

        & p {
            font-size: 18px;
            max-width: 450px;
            text-wrap: pretty;
        }

        & .title {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;

            & .header-icon {
                display: flex;
                height: 32px;
                width: 32px;
            }

            & .header-icon :global(svg) {
                width: 100%;
                height: 100%;
                stroke-width: 2px;
            }

            &.vertical {
                flex-direction: column;

                & .header-icon {
                    height: 48px;
                    width: 48px;
                }

                & .header-icon :global(svg) {
                    stroke-width: 1.6px;
                }
            }
        }
    }
</style>
