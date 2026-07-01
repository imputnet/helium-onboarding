import path from "node:path";
import { promisify } from "node:util";
import { execFile } from "node:child_process";
import { defineConfig, PluginOption } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

const grdWatcher: PluginOption = {
    name: "grd-watch",
    apply: "serve",
    configureServer(server) {
        const i18nInputs = new Set([
            "helium_onboarding_strings.grdp",
            "util/generate-i18n.mts",
            "util/localized-strings.h.in",
            "util/strings.ts.in",
        ].map((file) => path.resolve(__dirname, file)));

        server.watcher.add([...i18nInputs]);
        server.watcher.on("change", async (changedPath) => {
            if (!i18nInputs.has(path.resolve(changedPath))) {
                return;
            }

            try {
                await promisify(execFile)(process.execPath, [
                    path.resolve(__dirname, "util/generate-i18n.mts"),
                ]);
                server.config.logger.info("regenerated i18n strings");
            } catch (error) {
                server.config.logger.error(
                    error instanceof Error
                        ? error.message
                        : String(error)
                );
            }
        });
    },
};

export default defineConfig({
    plugins: [
        grdWatcher,
        svelte(),
    ],
    build: {
        target: 'chrome140',
        assetsInlineLimit: (filename) => filename.endsWith('.svg')
    }
});
