import { Done } from "../util/index.js";
export function find(predicate) {
    return () => {
        let i = -1;
        return (result) => {
            ++i;
            if (result === null || result === void 0 ? void 0 : result.done) {
                return result;
            }
            if (predicate(result.value, i)) {
                return [result, Done()];
            }
        };
    };
}
//# sourceMappingURL=find.js.map