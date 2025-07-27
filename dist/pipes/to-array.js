import { Yield } from "../util/index.js";
export function toArray() {
    return () => {
        let buffer = new Array();
        var i = -1;
        return (result) => {
            ++i;
            if (result === null || result === void 0 ? void 0 : result.done) {
                return [Yield(buffer), result];
            }
            buffer.push(result.value);
        };
    };
}
//# sourceMappingURL=to-array.js.map