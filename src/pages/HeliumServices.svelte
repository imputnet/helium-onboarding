<script lang="ts">
    import { CardLink, HeliumLogo } from "@imput/helium-prism";
    import { s } from "../lib/strings";
    import { platform } from "../lib/platform";
    import { currentPage } from "../lib/onboarding-flow";
    import { preferences as pr } from "../lib/browser";

    import PreferenceToggle from "../components/PreferenceToggle.svelte";
    import PageHeader from "../components/PageHeader.svelte";

    const visible = $derived($currentPage === "HeliumServices");
    const servicesEnabled = $derived($pr["services.enabled"]);
    const autoupdatesTitle = platform.is.linux
        ? s.services.autoupdatesTitleLinux
        : s.services.autoupdatesTitle;
    const autoupdatesDesc = platform.is.linux
        ? s.services.autoupdatesDescLinux
        : s.services.autoupdatesDesc;
</script>

<div id="services-page" class="onboarding-page" class:visible>
    <div class="scrollable-page">
        <PageHeader
            title={s.services.title}
            subtitle={s.services.subtitle}
            Icon={HeliumLogo}
            iconHeight="32px"
        />
        <div class="page-content">
            <PreferenceToggle
                title={s.services.connectionTitle}
                desc={s.services.connectionDesc}
                prefName="services.enabled"
            />
            <div class="toggle-separator"></div>
            <PreferenceToggle
                title={s.services.extensionsTitle}
                desc={s.services.extensionsDesc}
                prefName="services.ext_proxy"
                disabled={!servicesEnabled}
            />
            <PreferenceToggle
                title={s.services.bangsTitle}
                desc={s.services.bangsDesc}
                prefName="services.bangs"
                disabled={!servicesEnabled}
            />
            <PreferenceToggle
                title={s.services.ublockTitle}
                desc={s.services.ublockDesc}
                prefName="services.ublock_assets"
                disabled={!servicesEnabled}
            />
            <PreferenceToggle
                title={autoupdatesTitle}
                desc={autoupdatesDesc}
                prefName="services.browser_updates"
                disabled={!servicesEnabled}
            />
            {#if !platform.is.macos}
                <PreferenceToggle
                    title={s.services.spellcheckTitle}
                    desc={s.services.spellcheckDesc}
                    prefName="services.spellcheck_files"
                    disabled={!servicesEnabled}
                />
            {/if}
            <div
                class="instance-link"
                class:inactive={!servicesEnabled}
                inert={!servicesEnabled}
            >
                <CardLink
                    title={s.services.instanceTitle}
                    desc={s.services.instanceDesc}
                    href="chrome://settings/privacy/services"
                    disabled={!servicesEnabled}
                />
            </div>
            </div>
        </div>
</div>

<style>
    #services-page {
        --page-in-delay: 0.1s;
    }

    .toggle-separator {
        height: 2px;
        width: calc(100% - 48px);
        background: var(--helium-elevated-10);
    }
</style>
