import { Yield } from "../util/index.js";
export function defaultIfEmpty(value) {
    return () => {
        let isempty = true;
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                if (isempty) {
                    return [Yield(value), result];
                }
            }
            else {
                isempty = false;
            }
            return result;
        };
    };
}
//# sourceMappingURL=default-if-empty.js.map