<script lang="ts">
    import {
        Button,
        IconArrowLeft,
        IconArrowRight,
        Spinner,
    } from "@imput/helium-prism";
    import { s } from "../lib/strings";
    import { SvelteSet } from "svelte/reactivity";
    import { acceptLatestSchema, askToBeDefault, importProfile, setPref } from "../lib/browser";
    import {
        nextPage,
        previousPage,
        currentPage,
        userChoseHeliumAsDefault,
        selectedProfiles,
        previouslyImportedProfiles,
    } from "../lib/onboarding-flow";

    const visible = $derived(
        $currentPage !== "Welcome" && $currentPage !== "Finish"
    );

    let working = $state(false);

    const doNext = async () => {
        switch ($currentPage) {
        case "HeliumServices":
            // if the user pressed "next" on the HeliumServices page,
            // then we mark consent (having seen the page) as true
            await setPref("services.user_consented", true);
            acceptLatestSchema();
            break;

        case "DefaultBrowser":
            if ($userChoseHeliumAsDefault) {
                askToBeDefault();
            }
            break;

        case "DataImport":
            // FIXME: handle errors
            await Promise.allSettled(
                [...$selectedProfiles].map(
                    index => importProfile(index, {
                        bookmarks: true,
                        history: true,
                        extensions: true
                    })
                )
            );

            $previouslyImportedProfiles = new SvelteSet([
                ...$previouslyImportedProfiles,
                ...$selectedProfiles,
            ]);
            $selectedProfiles.clear();
            break;
        }
    };

    const next = () => {
        working = true;
        doNext()
            .catch(() => {})
            .finally(() => {
                working = false;
                nextPage();
            });
    }
</script>

<div class="glass-children">
    <div id="setup-buttons" class="action-buttons" class:visible>
        <Button disabled={working} onclick={previousPage}>
            <IconArrowLeft />
            {s.button.back}
        </Button>
        <Button disabled={working} primary onclick={next}>
            {#if working}
                <Spinner size={18} />
            {:else}
                <IconArrowRight />
            {/if}
            {s.button.next}
        </Button>
    </div>
</div>

<style>
    #setup-buttons {
        --bottom-space: 24px;
        --misclick-protect: 8px;

        bottom: var(--bottom-space);
        left: 50%;
        transform: translateX(-50%);

        justify-content: center;

        position: fixed;
        z-index: 9;

        visibility: hidden;

        &.visible {
            visibility: visible;
            animation: slide-in 0.35s;
            animation-delay: 0.4s;
            animation-fill-mode: backwards;
        }
    }

    /* invisible bottom layer to prevent misclicks */
    #setup-buttons::before {
        content: '';
        width: 600px;
        height: calc(100% + var(--bottom-space) + var(--misclick-protect));
        top: calc(-1 * var(--misclick-protect));
        position: absolute;
    }

    @keyframes slide-in {
        from {
            translate: 0 80px;
        }
    }

    @media (prefers-reduced-motion) {
        #setup-buttons.visible {
            animation: none;
        }
    }
</style>
