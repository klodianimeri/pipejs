import { Done, Yield } from "../util/index.js";
export function indexOf(value, fromIndex) {
    fromIndex = typeof fromIndex === 'number' ? fromIndex : 0;
    return () => {
        let i = -1;
        return (result) => {
            ++i;
            if (result === null || result === void 0 ? void 0 : result.done) {
                return [Yield(-1), result];
            }
            else if (i >= fromIndex && value === result.value) {
                return [Yield(i), Done()];
            }
        };
    };
}
//# sourceMappingURL=index-of.js.map