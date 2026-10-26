import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, BREAK, DONE, done } from "../pipe.js";

export function size<I>(): Operator<I, number> {
    return <Next = unknown>(next: Pipe<number, Next>): Pipe<I, Next> => {

        let i = 0;

        return (element: PipeArgument<I>): PipeResult<Next> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                return done(next, i);
            }

            i++;

            return BREAK;
        };
    };
}
