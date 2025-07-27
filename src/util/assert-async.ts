export const assertAsync = (value?: AsyncIterable<any, any, unknown>) => {
    if (!value || typeof value[Symbol.asyncIterator] !== 'function') {
        throw new Error(`Value not an async iterator: ${value}`);
    }
};