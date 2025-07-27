import { negativeInfinity } from "../util/index.js";
export function skipLast(count) {
    count = (typeof count === "number" && count > 0) ? count : negativeInfinity();
    return () => {
        let items = new Array();
        return (result) => {
            items.push(result);
            if (result.done) {
                return result;
            }
            else if (items.length > count) {
                return items.shift();
            }
        };
    };
}
//# sourceMappingURL=skip-last.js.map