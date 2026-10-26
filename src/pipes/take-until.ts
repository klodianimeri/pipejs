import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, IS_ASYNC_OPERATOR } from "../pipe.js";

export function takeUntil<I>(notifier: () => Promise<any>): Operator<I, I> {

    const op = <NextOut = unknown>(next: Pipe<I, NextOut>): Pipe<I, NextOut> => {
        let take = true;
        let error: any;

        (async () => {
            try {
                await notifier();
                take = false;
            } catch (err) {
                error = err;
            }
        })();

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (error) throw error;
            if (element instanceof CONTINUE) return next(element);
            if (element === DONE) return next(DONE);

            if (!take) {
                return next(DONE);
            }

            return next(element);
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}