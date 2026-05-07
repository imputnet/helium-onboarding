# helium-onboarding

First-run onboarding wizard for the Helium browser, a privacy-focused Chromium fork.

## What it does

When a user opens Helium for the first time, this UI guides them through a sequence of setup pages:

1. **Welcome** — introduction to the browser
2. **Helium Services** — toggle opt-in features (extension proxy, search bangs, uBlock filter updates, spell-check dictionaries, auto-updates)
3. **Search Engine** — pick a default search engine, grouped by privacy level (private, independent, mainstream)
4. **Data Import** — import bookmarks, history, passwords, extensions, and autofill data from other installed browsers
5. **Password Manager** — install a password manager extension directly from this page
6. **Default Browser** — optionally set Helium as the system default
7. **Finish** — marks onboarding complete and redirects to `chrome://newtab`

Pages are skipped automatically when they are not applicable: the import page is skipped if no other browser profiles are found, the password manager page is skipped if the extension proxy is disabled, and the default browser page is skipped if Helium is already the default.

## How it works

The UI is a Svelte 5 + TypeScript app built with Vite. It runs inside Chromium as a WebUI page, meaning it communicates with the browser's C++ backend through the `chrome.send` / `sendWithPromise` bridge rather than a normal web server.

Preference changes (search engine, service toggles, default browser) are sent to the C++ backend in real time. Import and extension installation are also delegated to the browser via the same bridge.

The build pipeline is:

1. Vite compiles the app to `dist/`
2. A custom script (`util/generate-grd.mts`) walks `dist/` and generates a `.grd` resource definition file
3. Chromium's GN build system compiles that into a `.pak` file embedded in the browser binary

## Tech stack

| | |
|---|---|
| UI framework | Svelte 5 |
| Language | TypeScript |
| Build tool | Vite (targeting Chrome 140) |
| Fonts | Instrument Sans Variable |
| Chromium integration | GN + GRD resource system |

## Development

```sh
npm install
npm run dev      # dev server with hot reload
npm run build    # production build to dist/
npm run check    # svelte-check + tsc type checking
```

The dev server runs a standard browser preview. Full functionality (preferences, import, extension install) requires running inside the actual Helium browser where the `chrome.send` bridge is available.

## License

GPLv3
