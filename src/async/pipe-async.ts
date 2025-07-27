import { Pipe, PipeIterator, PipeIteratorResult } from "../pipe.js";

export async function* pipeAsync(source: AsyncIterable<any, any, unknown>, ...pipes: Array<Pipe>): AsyncIterable<any, any, unknown> {
    if (!source || typeof source[Symbol.asyncIterator] !== 'function') {
        throw new Error(`Source ${source} not an async iterator!`);
    }

    if (!Array.isArray(pipes) || pipes.length === 0) {
        yield* source;
        return;
    }

    let pipeIterators: Array<PipeIterator> = new Array<PipeIterator>();

    for (const pipe of pipes) {
        pipeIterators.push(pipe());
    }

    let iterator = source[Symbol.asyncIterator]();

    let iteratorResult: IteratorResult<any> = await iterator.next();

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
                        allpipeResults.push(piperesult[e] as IteratorResult<any, any>);
                        continue;
                    }

                    if ((piperesult[e] as IteratorResult<any, any>)?.done) return;

                    if ('value' in piperesult[e]) yield (piperesult[e] as IteratorResult<any, any>).value;
                }
            }

            results = allpipeResults;
        }

        if (done) break;

        iteratorResult = await iterator.next();
    }
}
