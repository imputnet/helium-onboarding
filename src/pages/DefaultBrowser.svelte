<script lang="ts">
    import { s } from "../lib/strings";
    import { currentPage, userChoseHeliumAsDefault } from "../lib/onboarding-flow";

    import PageHeader from "../components/PageHeader.svelte";
    import DefaultBrowserOption from "../components/DefaultBrowserOption.svelte";

    import IconX from "../icons/tabler/IconX.svelte";
    import IconCheck from "../icons/tabler/IconCheck.svelte";
    import IconWorldHeart from "../icons/tabler/IconWorldHeart.svelte";

    const visible = $derived($currentPage === "DefaultBrowser");
</script>

<div id="default-browser-page" class="onboarding-page" class:visible>
    <div id="default-browser-container">
        <PageHeader
            title={s.defaultBrowser.title}
            subtitle={s.defaultBrowser.subtitle}
            noTopMargin
            verticalTitle
            Icon={IconWorldHeart}
        />
        <div id="content" class="page-content">
            <DefaultBrowserOption
                title={s.defaultBrowser.yes}
                desc={s.defaultBrowser.yes_desc}
                state={userChoseHeliumAsDefault}
                stateOption={true}
                Icon={IconCheck}
            />
            <DefaultBrowserOption
                title={s.defaultBrowser.no}
                desc={s.defaultBrowser.no_desc}
                state={userChoseHeliumAsDefault}
                stateOption={false}
                Icon={IconX}
            />
        </div>
    </div>
</div>

<style>
    #default-browser-page {
        visibility: hidden;

        &.visible {
            visibility: visible;
            animation: page-in 0.3s;
            animation-delay: 0.05s;
            animation-fill-mode: backwards;
        }

        &:not(.visible) {
            animation: page-out 0.2s;
            animation-fill-mode: forwards;
        }
    }

    #default-browser-container {
        max-width: 600px;
    }
</style>
