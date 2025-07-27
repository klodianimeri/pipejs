import { positiveInfinity } from "../util/index.js";
export function fill(value, start, end) {
    start = typeof start === 'number' ? start : 0;
    end = typeof end === 'number' ? end : positiveInfinity();
    return () => {
        let i = -1;
        return (result) => {
            ++i;
            if (!(result === null || result === void 0 ? void 0 : result.done) && i >= start && i < end) {
                result.value = value;
            }
            return result;
        };
    };
}
//# sourceMappingURL=fill.js.map