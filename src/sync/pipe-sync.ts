import { Pipe, PipeIterator, PipeIteratorResult } from "../pipe.js";

export function pipeSync<TSource, T1>(
    source: Iterable<TSource>
): Iterable<TSource>;

export function pipeSync<TSource, T1>(
    source: Iterable<TSource>,
    p1: Pipe<TSource, T1>
): Iterable<T1>;

export function pipeSync<TSource, T1, T2>(
    source: Iterable<TSource>,
    p1: Pipe<TSource, T1>,
    p2: Pipe<T1, T2>
): Iterable<T2>;

export function pipeSync<TSource, T1, T2, T3>(
    source: Iterable<TSource>,
    p1: Pipe<TSource, T1>,
    p2: Pipe<T1, T2>,
    p3: Pipe<T2, T3>
): Iterable<T3>;

export function pipeSync<TSource, T1, T2, T3, T4>(
    source: Iterable<TSource>,
    p1: Pipe<TSource, T1>,
    p2: Pipe<T1, T2>,
    p3: Pipe<T2, T3>,
    p4: Pipe<T3, T4>
): Iterable<T4>;

export function pipeSync<TSource, T1, T2, T3, T4, T5>(
    source: Iterable<TSource>,
    p1: Pipe<TSource, T1>,
    p2: Pipe<T1, T2>,
    p3: Pipe<T2, T3>,
    p4: Pipe<T3, T4>,
    p5: Pipe<T4, T5>
): Iterable<T5>;

export function pipeSync<TSource, T1, T2, T3, T4, T5, T6>(
    source: Iterable<TSource>,
    p1: Pipe<TSource, T1>,
    p2: Pipe<T1, T2>,
    p3: Pipe<T2, T3>,
    p4: Pipe<T3, T4>,
    p5: Pipe<T4, T5>,
    p6: Pipe<T5, T6>
): Iterable<T6>;

export function pipeSync<TSource, T1, T2, T3, T4, T5, T6, T7>(
    source: Iterable<TSource>,
    p1: Pipe<TSource, T1>,
    p2: Pipe<T1, T2>,
    p3: Pipe<T2, T3>,
    p4: Pipe<T3, T4>,
    p5: Pipe<T4, T5>,
    p6: Pipe<T5, T6>,
    p7: Pipe<T6, T7>
): Iterable<T7>;

export function pipeSync<TSource, T1, T2, T3, T4, T5, T6, T7, T8>(
    source: Iterable<TSource>,
    p1: Pipe<TSource, T1>,
    p2: Pipe<T1, T2>,
    p3: Pipe<T2, T3>,
    p4: Pipe<T3, T4>,
    p5: Pipe<T4, T5>,
    p6: Pipe<T5, T6>,
    p7: Pipe<T6, T7>,
    p8: Pipe<T7, T8>
): Iterable<T8>;

export function pipeSync<TSource, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    source: Iterable<TSource>,
    p1: Pipe<TSource, T1>,
    p2: Pipe<T1, T2>,
    p3: Pipe<T2, T3>,
    p4: Pipe<T3, T4>,
    p5: Pipe<T4, T5>,
    p6: Pipe<T5, T6>,
    p7: Pipe<T6, T7>,
    p8: Pipe<T7, T8>,
    p9: Pipe<T8, T9>
): Iterable<T9>;

export function pipeSync<TSource, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
    source: Iterable<TSource>,
    p1: Pipe<TSource, T1>,
    p2: Pipe<T1, T2>,
    p3: Pipe<T2, T3>,
    p4: Pipe<T3, T4>,
    p5: Pipe<T4, T5>,
    p6: Pipe<T5, T6>,
    p7: Pipe<T6, T7>,
    p8: Pipe<T7, T8>,
    p9: Pipe<T8, T9>,
    p10: Pipe<T9, T10>
): Iterable<T10>;

export function pipeSync(
    source: Iterable<any>,
    ...pipes: Array<Pipe<any, any>>
): Iterable<any>;

