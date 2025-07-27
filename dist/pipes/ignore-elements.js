export function ignoreElements() {
    return () => {
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                return result;
            }
        };
    };
}
//# sourceMappingURL=ignore-elements.js.map