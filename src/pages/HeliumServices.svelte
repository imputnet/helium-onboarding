<script lang="ts">
    import { s } from "../lib/strings";
    import { currentPage } from "../lib/onboarding-flow";
    // pr - preferences, shortened for convenience
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
                title={s.services.connection_title}
                desc={s.services.connection_desc}
                prefName={"services.enabled"}
            />
            <ToggleSeparator />
            <Toggle
                title={s.services.bangs_title}
                desc={s.services.bangs_desc}
                prefName={"services.bangs"}
                inactive={!$pr["services.enabled"]}
            />
            <Toggle
                title={s.services.extensions_title}
                desc={s.services.extensions_desc}
                prefName={"services.ext_proxy"}
                inactive={!$pr["services.enabled"]}
            />
            <Toggle
                title={s.services.autoupdates_title}
                desc={s.services.autoupdates_desc}
                prefName={"services.browser_updates"}
                inactive={!$pr["services.enabled"]}
            />
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