export function* pipeSync(source: Iterable<any>, ...pipes: Array<Pipe>): Iterable<any> {
    if (!source || typeof source[Symbol.iterator] !== 'function') {
        throw new Error(`Source ${source} not a sync iterator!`);
    }

    if (!Array.isArray(pipes) || (pipes = pipes.filter(p => typeof p === 'function')).length === 0) {
        yield* source;
        return;
    }

    const pipeIterators: Array<PipeIterator> = new Array<PipeIterator>();

    for (const pipe of pipes) {
        pipeIterators.push(pipe());
    }

    const length = pipeIterators.length;

    const iterator = source[Symbol.iterator]();

    let iteratorResult: IteratorResult<any> = iterator.next();

    while (true) {

        let done: boolean | undefined = iteratorResult.done;

        let results: Array<IteratorResult<any>> = new Array<IteratorResult<any>>(iteratorResult);

        for (let i = 0; i < length; i++) {
            const allpipeResults: Array<IteratorResult<any>> = new Array<IteratorResult<any>>();
            const isLastPipe: boolean = i === pipes.length - 1;

            for (let j = 0; j < results.length; j++) {
                const piperesult: PipeIteratorResult = pipeIterators[i](results[j]);

                if (piperesult === undefined) continue;

                if (Array.isArray(piperesult)) {
                    for (let e = 0; e < piperesult.length; e++) {
                        const item: IteratorResult<any> = piperesult[e];

                        if (item === undefined) continue;

                        if (!isLastPipe) {
                            allpipeResults.push(item);
                        } else {
                            if (item.done) return;
                            if ('value' in item) yield item.value;
                        }
                    }
                } else if (!isLastPipe) {
                    allpipeResults.push(piperesult);
                } else {
                    if (piperesult.done) return;
                    if ('value' in piperesult) yield piperesult.value;
                }
            }
            results = allpipeResults;
        }

        if (done) break;

        iteratorResult = iterator.next();
    }
}

// export function* pipeSync(source: Iterable<any>, ...pipes: Array<Pipe>): Iterable<any> {
//     if (!source || typeof source[Symbol.iterator] !== 'function') {
//         throw new Error(`Source ${source} not a sync iterator!`);
//     }

//     if (!Array.isArray(pipes) || (pipes = pipes.filter(p => typeof p === 'function')).length === 0) {
//         yield* source;
//         return;
//     }

//     const pipeIterators: Array<PipeIterator> = new Array<PipeIterator>();

//     for (const pipe of pipes) {
//         pipeIterators.push(pipe());
//     }

//     const all = [];

//     const length = pipeIterators.length;

//     const iterator = source[Symbol.iterator]();

//     let iteratorResult: IteratorResult<any> = iterator.next();

//     while (true) {

//         let done: boolean | undefined = iteratorResult.done;

//         let results: Array<IteratorResult<any>> = new Array<IteratorResult<any>>(iteratorResult);

//         for (let i = 0; i < length; i++) {
//             const allpipeResults: Array<IteratorResult<any>> = new Array<IteratorResult<any>>();
//             const isLastPipe: boolean = i === pipes.length - 1;

//             for (let j = 0; j < results.length; j++) {
//                 const piperesult: PipeIteratorResult = pipeIterators[i](results[j]);

//                 if (piperesult === undefined) continue;

//                 if (Array.isArray(piperesult)) {
//                     for (let e = 0; e < piperesult.length; e++) {
//                         const item: IteratorResult<any> = piperesult[e];

//                         if (item === undefined) continue;

//                         if (!isLastPipe) {
//                             allpipeResults.push(item);
//                         } else {
//                             if (item.done) break;
//                             if ('value' in item) all.push(item.value);
//                         }
//                     }
//                 } else if (!isLastPipe) {
//                     allpipeResults.push(piperesult);
//                 } else {
//                     if (piperesult.done) break;
//                     if ('value' in piperesult) all.push(piperesult.value);
//                 }
//             }
//             results = allpipeResults;
//         }

//         if (done) break;

//         iteratorResult = iterator.next();
//     }

//     yield* all;
// }

// export function* pipeSync(source: Iterable<any>, ...pipes: Array<Pipe>): Iterable<any> {
//     if (!source || typeof source[Symbol.iterator] !== 'function') {
//         throw new Error(`Source ${source} not a sync iterator!`);
//     }

//     const filteredPipes = Array.isArray(pipes) ? pipes.filter(p => typeof p === 'function') : [];

//     if (filteredPipes.length === 0) {
//         yield* source;
//         return;
//     }

//     const pipeIterators = filteredPipes.map(pipe => pipe());
//     const all: Array<any> = [];

//     // Using for...of replaces the manual 'while(true)' and 'iterator.next()'
//     for (const value of source) {
//         let results: Array<IteratorResult<any>> = [{ value, done: false }];

//         for (let i = 0; i < pipeIterators.length; i++) {
//             const allpipeResults: Array<IteratorResult<any>> = [];
//             const isLastPipe = i === pipeIterators.length - 1;

//             for (const res of results) {
//                 const piperesult = pipeIterators[i](res);

//                 if (piperesult === undefined) continue;

//                 const items = Array.isArray(piperesult) ? piperesult : [piperesult];

//                 for (const item of items) {
//                     if (item === undefined) continue;

//                     if (item.done) {
//                         // Yield everything collected so far and terminate
//                         for (const element of all) yield element;
//                         return;
//                     }

//                     if (isLastPipe) {
//                         if ('value' in item) all.push(item.value);
//                     } else {
//                         allpipeResults.push(item);
//                     }
//                 }
//             }
//             results = allpipeResults;
//         }
//     }

//     // Final yield of all collected items once source is exhausted
//     for (const element of all) {
//         yield element;
//     }
// }
