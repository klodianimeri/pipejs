import { assertSync } from "../util/index.js";
export function difference(source) {
    assertSync(source);
    return () => {
        let sourceSet = source instanceof Set ? source : new Set(source);
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                return result;
            }
            if (!sourceSet.has(result.value)) {
                sourceSet.add(result.value);
                return result;
            }
        };
    };
}
//# sourceMappingURL=difference.js.map