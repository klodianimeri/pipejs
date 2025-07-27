import { Done, Yield } from "../util/index.js";
export function isEmpty() {
    return () => {
        return (result) => {
            return (result === null || result === void 0 ? void 0 : result.done) ? [Yield(true), result] : [Yield(false), Done()];
        };
    };
}
//# sourceMappingURL=is-empty.js.map