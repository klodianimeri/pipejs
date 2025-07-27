import { Done } from "../util/done.js";
export function slice(start, end) {
    start = (typeof start === 'number' && start >= 0) ? start : 0;
    end = (typeof end === 'number' && end > start) ? end : Infinity;
    return () => {
        let i = -1;
        return (result) => {
            ++i;
            if (result === null || result === void 0 ? void 0 : result.done) {
                return result;
            }
            if (i >= start && i < end) {
                return result;
            }
            else if (i === end) {
                return Done();
            }
        };
    };
}
//# sourceMappingURL=slice.js.map