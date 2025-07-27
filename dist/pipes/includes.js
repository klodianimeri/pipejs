import { Yield, Done } from "../util/index.js";
export function includes(value, fromIndex) {
    fromIndex = typeof fromIndex === 'number' ? fromIndex : 0;
    return () => {
        let i = -1;
        return (result) => {
            ++i;
            if (result === null || result === void 0 ? void 0 : result.done) {
                return [Yield(false), result];
            }
            else if (i >= fromIndex && result.value === value) {
                return [Yield(true), Done()];
            }
        };
    };
}
//# sourceMappingURL=includes.js.map