import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, BREAK, IS_ASYNC_OPERATOR } from "../pipe.js";

export function skipUntil<I>(notifier: () => Promise<any>): Operator<I, I> {
    const op = <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        let skip = true;
        let error: any;

        (async () => {
            try {
                await notifier();
                skip = false;
            } catch (err) {
                error = err;
            }
        })();

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (error) {
                throw error;
            }

            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) return next(DONE);

            if (skip) {
                return BREAK;
            }

            return next(element);
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}
