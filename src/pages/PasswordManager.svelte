<script lang="ts">
    import { s } from "../lib/strings";
    import { platform } from "../lib/platform";
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

        <div class="page-content">
            {#each Object.entries(passwordManagers) as [id, info]}
                {#if !info.platforms || info.platforms.includes(platform.name)}
                    <PasswordManagerOption {id} {info} />
                {/if}
            {/each}
        </div>
    </div>
</div>

<style>
    #password-manager-page-container {
        max-width: 1000px;
    }

    .page-content {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        justify-items: center;
        width: 100%;
    }

    @media screen and (max-width: 1000px) {
        .page-content {
            grid-template-columns: 1fr;
        }
    }
</style>
