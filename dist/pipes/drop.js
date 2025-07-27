export function drop(count) {
    count = typeof count === 'number' ? count : 0;
    return () => {
        let i = -1;
        return (result) => {
            ++i;
            if (result === null || result === void 0 ? void 0 : result.done)
                return result;
            if (i >= count) {
                return result;
            }
        };
    };
}
//# sourceMappingURL=drop.js.map