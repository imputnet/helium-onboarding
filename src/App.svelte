<script lang="ts">
    import { onMount } from "svelte";
    import { SvelteSet } from "svelte/reactivity";
    import { GradientShimmer } from "@imput/helium-prism";
    import * as pages from "./pages";
    import * as Browser from "./lib/browser";
    import {
        currentPage,
        flow,
        hasSeenIntro,
        ONBOARDING_INTRO_DELAY_MS,
    } from "./lib/onboarding-flow";

    import PageNavigation from "./components/PageNavigation.svelte";

    const OUT_ANIMATION_DURATION = 200;

    type Page = typeof flow[number];

    Browser.setup();

    let gradientShimmer = $state<{ emphasize: () => void }>();
    let introStarted = $state($hasSeenIntro);
    const mountedPages = new SvelteSet<Page>([$currentPage]);
    let previousPage = $currentPage;

    const shimmerDimmed = $derived(
        $currentPage !== "Welcome" && $currentPage !== "Finish"
    );

    $effect(() => {
        const page = $currentPage;

        if (page === previousPage) {
            return;
        }

        const leavingPage = previousPage;
        mountedPages.add(page);
        previousPage = page;

        if (flow.indexOf(page) > flow.indexOf(leavingPage)) {
            gradientShimmer?.emphasize();
        }

        window.setTimeout(() => {
            if ($currentPage !== leavingPage) {
                mountedPages.delete(leavingPage);
            }
        }, OUT_ANIMATION_DURATION);
    });

    onMount(() => {
        if (introStarted) {
            return;
        }

        const timer = window.setTimeout(() => {
            introStarted = true;
        }, ONBOARDING_INTRO_DELAY_MS);

        return () => {
            window.clearTimeout(timer);
        };
    });
</script>

<main
    class:dimmed={shimmerDimmed}
    style:--onboarding-intro-delay={`${ONBOARDING_INTRO_DELAY_MS}ms`}
>
    {#if introStarted}
        <div class="shimmer-layer" class:dimmed={shimmerDimmed}>
            <GradientShimmer bind:this={gradientShimmer} />
        </div>
    {/if}

    <!-- Keep navigation mounted on Finish so it can animate out. -->
    {#if $currentPage !== "Welcome"}
        <PageNavigation />
    {/if}

    {#each flow as page (page)}
        {#if mountedPages.has(page)}
            {@const Component = pages[page]}
            <Component />
        {/if}
    {/each}
</main>

<style>
    main {
        position: relative;
        display: flex;
        justify-content: center;
        width: 100vw;
        min-height: 100vh;
        background: var(--bg-gradient-start);

        &::before {
            content: "";
            position: fixed;
            inset: 0;
            z-index: 0;
            background: var(--intro-gradient);
            opacity: 0;
            pointer-events: none;
            transition: opacity 1s;
        }

        & :global(.onboarding-page) {
            z-index: 1;
        }
    }

    .shimmer-layer {
        position: fixed;
        inset: 0;
        z-index: 0;
        opacity: 1;
        pointer-events: none;
        transition: opacity 1s;

        &.dimmed {
            opacity: 0.5;
        }
    }

    @media (prefers-color-scheme: dark) {
        main.dimmed::before {
            opacity: 1;
        }

        .shimmer-layer.dimmed {
            opacity: 0.3;
        }
    }
</style>
