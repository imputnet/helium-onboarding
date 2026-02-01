<script lang="ts">
    type Props = {
        title: string;
        subtitle: string;
        noTopMargin?: boolean;
        verticalTitle?: boolean;
        Icon: ConstructorOfATypedSvelteComponent;
    };

    const { title, subtitle, noTopMargin, verticalTitle, Icon }: Props = $props();
</script>

<div class="page-header" class:no-top-margin={noTopMargin}>
    <div class="title" class:vertical={verticalTitle}>
        <Icon />
        <h2>{title}</h2>
    </div>
    <p>{subtitle}</p>
</div>

<style>
    .page-header {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 64px;

        &.no-top-margin {
            margin-top: 0;
        }

        & p {
            font-size: 18px;
        }

        & .title {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;

            & > :global(svg) {
                height: 32px;
                width: 32px;
                stroke-width: 1.7px;
            }

            &.vertical {
                flex-direction: column;

                & > :global(svg) {
                    height: 48px;
                    width: 48px;
                    stroke-width: 1.5px;
                }
            }
        }
    }
</style>
