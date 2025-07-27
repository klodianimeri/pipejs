import { assertSync } from "../util/index.js";
export function intersection(source) {
    assertSync(source);
    return () => {
        let sourceSet = source instanceof Set ? source : new Set(source);
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                return result;
            }
            if (sourceSet.has(result.value)) {
                sourceSet.delete(result.value);
                return result;
            }
        };
    };
}
//# sourceMappingURL=intersection.js.map