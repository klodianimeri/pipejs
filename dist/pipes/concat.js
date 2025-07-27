import { assertSync, push, Yields } from "../util/index.js";
export function concat(source) {
    assertSync(source);
    return () => {
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                return push(Yields(Array.from(source)), result);
            }
            return result;
        };
    };
}
//# sourceMappingURL=concat.js.map