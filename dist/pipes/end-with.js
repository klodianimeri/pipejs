import { Yields, push } from "../util/index.js";
export function endWith(...elements) {
    return () => {
        return (result) => {
            if (result.done) {
                return push(Yields(elements), result);
            }
            else {
                return result;
            }
        };
    };
}
//# sourceMappingURL=end-with.js.map