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
    spans: Record<string, { begin: string; end: string }>;
    substitutions: Record<string, string>;
};

type XmlNode = {
    '#text'?: string;
    ':@'?: Record<string, string>;
    [tag: string]: string | XmlNode[] | Record<string, string> | undefined;
};

const toCamelCase = (value: string) => {
    return value.toLowerCase().split('_').map((word, i) =>
        i ? word.charAt(0).toUpperCase() + word.slice(1) : word
    ).join('');
};

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
const empty = (value: object) => Object.keys(value).length === 0;

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

const renderText = (
    nodes: XmlNode[],
    placeholders: Map<string, string>,
    insidePlaceholder = false,
): string => nodes.map(node => {
    if (typeof node['#text'] === 'string') {
        return node['#text'];
    } else if (Array.isArray(node.ph)) {
        const name = node[':@']?.$name;
        if (!name) {
            throw new Error('placeholder is missing a name');
        }

        const value = renderText(node.ph, placeholders, true);
        const previousValue = placeholders.get(name);
        if (previousValue !== undefined && previousValue !== value) {
            throw new Error(`conflicting values for placeholder: ${name}`);
        }
        placeholders.set(name, value);
        return value;
    }

    if (insidePlaceholder && Array.isArray(node.ex)) {
        return '';
    }

    const tag = Object.keys(node).find(key => key !== ':@');
    throw new Error(`unsupported element in message: <${tag ?? 'unknown'}>`);
}).join('');

const parseMessages = function*(grdp: string): Generator<Message> {
    const data = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '$',
        preserveOrder: true,
        trimValues: false,
    }).parse(grdp) as XmlNode[];

    const gritPart = data[0]['grit-part'];
    if (!Array.isArray(gritPart)) {
        throw new Error('expected <grit-part> root element');
    }

    for (const node of gritPart) {
        if (!Array.isArray(node.message)) {
            continue;
        }

        const name = node[':@']?.$name;
        if (!name) {
            throw new Error('message is missing a name attribute');
        }

        const keyPath = parseKey(name);
        const webuiKey = keyPath[0] + capitalize(keyPath[1]);
        const placeholders = new Map<string, string>();
        const text = renderText(node.message, placeholders).trim();
        const spans: Message['spans'] = {};
        const substitutions: Message['substitutions'] = {};

        for (const [placeholderName, begin] of placeholders) {
            if (placeholderName.startsWith('END_')) {
                const beginName = placeholderName.replace('END_', 'BEGIN_');
                if (!placeholders.has(beginName)) {
                    throw new Error(`${name} is missing placeholder ${beginName}`);
                }
                continue;
            }
            if (!placeholderName.startsWith('BEGIN_')) {
                continue;
            }

            const spanName = placeholderName.replace('BEGIN_', '');
            const endName = `END_${spanName}`;
            const end = placeholders.get(endName);
            if (end === undefined) {
                throw new Error(`${name} is missing placeholder ${endName}`);
            }

            spans[toCamelCase(spanName)] = { begin, end };
        }

        for (const [placeholderName, value] of placeholders) {
            if (placeholderName.startsWith('BEGIN_') ||
                placeholderName.startsWith('END_') ||
                !/^\$[1-9]$/.test(value)) {
                continue;
            }

            if (Object.values(substitutions).includes(value)) {
                throw new Error(`${name} uses ${value} for multiple placeholders`);
            }
            substitutions[toCamelCase(placeholderName)] = value;
        }

        yield {
            name,
            text,
            spans,
            substitutions,
            keyPath, webuiKey
        };
    }
};

const setNested = (target: Record<string, unknown>, path: [string, string], value: unknown) => {
    let current = target;
    for (const part of path.slice(0, -1)) {
        current[part] ??= {};
        current = current[part] as Record<string, unknown>;
    }
    current[path.at(-1)!] = value;
};

const renderLiteral = (value: unknown, indent = 0): string => {
    const pad = ' '.repeat(indent);
    const nextIndent = indent + 4;
    const nextPad = ' '.repeat(nextIndent);
    if (typeof value === 'string') {
        return JSON.stringify(value);
    }

    const entries = Object.entries(value as Record<string, unknown>);
    return `{\n${entries.map(([key, child]) =>
        `${nextPad}${key}: ${renderLiteral(child, nextIndent)},`
    ).join('\n')}\n${pad}}`;
};

const renderMessage = (message: Message, indent: number): string => {
    if (empty(message.spans) && empty(message.substitutions)) {
        return `getString('${message.webuiKey}')`;
    }

    const nextIndent = indent + 4;
    const pad = ' '.repeat(nextIndent);
    const fields = [
        `${pad}value: getString('${message.webuiKey}'),`,
    ];

    if (!empty(message.spans)) {
        fields.push(
            `${pad}spans: ${renderLiteral(message.spans, nextIndent)},`,
        );
    }

    if (!empty(message.substitutions)) {
        fields.push(
            `${pad}substitutions: ${
                renderLiteral(message.substitutions, nextIndent)
            },`,
        );
    }

    return `{\n${fields.join('\n')}\n${' '.repeat(indent)}}`;
};

const renderObject = (value: Record<string, unknown>, indent = 0): string => {
    const nextIndent = indent + 4, nextPad = ' '.repeat(nextIndent);
    return `{\n${Object.entries(value).map(([key, child]) => {
        if (child && typeof child === 'object' && 'webuiKey' in child) {
            const message = child as Message;
            if (empty(message.spans) && empty(message.substitutions)) {
                return `${nextPad}get ${key}() { return ${
                    renderMessage(message, nextIndent)
                }; },`;
            }

            return `${nextPad}get ${key}() {\n` +
                   `${nextPad}    return ${
                        renderMessage(message, nextIndent + 4)
                    };\n` +
                   `${nextPad}},`;
        }

        return `${nextPad}${key}: ${renderObject(
            child as Record<string, unknown>,
            nextIndent,
        )},`;
    }).join('\n')}\n${' '.repeat(indent)}}`;
};

const renderTs = (messages: Message[], template: string) => {
    const tree: Record<string, unknown> = {};
    for (const message of messages) {
        setNested(tree, message.keyPath, message);
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
