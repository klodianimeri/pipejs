import { Yields, push } from "../util/index.js";
export function startWith(...elements) {
    return () => {
        let sent = false;
        return (result) => {
            if (!sent) {
                sent = true;
                return push(Yields(elements), result);
            }
            return result;
        };
    };
}
//# sourceMappingURL=start-with.js.map