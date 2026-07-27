<script lang="ts">
    import { IconCheck, IconX } from "@imput/helium-prism";
    import { s } from "../lib/strings";
    import { currentPage, userChoseHeliumAsDefault } from "../lib/onboarding-flow";

    import PageHeader from "../components/PageHeader.svelte";
    import DefaultBrowserOption from "../components/DefaultBrowserOption.svelte";

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
        <div class="page-content">
            <DefaultBrowserOption
                title={s.defaultBrowser.yes}
                desc={s.defaultBrowser.yesDesc}
                state={userChoseHeliumAsDefault}
                stateOption={true}
                Icon={IconCheck}
            />
            <DefaultBrowserOption
                title={s.defaultBrowser.no}
                desc={s.defaultBrowser.noDesc}
                state={userChoseHeliumAsDefault}
                stateOption={false}
                Icon={IconX}
            />
        </div>
    </div>
</div>

<style>
    #default-browser-container {
        max-width: 600px;
    }
</style>
