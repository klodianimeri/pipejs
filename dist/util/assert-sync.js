export const assertSync = (value) => {
    if (!value || typeof value[Symbol.iterator] !== 'function') {
        throw new Error(`Value not a sync iterator: ${value}`);
    }
};
//# sourceMappingURL=assert-sync.js.map