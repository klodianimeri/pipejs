export const assertAsync = (value) => {
    if (!value || typeof value[Symbol.asyncIterator] !== 'function') {
        throw new Error(`Value not an async iterator: ${value}`);
    }
};
//# sourceMappingURL=assert-async.js.map