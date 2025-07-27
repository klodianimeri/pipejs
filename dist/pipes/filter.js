export function filter(predicate) {
    return () => {
        let i = -1;
        return (result) => {
            ++i;
            if (result === null || result === void 0 ? void 0 : result.done) {
                return result;
            }
            if (!predicate(result.value, i))
                return;
            return result;
        };
    };
}
//# sourceMappingURL=filter.js.map