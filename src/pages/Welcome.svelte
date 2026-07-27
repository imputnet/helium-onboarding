<script lang="ts">
    import { flushSync, onMount } from "svelte";
    import {
        Button,
        HeliumLogo,
        IconArrowRight,
        IconCheck,
        Link,
    } from "@imput/helium-prism";
    import { s } from "../lib/strings";
    import { parseLocalizedString } from "../lib/i18n";
    import { setPref, acceptLatestSchema } from "../lib/browser";
    import {
        currentPage,
        hasSeenIntro,
        markIntroSeen,
        nextPage,
        ONBOARDING_INTRO_DELAY_MS,
    } from "../lib/onboarding-flow";

    const useDefaults = async () => {
        acceptLatestSchema();
        await setPref('services.user_consented', true);
        await setPref('completed_onboarding', true);
        window.open("chrome://newtab", "_self");
    }

    const visible = $derived($currentPage === "Welcome");

    const privacyUrl = "https://helium.computer/privacy";
    const termsUrl = "https://helium.computer/terms";
    const LOGO_TRANSITION_DELAY_MS = ONBOARDING_INTRO_DELAY_MS + 1600;
    const termsParts = parseLocalizedString(s.welcome.terms);

    let introLogoVisible = $state(!$hasSeenIntro);
    let introAnimating = $state(!$hasSeenIntro);
    const finalLogoVisible = $derived(!introLogoVisible);

    const next = () => {
        markIntroSeen();
        nextPage();
    }

    const transitionIntroLogo = async () => {
        const transition = document.startViewTransition(() => {
            flushSync(() => {
                introLogoVisible = false;
            });
        });

        await transition.finished;
        introAnimating = false;
    }

    onMount(() => {
        if ($hasSeenIntro) {
            return;
        }

        const timer = window.setTimeout(
            transitionIntroLogo,
            LOGO_TRANSITION_DELAY_MS
        );

        return () => {
            window.clearTimeout(timer);
        }
    });
</script>

{#if introLogoVisible}
    <div id="welcome-logo-intro">
        <HeliumLogo height="84px" />
    </div>
{/if}

<div
    id="welcome-page"
    class="onboarding-page"
    class:visible
    class:intro={!$hasSeenIntro}
    inert={introAnimating}
>
    <div id="welcome-page-container">
        <div id="welcome-top">
            <div id="welcome-logo-text">
                <div id="welcome-logo" class:visible={finalLogoVisible}>
                    <HeliumLogo height="48px" />
                </div>
                <div id="welcome-text">
                    <h1>
                        {s.welcome.greeting}
                    </h1>
                    <p>
                        {s.welcome.body}
                    </p>
                </div>
            </div>
            <div id="welcome-buttons" class="action-buttons">
                <Button onclick={useDefaults}>
                    <IconCheck />
                    {s.button.useDefaults}
                </Button>
                <Button primary onclick={next}>
                    <IconArrowRight />
                    {s.button.configure}
                </Button>
            </div>

            <div id="welcome-footer">
                <p>
                    {#each termsParts as part}
                        {#if part.kind === "linkPrivacy"}
                            <Link href={privacyUrl}>{part.text}</Link>
                        {:else if part.kind === "linkTerms"}
                            <Link href={termsUrl}>{part.text}</Link>
                        {:else}
                            {part.text}
                        {/if}
                    {/each}
                </p>

                <p>{s.welcome.footer}</p>
            </div>
        </div>
    </div>
</div>

<style>
    #welcome-page {
        --page-in-delay: 0.1s;
    }

    #welcome-top,
    #welcome-text,
    #welcome-logo-text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
    }

    #welcome-page-container {
        width: 100%;
        max-width: 548px;
        padding-inline: 24px;
    }

    #welcome-top,
    #welcome-logo-text {
        height: 100%;
        gap: 32px;
        justify-content: center;
    }

    #welcome-logo-text,
    #welcome-text {
        gap: 14px;
    }

    #welcome-logo {
        display: flex;
        opacity: 0;

        &.visible {
            opacity: 1;
            view-transition-name: welcome-logo;
        }
    }

    #welcome-text p {
        font-size: 21px;
        max-width: 500px;
    }

    #welcome-footer {
        display: flex;
        flex-direction: column;
        width: 100%;

        p {
            font-size: 13px;
        }

        :global(a) {
            font-size: inherit;
            line-height: inherit;
        }
    }

    #welcome-logo-intro {
        display: flex;
        position: absolute;
        z-index: 1;
        top: 50%;
        translate: 0 -50%;

        animation:
            intro-logo-center
            1.7s
            cubic-bezier(0.16, 1, 0.3, 1)
            calc(var(--onboarding-intro-delay) + 0.85s)
            both;
        view-transition-name: welcome-logo;
        will-change: transform, filter, opacity;
    }

    #welcome-page.visible.intro {
        animation: none;

        #welcome-text,
        #welcome-buttons,
        #welcome-footer {
            opacity: 0;
            animation:
                page-in
                0.35s
                forwards
                calc(var(--onboarding-intro-delay) + 1.8s);
        }
    }

    :global(::view-transition-group(welcome-logo)) {
        animation-duration: 0.72s;
        animation-timing-function: cubic-bezier(0.32, 1, 0.4, 1);
    }

    :global(::view-transition-image-pair(welcome-logo)) {
        animation: intro-logo-arc 0.72s;
    }

    :global(::view-transition-old(welcome-logo)),
    :global(::view-transition-new(welcome-logo)) {
        animation: none;
        filter: none;
        height: 100%;
        object-fit: contain;
        width: 100%;
    }

    @keyframes intro-logo-center {
        from {
            opacity: 0;
            transform: translateY(360px);
            filter: blur(10px);
        }

        90% {
            filter: none;
        }

        to {
            opacity: 1;
            transform: none;
            filter: none;
        }
    }

    @keyframes intro-logo-arc {
        from,
        to {
            translate: 0 0;
        }

        20% {
            translate: 0 -40px;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        #welcome-page.visible.intro {
            opacity: 0;
            animation:
                intro-state-fade-in
                0.5s
                calc(var(--onboarding-intro-delay) + 1.6s)
                both;

            #welcome-text,
            #welcome-buttons,
            #welcome-footer {
                opacity: 1;
                animation: none;
            }
        }

        #welcome-logo-intro {
            animation:
                intro-logo-center
                0.5s
                calc(var(--onboarding-intro-delay) + 0.2s)
                both;
        }

        #welcome-logo.visible {
            view-transition-name: none;
        }

        :global(::view-transition-group(welcome-logo)),
        :global(::view-transition-image-pair(welcome-logo)) {
            animation: none;
        }

        :global(::view-transition-old(welcome-logo)) {
            animation: intro-logo-fade-out 0.5s both;
        }

        :global(::view-transition-new(welcome-logo)) {
            display: none;
        }

        @keyframes intro-logo-center {
            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }

        @keyframes intro-logo-fade-out {
            from {
                opacity: 1;
            }

            to {
                opacity: 0;
            }
        }

        @keyframes intro-state-fade-in {
            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }
    }
</style>
