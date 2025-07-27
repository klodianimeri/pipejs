import { Yield, Done } from "../util/index.js";
export function every(predicate) {
    return () => {
        let i = -1;
        return (result) => {
            ++i;
            if (result === null || result === void 0 ? void 0 : result.done) {
                return [Yield(true), result];
            }
            else if (!predicate(result.value, i)) {
                return [Yield(false), Done()];
            }
        };
    };
}
//# sourceMappingURL=every.js.map