import { Yield } from "../util/yield.js";
export function size() {
    return () => {
        let i = -1;
        return (result) => {
            ++i;
            if (result === null || result === void 0 ? void 0 : result.done) {
                return [Yield(i), result];
            }
        };
    };
}
//# sourceMappingURL=size.js.map