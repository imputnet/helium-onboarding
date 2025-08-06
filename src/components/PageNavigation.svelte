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

    const visible = $derived(
        $currentPage !== "Welcome" && $currentPage !== "Finish"
    );

    const next = () => {
        switch ($currentPage) {
        case "HeliumServices":
            // if the user pressed "next" on the HeliumServices page,
            // then we mark consent (having seen the page) as true
            setPref("services.user_consented", true);
            break;

        case "DefaultBrowser":
            if ($userChoseHeliumAsDefault) askToBeDefault();
            break;

        case "DataImport":
            // slight delay just so the animation isn't chopped
            setTimeout(() => {
                $selectedProfiles.forEach((index) => {
                    importProfile(index, {
                        bookmarks: true,
                        history: true,
                        extensions: true,
                    });
                });

                $previouslyImportedProfiles = new SvelteSet([
                    ...$previouslyImportedProfiles,
                    ...$selectedProfiles,
                ]);
                $selectedProfiles.clear();
            }, 400);
            break;
        }

        nextPage();
    };

    const footerNotePages = ["SearchEngine", "DataImport"];
</script>

<div
    id="setup-buttons"
    class:visible
    class:footer-note={footerNotePages.includes($currentPage)}
>
    <button onclick={previousPage}>
        <IconArrowLeft />
        {s.button.back}
    </button>
    <button class="primary" onclick={next}>
        <IconArrowRight />
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
        will-change: transform, filter;

        &.visible {
            visibility: visible;
            animation: zoom-blur-in 0.5s;
            animation-delay: 0.1s;
            animation-fill-mode: backwards;
        }

        &:not(.visible) {
            animation: zoom-blur-out 0.2s;
            animation-fill-mode: forwards;
        }

        &.footer-note {
            transform: translateY(-5px);
        }
    }
</style>
