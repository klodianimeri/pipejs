export function pop() {
    return () => {
        let last;
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                return result;
            }
            let lastResult = last;
            last = result;
            if (typeof last !== "undefined") {
                return lastResult;
            }
        };
    };
}
//# sourceMappingURL=pop.js.map