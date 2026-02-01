<script lang="ts">
    import "@fontsource-variable/instrument-sans";

    import * as pages from "./pages";
    import { currentPage, flow } from "./lib/onboarding-flow";

    import PageNavigation from "./components/PageNavigation.svelte";

    const OUT_ANIMATION_DURATION = 200;

    type Page = typeof flow[number];

    const initialMount = Object.fromEntries(
        flow.map(p => [p, false])
    ) as Record<Page, boolean>;

    let mounted = $state(initialMount);
    let prevPage: Page | null = null;

    $effect(() => {
        const page = $currentPage;
        mounted[page] = true;

        if (prevPage && prevPage !== page) {
            const toUnmount = prevPage;
            setTimeout(() => {
                if ($currentPage !== toUnmount) {
                    mounted[toUnmount] = false;
                }
            }, OUT_ANIMATION_DURATION);
        }

        prevPage = page;
    });
</script>

<main>
    <!--
        PageNavigation is not persistently displayed on the Finish page,
        but it's animated away from the previous page. Removing it from
        DOM would cause a sudden disappearance instead of a smooth animation.

        We could remove it after the animation is done, just like the
        actual pages, but it feels extremely unnecessary.
    -->
    {#if $currentPage !== "Welcome"}
        <PageNavigation />
    {/if}

    {#each flow as page (page)}
        {#if mounted[page]}
            {@const Component = pages[page]}
            <Component />
        {/if}
    {/each}
</main>

<style>
    main {
        height: 100vh;
    }
</style>
