import { Yield } from "../util/index.js";
export function average() {
    return () => {
        let count = 0;
        let sum = 0;
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                return count === 0 ? result : [Yield(sum / count), result];
            }
            if (typeof result.value === 'number') {
                ++count;
                sum += result.value;
            }
        };
    };
}
//# sourceMappingURL=average.js.map