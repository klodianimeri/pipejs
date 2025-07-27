import { Yield } from "../util/index.js";
export function bufferCount(count, every) {
    return () => {
        let buffer = new Array();
        count = (typeof count === 'number' && count > 1) ? count : 1;
        every = (typeof every === 'number' && every > 1) ? every : count;
        return (result) => {
            if (result === null || result === void 0 ? void 0 : result.done) {
                return buffer.length > 0 ? [Yield(buffer), result] : result;
            }
            buffer.push(result.value);
            if (buffer.length === count) {
                result.value = new Array(...buffer);
                for (let i = 0; i < every; i++) {
                    buffer.shift();
                }
                return result;
            }
        };
    };
}
//# sourceMappingURL=buffer-count.js.map