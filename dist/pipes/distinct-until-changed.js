export function distinctUntilChanged(comparator) {
    comparator = typeof comparator === 'function' ? comparator : (a, b) => a === b;
    return () => {
        let last;
        return (result) => {
            if ((result === null || result === void 0 ? void 0 : result.done) || !comparator(result.value, last)) {
                last = result.value;
                return result;
            }
        };
    };
}
//# sourceMappingURL=distinct-until-changed.js.map