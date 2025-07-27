import { Yield, positiveInfinity } from "../util/index.js";
export function min() {
    return () => {
        let min = positiveInfinity();
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                return min === positiveInfinity() ? result : [Yield(min), result];
            }
            else if (typeof result.value === 'number' && result.value < min) {
                min = result.value;
            }
        };
    };
}
//# sourceMappingURL=min.js.map