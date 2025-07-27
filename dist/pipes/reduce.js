import { Yield } from "../util/index.js";
export function reduce(accumulator, initialValue) {
    return () => {
        let i = -1;
        let value;
        return (result) => {
            ++i;
            if (i === 0) {
                value = initialValue !== null && initialValue !== void 0 ? initialValue : result.value;
            }
            if (result === null || result === void 0 ? void 0 : result.done) {
                return [Yield(value), result];
            }
            value = accumulator(value, result.value, i);
        };
    };
}
//# sourceMappingURL=reduce.js.map