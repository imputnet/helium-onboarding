<script lang="ts">
    import { s } from "../lib/strings";
    import { platform } from "../lib/platform";
    import { currentPage } from "../lib/onboarding-flow";
    import { preferences as pr } from "../lib/browser";

    import Toggle from "../components/Toggle.svelte";
    import HeliumLogo from "../icons/HeliumLogo.svelte";
    import ButtonLink from "../components/ButtonLink.svelte";
    import PageHeader from "../components/PageHeader.svelte";
    import ToggleSeparator from "../components/ToggleSeparator.svelte";

    const visible = $derived($currentPage === "HeliumServices");
</script>

<div id="services-page" class="onboarding-page" class:visible>
    <div id="services-page-container" class="scrollable-page">
        <PageHeader
            title={s.services.title}
            subtitle={s.services.subtitle}
            Icon={HeliumLogo}
        />
        <div id="content" class="page-content">
            <Toggle
                title={s.services.connectionTitle}
                desc={s.services.connectionDesc}
                prefName={"services.enabled"}
            />
            <ToggleSeparator />
            <Toggle
                title={s.services.extensionsTitle}
                desc={s.services.extensionsDesc}
                prefName={"services.ext_proxy"}
                inactive={!$pr["services.enabled"]}
            />
            <Toggle
                title={s.services.bangsTitle}
                desc={s.services.bangsDesc}
                prefName={"services.bangs"}
                inactive={!$pr["services.enabled"]}
            />
            <Toggle
                title={s.services.ublockTitle}
                desc={s.services.ublockDesc}
                prefName={"services.ublock_assets"}
                inactive={!$pr["services.enabled"]}
            />
            {#if !platform.is.linux}
                <Toggle
                    title={s.services.autoupdatesTitle}
                    desc={s.services.autoupdatesDesc}
                    prefName={"services.browser_updates"}
                    inactive={!$pr["services.enabled"]}
                />
            {:else}
                <Toggle
                    title={s.services.autoupdatesTitleLinux}
                    desc={s.services.autoupdatesDescLinux}
                    prefName={"services.browser_updates"}
                    inactive={!$pr["services.enabled"]}
                />
            {/if}
            {#if !platform.is.macos}
                <Toggle
                    title={s.services.spellcheckTitle}
                    desc={s.services.spellcheckDesc}
                    prefName={"services.spellcheck_files"}
                    inactive={!$pr["services.enabled"]}
                />
            {/if}
            <ButtonLink
                title={s.services.instanceTitle}
                desc={s.services.instanceDesc}
                inactive={!$pr["services.enabled"]}
                dest="chrome://settings/privacy/services"
            />
        </div>
    </div>
</div>

<style>
    #services-page {
        justify-content: flex-start;
        visibility: hidden;

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
    }
</style>
