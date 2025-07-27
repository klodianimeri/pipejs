import { Yields } from "../util/index.js";
export function flat(depth) {
    depth = (typeof depth === 'number' && depth >= 1) ? depth : 1;
    return () => {
        return (result) => {
            if ((result === null || result === void 0 ? void 0 : result.done) || typeof result.value[Symbol.iterator] !== 'function') {
                return result;
            }
            return Yields(Array.from(result.value).flat(depth));
        };
    };
}
//# sourceMappingURL=flat.js.map