<script lang="ts">
    import { s } from "../lib/strings";
    import { currentPage } from "../lib/onboarding-flow";
    import { searchEngines } from "../lib/browser/search-engines";
    import { searchEngineIcons } from "../lib/nonfree-icons";

    import PageHeader from "../components/PageHeader.svelte";
    import IconSearch from "../icons/tabler/IconSearch.svelte";
    import SearchEngineItem from "../components/SearchEngineItem.svelte";

    const searchDescs: Record<string, string> = s.searchEngines;

    const iconPath = (engine: string) =>
        searchEngineIcons[engine.toLowerCase()] ?? "";

    const visible = $derived($currentPage === "SearchEngine");
</script>

<div id="search-engines-page" class="onboarding-page" class:visible>
    <div id="search-engines-page-container" class="scrollable-page">
        <PageHeader
            title={s.search.title}
            subtitle={s.search.subtitle}
            Icon={IconSearch}
        />

        <div id="content" class="page-content">
            {#each $searchEngines as engine}
                {@const engineKey = engine.keyword.split(".")[0]}
                <SearchEngineItem
                    name={engine.name}
                    desc={searchDescs[engineKey]}
                    iconPath={iconPath(engineKey)}
                    modelIndex={engine.modelIndex}
                    isDefault={engine.default}
                />
            {/each}
        </div>
    </div>
    <p id="search-engines-footer" class="trademark-disclaimer">
        {s.trademarkDisclaimer}
    </p>
</div>

<style>
    #search-engines-page {
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
</style>
