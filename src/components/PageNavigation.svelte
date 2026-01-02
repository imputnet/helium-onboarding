<script lang="ts">
    import { s } from "../lib/strings";
    import { SvelteSet } from "svelte/reactivity";
    import { askToBeDefault, importProfile, setPref } from "../lib/browser";
    import {
        nextPage,
        previousPage,
        currentPage,
        userChoseHeliumAsDefault,
        selectedProfiles,
        previouslyImportedProfiles,
    } from "../lib/onboarding-flow";

    import IconArrowLeft from "../icons/tabler/IconArrowLeft.svelte";
    import IconArrowRight from "../icons/tabler/IconArrowRight.svelte";
    import IconLoader from "../icons/tabler/IconLoader.svelte";

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
            chrome.send("acceptLatestSchema");
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

    const footerNotePages = ["SearchEngine", "DataImport"];
</script>

<div
    id="setup-buttons"
    class:visible
    class:footer-note={footerNotePages.includes($currentPage)}
>
    <button disabled={working} onclick={previousPage}>
        <IconArrowLeft />
        {s.button.back}
    </button>
    <button disabled={working} class="primary" onclick={next}>
        {#if working}
            <div class="spinner">
                <IconLoader />
            </div>
        {:else}
            <IconArrowRight />
        {/if}
        {s.button.next}
    </button>
</div>

<style>
    #setup-buttons {
        display: flex;
        justify-content: center;
        width: 100%;
        left: 0;
        bottom: 48px;
        position: absolute;
        gap: var(--gap-2);
        padding-top: var(--gap-1);
        z-index: 9;

        visibility: hidden;

        transition: transform 0.25s;
        will-change: translate, transform, filter;

        &.visible {
            visibility: visible;
            animation: page-in 0.3s;
            animation-delay: 0.1s;
            animation-fill-mode: backwards;
        }

        &:not(.visible) {
            animation: page-out 0.2s;
            animation-fill-mode: forwards;
        }

        &.footer-note {
            transform: translateY(-5px);
        }
    }

    .spinner {
        display: flex;
        animation: spinner 0.7s infinite linear;
    }

    @keyframes spinner {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
