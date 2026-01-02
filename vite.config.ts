import path from "path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
    plugins: [svelte()],
    resolve: {
        alias: {
            $nonfree: path.resolve(__dirname, "node_modules/nonfree-icons"),
        }
    },
    build: {
        target: 'chrome140',
        assetsInlineLimit: (filename) => filename.endsWith('.svg')
    }
});
