import { Yield } from "../util/index.js";
export function findLastIndex(predicate, fromIndex) {
    fromIndex = typeof fromIndex === 'number' ? fromIndex : 0;
    return () => {
        let i = -1;
        let lastIndex = -1;
        return (result) => {
            ++i;
            if (result === null || result === void 0 ? void 0 : result.done) {
                return [Yield(lastIndex), result];
            }
            else if (predicate(result.value)) {
                lastIndex = i;
            }
        };
    };
}
//# sourceMappingURL=find-last-index.js.map