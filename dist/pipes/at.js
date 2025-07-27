import { Done } from "../util/index.js";
export function at(index) {
    return () => {
        let i = -1;
        return (result) => {
            ++i;
            if (result === null || result === void 0 ? void 0 : result.done) {
                return result;
            }
            if (i === index) {
                return [result, Done()];
            }
        };
    };
}
//# sourceMappingURL=at.js.map