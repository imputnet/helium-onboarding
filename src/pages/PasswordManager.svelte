<script lang="ts">
    import { s } from "../lib/strings";
    import { currentPage } from "../lib/onboarding-flow";
    import { passwordManagers } from "../lib/password-managers";

    import PageHeader from "../components/PageHeader.svelte";
    import PasswordManagerOption from "../components/PasswordManagerOption.svelte";

    import IconLockStar from "../icons/tabler/IconLockStar.svelte";

    const visible = $derived($currentPage === "PasswordManager");
</script>

<div id="password-manager-page" class="onboarding-page" class:visible>
    <div id="password-manager-page-container" class="scrollable-page">
        <PageHeader
            title={s.password.title}
            subtitle={s.password.subtitle}
            Icon={IconLockStar}
        />

        <div id="content" class="page-content">
            {#each Object.entries(passwordManagers) as [id, info]}
                <PasswordManagerOption {id} {info} />
            {/each}
        </div>
    </div>
    <p id="password-manager-footer" class="trademark-disclaimer">
        {s.trademarkDisclaimer}
    </p>
</div>

<style>
    #password-manager-page {
        justify-content: flex-start;
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

    #password-manager-page-container {
        max-width: unset;
    }

    .page-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    @media screen and (max-width: 1000px) {
        .page-content {
            grid-template-columns: 1fr;
        }
    }
</style>
