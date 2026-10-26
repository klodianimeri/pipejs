import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, BREAK, IS_ASYNC_OPERATOR } from "../pipe.js";

export function delayEach<T = unknown>(ms: number): Operator<T, T> {
    const op = <NextOut = unknown>(next: Pipe<T, NextOut>): Pipe<T, NextOut> => {
        return async (element: PipeArgument<T>): Promise<PipeResult<NextOut>> => {
            if (element instanceof CONTINUE || element === DONE || element === BREAK) {
                return next(element as any);
            }

            await new Promise(resolve => setTimeout(resolve, ms));

            return next(element as any);
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;

    return op;
}