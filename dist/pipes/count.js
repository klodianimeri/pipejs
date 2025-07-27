import { Yield } from "../util/index.js";
export function count() {
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
//# sourceMappingURL=count.js.map