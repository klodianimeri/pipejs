import { Yield } from "../util/index.js";
export function findLast(predicate) {
    return () => {
        let i = -1;
        let last;
        return (result) => {
            ++i;
            if (result === null || result === void 0 ? void 0 : result.done) {
                return typeof last === 'undefined' ? result : [Yield(last), result];
            }
            if (predicate(result.value, i)) {
                last = result.value;
            }
        };
    };
}
//# sourceMappingURL=find-last.js.map