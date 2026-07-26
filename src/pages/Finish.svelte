<script lang="ts">
    import {
        Button,
        HeliumLogo,
        IconArrowLeft,
        IconCheck,
    } from "@imput/helium-prism";
    import { s } from "../lib/strings";
    import { setPref } from "../lib/browser";
    import { currentPage, previousPage } from "../lib/onboarding-flow";

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
                    <HeliumLogo height="64px" />
                </div>
                <div id="finish-text">
                    <h1>{s.finish.title}</h1>
                    <p>{s.finish.body}</p>
                </div>
            </div>
            <div class="action-buttons">
                <Button onclick={previousPage}>
                    <IconArrowLeft />
                    {s.button.back}
                </Button>
                <Button primary onclick={done}>
                    <IconCheck />
                    {s.button.letsGo}
                </Button>
            </div>
        </div>
    </div>
</div>

<style>
    #finish-page {
        --page-in-delay: 0.15s;
    }

    #finish-top,
    #finish-text,
    #finish-logo-text {
        display: flex;
        flex-direction: column;
    }

    #finish-page-container {
        max-width: 500px;
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
        gap: 16px
    }

    #finish-logo {
        display: flex;
        align-items: center;
    }

    #finish-text p {
        font-size: 20px;
    }
</style>
