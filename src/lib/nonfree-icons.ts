type FileMap = Record<string, string>;

const mapFromGlob = (files: FileMap): FileMap => {
    const map: FileMap = {};
    for (const [path, url] of Object.entries(files)) {
        const basename = path.split("/").pop()!.split(".")[0].toLowerCase();
        map[basename] = url;
    }
    return map;
}

export const searchEngineIcons = mapFromGlob(
    import.meta.glob(
        "$nonfree/search_engines/*.{svg,png}",
        { eager: true, query: '?url', import: 'default' }
    )
);

export const browserIcons = mapFromGlob(
    import.meta.glob(
        "$nonfree/browsers/*.png",
        { eager: true, query: '?url', import: 'default' }
    )
);
