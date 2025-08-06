<script lang="ts">
    import { s } from "../lib/strings";
    import { setPref } from "../lib/browser";
    import { currentPage } from "../lib/onboarding-flow";

    import HeliumLogo from "../icons/HeliumLogo.svelte";
    import IconCheck from "../icons/tabler/IconCheck.svelte";
    import IconHeart from "../icons/tabler/IconHeart.svelte";

    const done = async () => {
        await setPref('completed_onboarding', true);
        window.open("chrome://newtab", "_self");
    }

    const visible = $derived($currentPage === "Finish");
</script>

<div
    id="finish-page"
    class="onboarding-page"
    class:visible
>
    <div id="finish-page-container">
        <div id="finish-top">
            <div id="finish-logo-text">
                <div id="finish-logo">
                    <HeliumLogo />
                    <IconHeart />
                </div>
                <div id="finish-text">
                    <h1>{s.finish.title}</h1>
                    <p>{s.finish.body}</p>
                </div>
            </div>
            <button class="primary" onclick={done}>
                <IconCheck />
                {s.button.getStarted}
            </button>
        </div>
    </div>
</div>

<style>
    #finish-page {
        visibility: hidden;

        &.visible {
            visibility: visible;
            animation: zoom-blur-in 0.5s;
            animation-delay: 0.02s;
            animation-fill-mode: backwards;
        }

        &:not(.visible) {
            animation: zoom-blur-out 0.2s;
            animation-fill-mode: forwards;
        }
    }

    #finish-top,
    #finish-text,
    #finish-logo-text {
        display: flex;
        flex-direction: column;
    }

    #finish-page-container {
        max-width: 700px;
    }

    #finish-top,
    #finish-logo-text {
        height: 100%;
        gap: 32px;
        justify-content: center;
        align-items: center;
    }

    #finish-logo-text,
    #finish-text {
        gap: 20px
    }

    #finish-logo {
        display: flex;
        align-items: center;
        gap: 18px;
    }

    #finish-logo :global(svg) {
        height: 64px;
        width: 64px;

        &:last-child {
            stroke-width: 1.2px;
            height: 76px;
            width: 76px;
        }
    }

    #finish-text p {
        font-size: 20px;
    }

    @media (prefers-reduced-transparency) or (prefers-reduced-motion) {
        #finish-page.visible {
            animation: none;
            opacity: 1;
        }
    }
</style>
