<script lang="ts">
    import { Button } from "@imput/helium-prism";
    import type { Component } from "svelte";
    import type { Writable } from "svelte/store";

    type Props = {
        title: string;
        desc: string;
        state: Writable<boolean>;
        stateOption: boolean;
        Icon: Component;
    };

    const { title, desc, state, stateOption, Icon }: Props = $props();
</script>

<Button
    card
    selected={$state === stateOption}
    aria-pressed={$state === stateOption}
    onclick={() => {
        $state = stateOption;
    }}
>
    <div class="icon-container" aria-hidden="true">
        <Icon />
    </div>
    <div class="text">
        <h4>{title}</h4>
        <p>{desc}</p>
    </div>
</Button>

<style>
    .text {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .icon-container {
        display: flex;

        & > :global(svg) {
            width: 32px;
            height: 32px;
        }
    }
</style>
