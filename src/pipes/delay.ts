import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, BREAK, IS_ASYNC_OPERATOR } from "../pipe.js";

export function delay<T = unknown>(ms: number): Operator<T, T> {
    const op = <NextOut = unknown>(next: Pipe<T, NextOut>): Pipe<T, NextOut> => {
        let delayed: boolean = false;
        return async (element: PipeArgument<T>): Promise<PipeResult<NextOut>> => {
            if (!delayed) {
                await new Promise(resolve => setTimeout(resolve, ms));
                delayed = true;
            }

            if (element instanceof CONTINUE || element === DONE || element === BREAK) {
                return next(element as any);
            }

            return next(element as any);
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}