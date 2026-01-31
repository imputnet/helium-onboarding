<script lang="ts">
    import "@fontsource-variable/instrument-sans";

    import { currentPage } from "./lib/onboarding-flow";

    import Welcome from "./pages/Welcome.svelte";
    import PageNavigation from "./components/PageNavigation.svelte";
    import HeliumServices from "./pages/HeliumServices.svelte";
    import SearchEngine from "./pages/SearchEngine.svelte";
    import DataImport from "./pages/DataImport.svelte";
    import PasswordManager from "./pages/PasswordManager.svelte";
    import DefaultBrowser from "./pages/DefaultBrowser.svelte";
    import Finish from "./pages/Finish.svelte";
</script>

<main>
    <Welcome />

    <div id="secondary" class:visible={$currentPage !== "Welcome"}>
        <PageNavigation />
        <HeliumServices />
        <SearchEngine />
        <DataImport />
        <PasswordManager />
        <DefaultBrowser />
        <Finish />
    </div>
</main>

<style>
    main {
        height: 100vh;
    }

    /*
       hide secondary pages on start
       & allow them to animate out if user goes back to welcome screen.
       the "out" animation on either of secondary pages takes 0.2s.
    */
    #secondary {
        opacity: 0;
        transition: 0s opacity;
        transition-delay: 0.2s;
    }

    #secondary.visible {
        opacity: 1;
    }
</style>
