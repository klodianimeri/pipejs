export function map(callbackFn) {
    callbackFn = typeof callbackFn === 'function' ? callbackFn : (e) => e;
    return () => {
        let i = -1;
        return (result) => {
            ++i;
            if (result === null || result === void 0 ? void 0 : result.done) {
                return result;
            }
            result.value = callbackFn(result.value, i);
            return result;
        };
    };
}
//# sourceMappingURL=map.js.map