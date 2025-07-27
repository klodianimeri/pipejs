import { Yield, Done } from "../util/index.js";
export function findIndex(predicate, fromIndex) {
    fromIndex = typeof fromIndex === 'number' ? fromIndex : 0;
    return () => {
        let i = -1;
        return (result) => {
            ++i;
            if (result === null || result === void 0 ? void 0 : result.done) {
                return result;
            }
            else if (i >= fromIndex && predicate(result.value, i)) {
                return [Yield(i), Done()];
            }
        };
    };
}
//# sourceMappingURL=find-index.js.map