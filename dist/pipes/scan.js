export function scan(accumulator, initialValue) {
    return () => {
        let i = -1;
        let value;
        return (result) => {
            ++i;
            if (i === 0) {
                value = initialValue !== null && initialValue !== void 0 ? initialValue : result.value;
            }
            if (!(result === null || result === void 0 ? void 0 : result.done)) {
                result.value = value = accumulator(value, result.value, i);
            }
            return result;
        };
    };
}
//# sourceMappingURL=scan.js.map