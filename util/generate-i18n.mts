import { readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { XMLParser } from 'fast-xml-parser';

const PREFIX = 'IDS_HELIUM_ONBOARDING_';
const GRD_PATH = join(import.meta.dirname, '../helium_onboarding_strings.grdp');
const TS_PATH = join(import.meta.dirname, '../src/lib/strings.ts');

if (process.argv.length !== 2 && process.argv.length !== 3) {
    console.error(
        `usage: ${basename(process.argv[1])} [<localized_strings.h>]\n` +
        '<localized_strings.h> is only needed when applying onboarding into ' +
        'the Chromium tree.'
    );
    process.exit(1);
}

const [headerPath] = process.argv.slice(2);

type Message = {
    name: string;
    text: string;
    keyPath: [string, string];
    webuiKey: string;
};

const toCamelCase = (value: string) => {
    return value.toLowerCase().split('_').map((word, i) =>
        i ? word.charAt(0).toUpperCase() + word.slice(1) : word
    ).join('');
};

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const LONG_SECTIONS = [
    'SEARCH_CATEGORIES',
    'SEARCH_ENGINES',
    'DEFAULT_BROWSER',
    'DATA_IMPORT',
    'PASSWORD_MANAGERS',
];

const parseKey = (key: string): [string, string] => {
    if (!key.startsWith(PREFIX)) {
        throw new Error(`unexpected message name: ${key}`);
    }

    key = key.replace(PREFIX, '');
    let name: string, section = LONG_SECTIONS.find(
        section => key.startsWith(`${section}_`)
    );

    if (section) {
        name = key.replace(`${section}_`, '');
    } else {
        const [ s, ...rest ] = key.split('_');
        section = s;
        name = rest.join('_');
    }

    return [ toCamelCase(section), toCamelCase(name) ];
}

const parseMessages = function*(grdp: string): Generator<Message> {
    const data = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '$',
    }).parse(grdp)['grit-part']['message'];

    for (const message of data) {
        const keyPath = parseKey(message.$name);
        const webuiKey = keyPath[0] + capitalize(keyPath[1]);

        yield {
            name: message.$name,
            text: message['#text'],
            keyPath, webuiKey
        };
    }
};

const setNested = (target: Record<string, unknown>, path: [string, string], value: string) => {
    let current = target;
    for (const part of path.slice(0, -1)) {
        current[part] ??= {};
        current = current[part] as Record<string, unknown>;
    }
    current[path.at(-1)!] = value;
};

const renderObject = (value: unknown, indent = 0): string => {
    const pad = ' '.repeat(indent);
    const nextPad = ' '.repeat(indent + 4);
    if (typeof value === 'string') {
        return `getString('${value}')`;
    }

    const entries = Object.entries(value as Record<string, unknown>);
    return `{\n${entries.map(([key, child]) =>
        typeof child === 'string'
            ? `${nextPad}get ${key}() { return ${renderObject(child, indent + 4)}; },`
            : `${nextPad}${key}: ${renderObject(child, indent + 4)},`
    ).join('\n')}\n${pad}}`;
};

const renderTs = (messages: Message[], template: string) => {
    const tree: Record<string, unknown> = {};
    for (const message of messages) {
        setNested(tree, message.keyPath, message.webuiKey);
    }

    const devStrings = messages.map(({ webuiKey, text }) =>
        `    ${JSON.stringify(webuiKey)}: ${JSON.stringify(text)},`
    ).join('\n');

    const keys = [
        /* never */'',
        ...messages.map(({ webuiKey }) => JSON.stringify(webuiKey))
    ].join('\n | ');

    return template
                .replace('/* $keys */', keys)
                .replace('/* $devStrings */', devStrings)
                .replace('{/* $tree */}', renderObject(tree));
};

const renderHeader = (messages: Message[], template: string) => {
    const entries = messages.map(({ webuiKey, name }) =>
        `    {${JSON.stringify(webuiKey)}, ${name}},`
    ).join('\n');

    return template.replace('/* $entries */', entries);
};

const readTemplate = (filename: string) => {
    const path = join(import.meta.dirname, filename);
    return readFile(path, 'utf8');
}

const grdp = await readFile(GRD_PATH, 'utf-8');
const messages = [...parseMessages(grdp)];

if (headerPath) {
    await writeFile(
        headerPath,
        renderHeader(
            messages,
            await readTemplate('./localized-strings.h.in'),
        )
    );
}

await writeFile(
    TS_PATH,
    renderTs(
        messages,
        await readTemplate('./strings.ts.in')
    )
);
