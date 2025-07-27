import { assertSync, push, Yields } from "../util/index.js";
export function union(source) {
    assertSync(source);
    return () => {
        let exists = new Set();
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                let results = new Array();
                for (const item of source) {
                    if (!exists.has(item)) {
                        exists.add(item);
                        results.push(item);
                    }
                }
                return push(Yields(results), result);
            }
            if (!exists.has(result.value)) {
                exists.add(result.value);
                return result;
            }
        };
    };
}
//# sourceMappingURL=union.js.map