import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, IS_ASYNC_OPERATOR } from "../pipe.js";
import { isAsyncIterable, isIterable } from "../util/index.js";

export function zipWith<I, TZip, TResult = [I, TZip]>(other: Iterable<TZip>, resultSelector?: (sourceItem: I, zippedItem: TZip) => TResult): Operator<I, TResult> {

    return <NextOut = unknown>(next: Pipe<TResult, NextOut>): Pipe<I, NextOut> => {

        let otherIterator: Iterator<TZip> | null = null;
        let isTerminated = false;

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (isTerminated) {
                return next(DONE);
            }

            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                isTerminated = true;
                return next(DONE);
            }

            if (otherIterator === null) {
                if (other && isIterable(other)) {
                    otherIterator = other[Symbol.iterator]();
                } else {
                    isTerminated = true;
                    return next(DONE);
                }
            }

            const otherResult = otherIterator.next();

            if (otherResult.done) {
                isTerminated = true;
                return next(DONE);
            }

            const sourceItem = element as I;

            const combinedValue = resultSelector ? resultSelector(sourceItem, otherResult.value) : ([sourceItem, otherResult.value] as unknown as TResult);

            return next(combinedValue);
        };
    };
}

export function zipWithAsync<I, TZip, TResult = [I, TZip]>(other: AsyncIterable<TZip>, resultSelector?: (sourceItem: I, zippedItem: TZip) => TResult): Operator<I, TResult> {
    const op = <NextOut = unknown>(next: Pipe<TResult, NextOut>): Pipe<I, NextOut> => {
        let otherIterator: AsyncIterator<TZip> | null = null;
        let isTerminated = false;

        return async (element: PipeArgument<I>): Promise<PipeResult<NextOut>> => {
            if (isTerminated) {
                return next(DONE);
            }

            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                isTerminated = true;
                if (otherIterator?.return) {
                    try {
                        await otherIterator.return(undefined);
                    } catch {
                        /* ignore */
                    }
                }
                return next(DONE);
            }

            if (otherIterator === null) {
                if (isAsyncIterable(other)) {
                    otherIterator = other[Symbol.asyncIterator]();
                } else {
                    isTerminated = true;
                    return next(DONE);
                }
            }

            const otherResult = await otherIterator.next();

            if (otherResult.done) {
                isTerminated = true;
                return next(DONE);
            }

            const sourceItem = element as I;
            const combinedValue = resultSelector ? resultSelector(sourceItem, otherResult.value) : ([sourceItem, otherResult.value] as unknown as TResult);

            return next(combinedValue);
        };
    };

    (op as any)[IS_ASYNC_OPERATOR] = true;
    return op;
}