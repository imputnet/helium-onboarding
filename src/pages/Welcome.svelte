<script lang="ts">
    import { s } from "../lib/strings";
    import { setPref } from "../lib/browser";
    import { currentPage, nextPage } from "../lib/onboarding-flow";

    import OuterLink from "../components/OuterLink.svelte";

    import HeliumLogo from "../icons/HeliumLogo.svelte";
    import IconCheck from "../icons/tabler/IconCheck.svelte";
    import IconArrowRight from "../icons/tabler/IconArrowRight.svelte";

    const useDefaults = async () => {
        chrome.send('acceptLatestSchema');
        await setPref('services.user_consented', true);
        await setPref('completed_onboarding', true);
        window.open("chrome://newtab", "_self");
    }

    const visible = $derived($currentPage === "Welcome");

    const privacyUrl = "https://helium.computer/privacy";
    const termsUrl = "https://helium.computer/terms";
</script>

<div
    id="welcome-page"
    class="onboarding-page"
    class:visible
>
    <div id="welcome-page-container">
        <div id="welcome-top">
            <div id="welcome-logo-text">
                <div id="welcome-logo">
                    <HeliumLogo />
                </div>
                <div id="welcome-text">
                    <h1>{s.welcome.greeting}</h1>
                    <p>{s.welcome.body}</p>
                </div>
            </div>
            <div id="welcome-buttons">
                <button onclick={useDefaults}>
                    <IconCheck />
                    {s.button.useDefaults}
                </button>
                <button class="primary" onclick={nextPage}>
                    <IconArrowRight />
                    {s.button.configure}
                </button>
            </div>
        </div>
        <div id="welcome-footer">
            <p id="legal-note">
                {s.welcome.terms_note}
                <OuterLink href={privacyUrl}>
                    {s.welcome.terms_privacy}
                </OuterLink>
                {s.welcome.terms_and}
                <OuterLink href={termsUrl}>
                    {s.welcome.terms_use}
                </OuterLink>.
            </p>

            <p>{s.welcome.defaults}</p>
        </div>
    </div>
</div>

<style>
    #welcome-page {
        visibility: hidden;

        &.visible {
            visibility: visible;
        }

        &:not(.visible) {
            animation: zoom-blur-out 0.2s;
            animation-fill-mode: forwards;
        }
    }

    #welcome-top,
    #welcome-text,
    #welcome-logo-text {
        display: flex;
        flex-direction: column;
    }

    #welcome-page-container {
        max-width: 700px;
    }

    #welcome-top,
    #welcome-logo-text {
        height: 100%;
        gap: 32px;
        justify-content: center;
        align-items: center;
    }

    #welcome-logo-text,
    #welcome-text {
        gap: 20px
    }

    #welcome-logo-text {
        max-width: 600px;
    }

    #welcome-logo :global(svg) {
        height: 64px;
        width: 64px;
    }

    .visible {
        #welcome-logo {
            animation: logo-intro 0.6s;
            animation-delay: 0.6s;
        }

        #welcome-text,
        #welcome-buttons,
        #welcome-footer {
            animation: blur-in 0.35s;
        }

        #welcome-text {
            animation-delay: 1s;
        }

        #welcome-buttons {
            animation-delay: 1.1s;
        }

        #welcome-footer {
            animation-delay: 1.2s;
        }

        #welcome-logo,
        #welcome-text,
        #welcome-buttons,
        #welcome-footer {
            animation-fill-mode: both;
            will-change: transform, filter, opacity;
        }
    }

    #welcome-text p {
        font-size: 20px;
    }

    #welcome-buttons {
        display: flex;
        gap: var(--gap-2);
    }

    #welcome-footer {
        bottom: 32px;
        position: absolute;
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        left: 0;
    }

    #welcome-footer p {
        font-size: 12px;
    }

    @media (prefers-reduced-motion) {
        #welcome-page.visible * {
            animation-delay: 0.2s;
            animation-duration: 0.5s;
        }
    }
</style>
