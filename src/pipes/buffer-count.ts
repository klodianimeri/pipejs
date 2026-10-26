import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    BREAK,
    CONTINUE,
    DONE,
    forwardAnd,
} from "../pipe.js";

export function bufferCount<I>(count: number, every?: number): Operator<I, I[]> {
    const c = typeof count === "number" && count >= 1 ? Math.floor(count) : 1;
    const e = typeof every === "number" && every >= 1 ? Math.floor(every) : c;

    return <NextOut = unknown>(next: Pipe<I[], NextOut>): Pipe<I, NextOut> => {
        let buffer: I[] = [];

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                if (buffer.length === 0) {
                    return next(DONE);
                }

                const rest: I[][] = [];
                while (buffer.length > 0) {
                    rest.push(buffer.slice());
                    buffer.splice(0, e);
                }
                return forwardAnd(next, rest, DONE);
            }

            buffer.push(element as I);

            if (buffer.length === c) {
                const chunk = buffer.slice();
                buffer.splice(0, e);
                return next(chunk);
            }

            return BREAK;
        };
    };
}