import { Yields, push, positiveInfinity } from "../util/index.js";
export function takeLast(count) {
    count = (typeof count === "number" && count > 0) ? count : positiveInfinity();
    return () => {
        let last = new Array();
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                return push(Yields(last), result);
            }
            if (last.length === count) {
                last.shift();
            }
            last.push(result.value);
        };
    };
}
//# sourceMappingURL=take-last.js.map