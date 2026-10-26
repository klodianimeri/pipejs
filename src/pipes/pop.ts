import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE } from "../pipe.js";

export function pop<I>(): Operator<I, I> {
    return <Next = unknown>(next: Pipe<I, Next>): Pipe<I, Next> => {
        let lastValue: I;
        let hasValue = false; // Safely tracks if we have an element in the buffer queue

        return (element: PipeArgument<I>): PipeResult<Next> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                return next(element);
            }

            const current = element as I;

            if (!hasValue) {
                lastValue = current;
                hasValue = true;
                return BREAK;
            }

            const valueToEmit = lastValue;
            lastValue = current;

            return next(valueToEmit);
        };
    };
}
