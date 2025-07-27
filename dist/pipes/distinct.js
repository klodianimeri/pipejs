export function distinct(keyselector) {
    keyselector = typeof keyselector === 'function' ? keyselector : (e) => e;
    return () => {
        let elements = new Set();
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                return result;
            }
            if (!elements.has(keyselector(result.value))) {
                elements.add(keyselector(result.value));
                return result;
            }
        };
    };
}
//# sourceMappingURL=distinct.js.map