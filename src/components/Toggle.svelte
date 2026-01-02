<script lang="ts">
    import { setPref } from "../lib/browser";
    import { preferences, type Preferences } from "../lib/browser";

    type Props = {
        title: string;
        desc: string;
        prefName: keyof Preferences,
        inactive?: boolean
    };

    let { title, desc, prefName, inactive }: Props = $props();
    let enabled = $derived(!!$preferences[prefName]);
</script>

<button
    class="big"
    class:inactive
    onclick={() => {
        enabled = !enabled;
        setPref(prefName, enabled);
    }}
>
    <div class="toggle-text">
        <h4>{title}</h4>
        <p>{desc}</p>
    </div>
    <div class="toggle" class:enabled>
        <div class="runner"></div>
    </div>
</button>

<style>
    .toggle-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
        overflow: hidden;
    }

    .toggle {
        min-width: 48px;
        width: 48px;
        height: 28px;
        border-radius: 50px;

        background-color: var(--helium-elevated-30);

        transition: background-color 0.25s;

        & .runner {
            width: 22px;
            height: 22px;
            margin: 3px;
            background-color: var(--white);
            border-radius: 50px;
            will-change: translate;
            transition: translate 0.15s;
        }

        &.enabled {
            background-color: var(--helium-elevated-80);

            & .runner {
                translate: 20px 0;
            }
        }
    }
</style>
