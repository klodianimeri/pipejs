import { Operator, Pipe, PipeArgument, PipeResult, CONTINUE, DONE, PipeResults } from "../pipe.js";

export function repeat<I>(count?: number): Operator<I, I> {
    const repeatCount = (typeof count === 'number' && count > 0) ? count : 1;

    return <Next = unknown>(next: Pipe<I, Next>): Pipe<I, Next> => {
        const buffer: I[] = [];

        return (element: PipeArgument<I>): PipeResult<Next> => {
            if (element instanceof CONTINUE) return next(element);

            if (element === DONE) {
                if (repeatCount <= 1) {
                    return next(element);
                }

                //UNWRAP forward for performance reasons
                let results = new PipeResults<Next>();

                const bufferLen = buffer.length;

                for (let r = 0; r < repeatCount - 1; r++) {
                    for (let i = 0; i < bufferLen; i++) {
                        results.push(next(buffer[i]));
                    }
                }

                results.push(next(DONE));

                return results.singleOrDefault();
            }

            const value = element as I;
            buffer.push(value);

            return next(element);
        };
    };
}
