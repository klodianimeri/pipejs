import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE, forwardAnd } from "../pipe.js";

export function reverse<I>(): Operator<I, I> {
    return <Next = unknown>(next: Pipe<I, Next>): Pipe<I, Next> => {
        const buffer: I[] = [];

        return (element: PipeArgument<I>): PipeResult<Next> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                buffer.reverse();

                return forwardAnd(next, buffer, DONE);
            }

            buffer.push(element as I);

            return BREAK;
        };
    };
}
