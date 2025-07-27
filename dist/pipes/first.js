import { Done } from "../util/index.js";
export function first() {
    return () => {
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                return result;
            }
            return [result, Done()];
        };
    };
}
//# sourceMappingURL=first.js.map