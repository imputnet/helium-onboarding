<script lang="ts">
    import type { Snippet } from "svelte";

    type Props = {
        href: string;
        class?: string;
        children?: Snippet;
    };

    let { href, class: classes, children }: Props = $props();
    let target = $derived(href.startsWith("#") ? "" : "_blank");
</script>

<a {href} class={classes} {target} rel="noopener noreferrer">
    {@render children?.()}
</a>
