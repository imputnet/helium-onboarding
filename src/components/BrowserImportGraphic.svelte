<script lang="ts">
    import { browserIcons } from "../lib/nonfree-icons";
    import { platform } from "../lib/platform";

    const { visible }: { visible: boolean } = $props();

    const browsers = [
        "firefox",
        platform.is.macos ? "dia" : "zen",
        "brave",
        platform.is.macos ? "safari" : "vivaldi",
        "chrome",
        "edge",
    ];

    for (let index = browsers.length - 1; index > 0; index--) {
        const other = Math.floor(Math.random() * (index + 1));
        [browsers[index], browsers[other]] = [browsers[other], browsers[index]];
    }

    const slots = [
        { x: -0.93, y: 0.05, size: 1.02, opacity: 1 },
        { x: 0.93, y: 0.05, size: 1.02, opacity: 1 },
        { x: -1.618, y: 0, size: 0.9, opacity: 1 },
        { x: 1.618, y: 0, size: 0.9, opacity: 1 },
        { x: -2.218, y: -0.05, size: 0.8, opacity: 0.65 },
        { x: 2.218, y: -0.05, size: 0.8, opacity: 0.65 },
    ];
    const icons = slots.map((slot, index) => ({
        ...slot,
        browser: browsers[index],
        delay: 150 + Math.floor(index / 2) * 70,
    }));
</script>

<div class={["browser-reveal", { collapsed: !visible }]} aria-hidden="true">
    <div class="icon-stage">
        <img
            class="browser-icon helium-icon"
            src={browserIcons.helium}
            alt=""
            draggable="false"
        />
        <div class="background-icons">
            {#each icons as icon}
                <img
                    class="browser-icon"
                    src={browserIcons[icon.browser]}
                    alt=""
                    draggable="false"
                    style:--offset={icon.x}
                    style:--y={icon.y}
                    style:--size={icon.size}
                    style:--icon-opacity={icon.opacity}
                    style:z-index={Math.round(icon.size * 100)}
                    style:--reveal-delay={`${icon.delay}ms`}
                />
            {/each}
        </div>
    </div>
</div>

<style>
    .browser-reveal {
        --icon-size: clamp(44px, 13vw, 96px);
        --stage-height: clamp(104px, 26vw, 176px);

        position: relative;
        height: var(--stage-height);
        pointer-events: none;
        transition: height var(--resize-duration) var(--resize-easing);

        &.collapsed {
            height: 0;
        }
    }

    .icon-stage {
        position: absolute;
        top: 0;
        width: 100%;
        height: var(--stage-height);
        transition: opacity var(--prompt-fade-duration) ease;
    }

    .collapsed .icon-stage {
        opacity: 0;
    }

    .background-icons {
        position: absolute;
        inset: 0;
        opacity: 0.5;
    }

    .browser-icon {
        --size-px: calc(var(--icon-size) * var(--size));
        --position: translate(
            calc(var(--offset) * var(--icon-size)),
            calc(var(--y) * var(--icon-size))
        );

        position: absolute;
        top: calc(50% - var(--size-px) / 2);
        left: calc(50% - var(--size-px) / 2);
        width: var(--size-px);
        height: var(--size-px);
        object-fit: contain;
        opacity: var(--icon-opacity);
        transform: var(--position);
        animation: browser-reveal 0.65s var(--resize-easing) var(--reveal-delay) both;
    }

    .helium-icon {
        --offset: 0;
        --y: 0;
        --size: 1.6;
        --icon-opacity: 1;
        --reveal-delay: 0ms;
        z-index: 200;
    }

    @keyframes browser-reveal {
        from {
            opacity: 0;
            transform: var(--position) translateY(14px) scale(0.85);
        }
        to {
            opacity: var(--icon-opacity);
            transform: var(--position);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .browser-reveal,
        .icon-stage {
            transition: none;
        }

        .browser-icon {
            animation: none;
        }
    }
</style>
