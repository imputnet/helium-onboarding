<script lang="ts">
    import { IconSearch } from "@imput/helium-prism";
    import { s } from "../lib/strings";
    import { getKeyword, searchEngines } from "../lib/browser";
    import { currentPage } from "../lib/onboarding-flow";
    import { searchEngineIcons } from "../lib/nonfree-icons";

    import PageHeader from "../components/PageHeader.svelte";
    import SearchEngineItem from "../components/SearchEngineItem.svelte";

    const searchDescs: Record<string, string> = s.searchEngines;

    const iconPath = (engine: string) =>
        searchEngineIcons[engine.toLowerCase()] ?? "";

    const visible = $derived($currentPage === "SearchEngine");
</script>

<div id="search-engines-page" class="onboarding-page" class:visible>
    <div class="scrollable-page">
        <PageHeader
            title={s.search.title}
            subtitle={s.search.subtitle}
            Icon={IconSearch}
        />

        <div class="page-content">
            {#each $searchEngines as e}
                {@const engineKey = getKeyword(e)}
                <SearchEngineItem
                    id={engineKey}
                    name={e.name}
                    desc={searchDescs[engineKey]}
                    iconPath={iconPath(engineKey)}
                    browserId={e.id}
                    isDefault={e.default}
                />
            {/each}
        </div>
    </div>
</div>
