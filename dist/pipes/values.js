export function values() {
    return () => {
        return (result) => {
            if (!result.done) {
                if (Array.isArray(result.value) && result.value.length == 2)
                    result.value = result.value[1];
            }
            return result;
        };
    };
}
//# sourceMappingURL=values.js.map