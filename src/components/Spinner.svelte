<script lang="ts">
    import IconLoader from "../icons/tabler/IconLoader.svelte";
</script>

<div class="spinner">
    <IconLoader />
</div>

<style>
    .spinner {
        display: flex;
        animation: spinner 0.7s infinite linear;
    }

    @keyframes spinner {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
