import { assertSync, Done, Yield } from "../util/index.js";
export function isSubsetOf(source) {
    assertSync(source);
    return () => {
        let sourceSet = source instanceof Set ? source : new Set(source);
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                return [Yield(true), result];
            }
            if (!sourceSet.has(result.value))
                return [Yield(false), Done()];
        };
    };
}
//# sourceMappingURL=is-subset-of.js.map