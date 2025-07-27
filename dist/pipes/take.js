import { Done, positiveInfinity } from "../util/index.js";
export function take(count) {
    count = (typeof count === "number" && count > 0) ? count : positiveInfinity();
    return () => {
        var i = -1;
        return (result) => {
            ++i;
            if (i >= count) {
                return Done();
            }
            return result;
        };
    };
}
//# sourceMappingURL=take.js.map