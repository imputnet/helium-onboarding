declare const chrome: {
    send(message: string, params?: unknown[]): void,
    getVariableValue(variable: string): string,
};
