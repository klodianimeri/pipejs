export const assertSync = (value?: Iterable<any, any, unknown>) => {
    if (!value || typeof value[Symbol.iterator] !== 'function') {
        throw new Error(`Value not a sync iterator: ${value}`);
    }
};