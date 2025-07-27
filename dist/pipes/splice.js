import { Yields } from "../util/yields.js";
export function splice(start, deleteCount, ...elements) {
    start = (typeof start === 'number' && start >= 0) ? start : 0;
    deleteCount = (typeof deleteCount === 'number' && deleteCount >= 0) ? deleteCount : 0;
    return () => {
        let i = -1;
        return (result) => {
            ++i;
            if (i < start || i >= (start + deleteCount)) {
                return result;
            }
            else if (i === start && Array.isArray(elements)) {
                return Yields(elements);
            }
        };
    };
}
//# sourceMappingURL=splice.js.map