<script lang="ts">
    import IconCheck from "../icons/tabler/IconCheck.svelte";

    type Props = {
        checked: boolean;
    };

    const { checked }: Props = $props();
</script>

<div class="circle-checkbox" class:checked>
    <IconCheck />
</div>

<style>
    .circle-checkbox {
        height: 28px;
        width: 28px;
        min-height: 28px;
        min-width: 28px;
        border-radius: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: var(--helium-elevated-10);
        box-shadow: 0 0 0 1.5px var(--helium-elevated-5) inset;

        & > :global(svg) {
            width: 21px;
            height: 21px;
            stroke-width: 2px;
            opacity: 0;
        }

        &.checked {
            background-color: var(--primary);
            color: var(--tooltip-bg);

            & > :global(svg) {
                opacity: 1;
            }
        }
    }
</style>
