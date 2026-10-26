import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE, PipeResults, forward, forwardAnd } from "../pipe.js";

export function splice<I, T>(start: number, deleteCount: number, ...elements: Array<T>): Operator<I, I | T> {
    const s = (typeof start === 'number' && start >= 0) ? start : 0;
    const dc = (typeof deleteCount === 'number' && deleteCount >= 0) ? deleteCount : 0;

    return <NextOut = unknown>(next: Pipe<I | T, NextOut>): Pipe<I, NextOut> => {

        let i = -1;
        let spliced = false;

        const pushElementsToBatch = (batch: any[]) => {
            for (let j = 0; j < elements.length; j++) {
                const stepResult = next(elements[j]);
                if (Array.isArray(stepResult)) {
                    for (let k = 0; k < stepResult.length; k++) batch.push(stepResult[k]);
                } else {
                    batch.push(stepResult);
                }
            }
        };

        return (element: PipeArgument<I>): PipeResult<NextOut> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                if (!spliced) {
                    spliced = true;
                    const endBatch: any[] = [];
                    pushElementsToBatch(endBatch);

                    return forwardAnd(next, endBatch, DONE);

                }
                return next(element);
            }

            ++i;

            if (i < s) {
                return next(element as unknown as I | T);
            }

            if (i === s) {
                spliced = true;
                const batchResults: any[] = [];

                pushElementsToBatch(batchResults);

                if (dc === 0) {
                    const stepResult = next(element as unknown as I | T);

                    if (Array.isArray(stepResult)) {
                        for (const item of stepResult) {
                            batchResults.push(item);
                        }
                    }
                    else batchResults.push(stepResult);
                }

                return new PipeResults(batchResults).singleOrDefault();
            }

            if (i >= s + dc) {
                return next(element as unknown as I | T);
            }

            return BREAK;
        };
    };
}
