import { assertSync, Yield } from "../util/index.js";
export function isSupersetOf(source) {
    assertSync(source);
    return () => {
        let sourceSet = source instanceof Set ? source : new Set(source);
        let found = 0;
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                return found === sourceSet.size ? [Yield(true), result] : [Yield(false), result];
            }
            if (sourceSet.has(result.value)) {
                ++found;
            }
        };
    };
}
//# sourceMappingURL=is-superset-of.js.map