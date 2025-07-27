import { Done } from "../util/index.js";
export function takeWhile(predicate, inclusive) {
    inclusive = typeof inclusive === 'boolean' ? inclusive : false;
    return () => {
        var i = -1;
        return (result) => {
            ++i;
            if (result === null || result === void 0 ? void 0 : result.done) {
                return result;
            }
            if (!predicate(result.value, i)) {
                if (inclusive) {
                    return [result, Done()];
                }
                return Done();
            }
            return result;
        };
    };
}
//# sourceMappingURL=take-while.js.map