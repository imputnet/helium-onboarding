<script lang="ts">
    import type { Snippet } from "svelte";

    type Props = {
        title?: string;
        role?: "status" | "alert";
        action?: Snippet;
        children: Snippet;
    };

    const { title, role, action, children }: Props = $props();
    const titleId = $props.id();
</script>

<div
    class="import-notice"
    {role}
    aria-labelledby={title ? titleId : undefined}
>
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
</div>

<style>
    .import-notice {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--gap-3);
        width: 100%;
        box-sizing: border-box;
        padding: 16px 21px;
        border-radius: 14px;
        background-color: var(--helium-elevated-7);
        text-align: left;
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
