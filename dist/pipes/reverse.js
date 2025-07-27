export function reverse() {
    return () => {
        let buffer = new Array();
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                return [...buffer, result];
            }
            buffer.unshift(result);
        };
    };
}
//# sourceMappingURL=reverse.js.map