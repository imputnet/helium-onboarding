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

    // TODO: remove/update this as auto-updates become
    // available on windows and linux
    const platformSpecific = {
        macos: {
            title: s.services.autoupdates_title,
            extraDesc: ""
        },
        linux: {
            title: s.services.autoupdates_title_unavailable,
            extraDesc: s.services.autoupdates_linux
        },
        windows: {
            title: s.services.autoupdates_title_unavailable,
            extraDesc: s.services.autoupdates_windows
        }
    };

    const updatesPlatformText = platformSpecific[platform.name];
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
                title={s.services.connection_title}
                desc={s.services.connection_desc}
                prefName={"services.enabled"}
            />
            <ToggleSeparator />
            <Toggle
                title={s.services.extensions_title}
                desc={s.services.extensions_desc}
                prefName={"services.ext_proxy"}
                inactive={!$pr["services.enabled"]}
            />
            <Toggle
                title={s.services.bangs_title}
                desc={s.services.bangs_desc}
                prefName={"services.bangs"}
                inactive={!$pr["services.enabled"]}
            />
            <Toggle
                title={s.services.ublock_title}
                desc={s.services.ublock_desc}
                prefName={"services.ublock_assets"}
                inactive={!$pr["services.enabled"]}
            />
            <Toggle
                title={updatesPlatformText.title}
                desc={s.services.autoupdates_desc + updatesPlatformText.extraDesc}
                prefName={"services.browser_updates"}
                inactive={!$pr["services.enabled"]}
            />
            {#if !platform.is.macos}
                <Toggle
                    title={s.services.spellcheck_title}
                    desc={s.services.spellcheck_desc}
                    prefName={"services.spellcheck_files"}
                    inactive={!$pr["services.enabled"]}
                />
            {/if}
            <ButtonLink
                title={s.services.instance_title}
                desc={s.services.instance_desc}
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
            animation: zoom-blur-in 0.5s;
            animation-delay: 0.1s;
            animation-fill-mode: backwards;
        }

        &:not(.visible) {
            animation: zoom-blur-out 0.2s;
            animation-fill-mode: forwards;
        }
    }
</style>
