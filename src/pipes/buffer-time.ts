import {
    Operator,
    Pipe,
    PipeArgument,
    PipeResult,
    CONTINUE,
    DONE,
    BREAK,
    done,
    IS_ASYNC_OPERATOR,
} from "../pipe.js";

export function bufferTime<I = unknown>(interval: number): Operator<I, I[]> {
    const op = <NextOut = unknown>(next: Pipe<I[], NextOut>): Pipe<I, NextOut> => {
        let buffer: Array<I> = new Array<I>();
        let previousTime: number | undefined;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                if (buffer.length > 0) {
                    return done(next, buffer.splice(0, buffer.length))
                }

                return next(DONE);
            }

            const now = Date.now();
            buffer.push(element as I);

            if (!previousTime) {
                previousTime = now;
            }

            if (previousTime && (now - previousTime) >= interval) {
                previousTime = now;
                return next(buffer.splice(0, buffer.length));
            }

            return BREAK;
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}