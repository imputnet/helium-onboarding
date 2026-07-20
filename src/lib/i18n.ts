type LocalizedStringSpan = {
    begin: string;
    end: string;
};

type LocalizedStringPart<Kind extends string> = {
    kind: 'text' | Kind;
    text: string;
};

type LocalizedStringSubstitution = string | number;

export const substituteLocalizedString = <
    Placeholders extends Record<string, string>,
>(
    message: { value: string; substitutions: Placeholders },
    substitutions: {
        [Name in keyof Placeholders]: LocalizedStringSubstitution;
    },
): string => {
    const { value, substitutions: placeholders } = message;
    const valuesByMarker = new Map<string, string>();
    for (const [name, marker] of Object.entries(placeholders)) {
        if (!marker) {
            throw new Error(`empty localized string placeholder: ${name}`);
        }
        if (valuesByMarker.has(marker)) {
            throw new Error(`duplicate localized string placeholder: ${marker}`);
        }

        const substitution = substitutions[name];
        if (substitution === undefined) {
            throw new Error(`missing localized string substitution: ${name}`);
        }
        valuesByMarker.set(marker, String(substitution));
    }

    if (valuesByMarker.size === 0) {
        return value;
    }

    const pattern = new RegExp(
        [...valuesByMarker.keys()]
            .sort((a, b) => b.length - a.length)
            .map(RegExp.escape)
            .join('|'),
        'g',
    );
    const seen = new Set<string>();
    const result = value.replace(pattern, marker => {
        seen.add(marker);
        return valuesByMarker.get(marker)!;
    });

    if (seen.size !== valuesByMarker.size) {
        throw new Error('localized string placeholders are missing');
    }

    return result;
};

export const parseLocalizedString = <
    Spans extends Record<string, LocalizedStringSpan>,
>(
    message: { value: string; spans: Spans },
): LocalizedStringPart<Extract<keyof Spans, string>>[] => {
    const { value, spans } = message;
    type Kind = Extract<keyof Spans, string>;
    const markers = new Map<string, { kind: Kind; begin: boolean }>();
    for (const [kind, span] of Object.entries(spans) as [Kind, LocalizedStringSpan][]) {
        if (!span.begin || !span.end || span.begin === span.end) {
            throw new Error(`invalid ${kind} placeholder pair`);
        }
        if (markers.has(span.begin) || markers.has(span.end)) {
            throw new Error('localized string placeholders must be unique');
        }

        markers.set(span.begin, { kind, begin: true });
        markers.set(span.end, { kind, begin: false });
    }

    if (markers.size === 0) {
        return value ? [{ kind: 'text', text: value }] : [];
    }

    const pattern = new RegExp(
        [...markers.keys()]
            .sort((a, b) => b.length - a.length)
            .map(RegExp.escape)
            .join('|'),
        'g',
    );
    const parts: LocalizedStringPart<Kind>[] = [];
    const seen = new Set<string>();
    let kind: 'text' | Kind = 'text';
    let cursor = 0;

    const pushPart = (text: string) => {
        if (text) {
            parts.push({ kind, text });
        }
    };

    for (const match of value.matchAll(pattern)) {
        const marker = markers.get(match[0])!;
        if (seen.has(match[0])) {
            throw new Error(`duplicate localized string placeholder: ${match[0]}`);
        }
        seen.add(match[0]);

        pushPart(value.slice(cursor, match.index));

        if (marker.begin && kind === 'text') {
            kind = marker.kind;
        } else if (!marker.begin && kind === marker.kind) {
            kind = 'text';
        } else {
            throw new Error(`unexpected localized string placeholder: ${match[0]}`);
        }

        cursor = match.index + match[0].length;
    }

    pushPart(value.slice(cursor));

    if (seen.size !== markers.size || kind !== 'text') {
        throw new Error('localized string placeholders are missing or unbalanced');
    }

    return parts;
};
