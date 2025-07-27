export function distinctUntilKeyChanged(key, comparator) {
    comparator = typeof comparator === 'function' ? comparator : (a, b) => a === b;
    return () => {
        let last;
        return (result) => {
            var _a;
            if ((result === null || result === void 0 ? void 0 : result.done) || !((_a = result.value) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(key)) || !(last === null || last === void 0 ? void 0 : last.hasOwnProperty(key)) || !comparator(result.value[key], last[key])) {
                last = result.value;
                return result;
            }
        };
    };
}
//# sourceMappingURL=distinct-until-key-changed.js.map