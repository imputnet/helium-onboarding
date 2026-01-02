export type SearchCategory = "private" | "small" | "mainstream" | "custom";

export const searchEngineConfig: Record<string, SearchCategory> = {
    duckduckgo: "private",
    kagi: "private",
    ecosia: "small",
    qwant: "small",
    google: "mainstream",
    bing: "mainstream",
};

export type SearchEngineName = keyof typeof searchEngineConfig;
