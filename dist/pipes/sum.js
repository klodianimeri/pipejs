import { Yield } from "../util/index.js";
export function sum() {
    return () => {
        let sum = 0;
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                return [Yield(sum), result];
            }
            if (typeof result.value === 'number') {
                sum += result.value;
            }
        };
    };
}
//# sourceMappingURL=sum.js.map