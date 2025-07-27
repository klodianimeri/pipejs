export function keys() {
    return () => {
        let i = -1;
        return (result) => {
            ++i;
            if (!(result === null || result === void 0 ? void 0 : result.done)) {
                if (Array.isArray(result.value) && result.value.length == 2) {
                    result.value = result.value[0];
                }
                else {
                    result.value = i;
                }
            }
            return result;
        };
    };
}
//# sourceMappingURL=keys.js.map