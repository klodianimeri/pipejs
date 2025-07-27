export function entries() {
    return () => {
        let i = -1;
        return (result) => {
            ++i;
            if (!result.done && !Array.isArray(result.value)) {
                result.value = [i, result.value];
            }
            return result;
        };
    };
}
//# sourceMappingURL=entries.js.map