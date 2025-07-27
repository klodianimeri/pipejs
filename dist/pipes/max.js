import { Yield, negativeInfinity } from "../util/index.js";
export function max() {
    return () => {
        let max = negativeInfinity();
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                return max === negativeInfinity() ? result : [Yield(max), result];
            }
            else if (typeof result.value === 'number' && result.value > max) {
                max = result.value;
            }
        };
    };
}
//# sourceMappingURL=max.js.map