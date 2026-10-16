<script lang="ts" module>
    const browserIconMap = {
        Arc: "arc",
        Brave: "brave",
        Chromium: "chromium",
        Dia: "dia",
        Opera: "opera",
        Safari: "safari",
        Vivaldi: "vivaldi",
        Yandex: "yandex",
        Zen: "zen",

        "Google Chrome": "chrome",
        "Google Chrome Beta": "chrome_beta",
        "Google Chrome Canary": "chrome_canary",
        "Google Chrome Dev": "chrome_dev",
        "Microsoft Edge": "edge",
        "Mozilla Firefox": "firefox",
        "NAVER Whale": "whale",
        "Perplexity Comet": "comet",
    } as const;
</script>

<script lang="ts">
    import { IconWorld } from "@imput/helium-prism";
    import type { BrowserProfile } from "../lib/cr";
    import { browserIcons } from "../lib/nonfree-icons";

    import ProfileImportOption from "./ProfileImportOption.svelte";

    type Props = {
        browser: string;
        profiles: BrowserProfile[];
    };

    const { browser, profiles }: Props = $props();

    const icon = $derived(browserIconMap[browser as keyof typeof browserIconMap]);
    const url = $derived(icon && browserIcons[icon]);
</script>

<div class="browser-header">
    <div class="browser-icon">
        {#if url}
            <img src={url} alt="{browser} icon" />
        {:else}
            <IconWorld />
        {/if}
    </div>
    <h4>{browser}</h4>
</div>
<div class="browser-profiles">
    {#each profiles as profile (profile.id)}
        <ProfileImportOption {profile} />
    {/each}
</div>

<style>
    .browser-header {
        display: flex;
        width: 100%;
        align-items: center;
        gap: var(--gap-2);

        & .browser-icon {
            width: 28px;
            height: 28px;
            display: flex;
            justify-content: center;
            align-items: center;

            & img {
                width: 28px;
                height: 28px;
            }
        }

        & > h4 {
            line-height: 1;
        }
    }

    .browser-profiles {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: var(--gap-1);
    }
</style>
