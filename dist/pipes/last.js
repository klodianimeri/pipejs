import { Yield } from "../util/index.js";
export function last() {
    return () => {
        let i = -1;
        let last;
        return (result) => {
            ++i;
            if (result === null || result === void 0 ? void 0 : result.done) {
                return i === 0 ? result : [Yield(last), result];
            }
            last = result.value;
        };
    };
}
//# sourceMappingURL=last.js.map