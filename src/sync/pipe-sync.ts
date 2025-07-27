import { Pipe, PipeIterator, PipeIteratorResult } from "../pipe.js";

export function* pipeSync(source: Iterable<any, any, unknown>, ...pipes: Array<Pipe>): Iterable<any, any, unknown> {
    if (!source || typeof source[Symbol.iterator] !== 'function') {
        throw new Error(`Source ${source} not a sync iterator!`);
    }

    if (!Array.isArray(pipes) || (pipes = pipes.filter(p => typeof p === 'function')).length === 0) {
        yield* source;
        return;
    }

    let pipeIterators: Array<PipeIterator> = new Array<PipeIterator>();

    for (const pipe of pipes) {
        pipeIterators.push(pipe());
    }

    let iterator = source[Symbol.iterator]();

    let iteratorResult: IteratorResult<any> = iterator.next();

    while (true) {

        let done: boolean | undefined = iteratorResult.done;

        let results: Array<IteratorResult<any>> = new Array<IteratorResult<any>>(iteratorResult);

        for (let i = 0; i < pipeIterators.length; i++) {
            let allpipeResults: Array<IteratorResult<any>> = new Array<IteratorResult<any>>();

            for (let j = 0; j < results.length; j++) {

                let piperesult: PipeIteratorResult = pipeIterators[i](results[j]);

                piperesult = Array.isArray(piperesult) ? piperesult : [piperesult];

                for (let e = 0; e < piperesult.length; e++) {
                    if (typeof piperesult[e] === 'undefined') continue;

                    if (i < (pipes.length - 1)) {
                        allpipeResults.push(piperesult[e]);
                        continue;
                    }

                    if ((piperesult[e] as IteratorResult<any, any>)?.done) return;

                    if (piperesult[e]?.hasOwnProperty('value')) yield (piperesult[e]).value;
                }
            }

            results = allpipeResults;
        }

        if (done) break;

        iteratorResult = iterator.next();
    }
}