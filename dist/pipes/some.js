import { Yield, Done } from "../util/index.js";
export function some(predicate) {
    return () => {
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                return [Yield(false), result];
            }
            else if (predicate(result.value)) {
                return [Yield(true), Done()];
            }
        };
    };
}
//# sourceMappingURL=some.js.map