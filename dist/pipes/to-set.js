import { Yield } from "../util/index.js";
export function toSet() {
    return () => {
        let buffer = new Set();
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                return [Yield(buffer), result];
            }
            buffer.add(result.value);
        };
    };
}
//# sourceMappingURL=to-set.js.map