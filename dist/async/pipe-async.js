export async function* pipeAsync(source, ...pipes) {
    var _a;
    if (!source || typeof source[Symbol.asyncIterator] !== 'function') {
        throw new Error(`Source ${source} not an async iterator!`);
    }
    if (!Array.isArray(pipes) || pipes.length === 0) {
        yield* source;
        return;
    }
    let pipeIterators = new Array();
    for (const pipe of pipes) {
        pipeIterators.push(pipe());
    }
    let iterator = source[Symbol.asyncIterator]();
    let iteratorResult = await iterator.next();
    while (true) {
        let done = iteratorResult.done;
        let results = new Array(iteratorResult);
        for (let i = 0; i < pipeIterators.length; i++) {
            let allpipeResults = new Array();
            for (let j = 0; j < results.length; j++) {
                let piperesult = pipeIterators[i](results[j]);
                piperesult = Array.isArray(piperesult) ? piperesult : [piperesult];
                for (let e = 0; e < piperesult.length; e++) {
                    if (typeof piperesult[e] === 'undefined')
                        continue;
                    if (i < (pipes.length - 1)) {
                        allpipeResults.push(piperesult[e]);
                        continue;
                    }
                    if ((_a = piperesult[e]) === null || _a === void 0 ? void 0 : _a.done)
                        return;
                    if ('value' in piperesult[e])
                        yield piperesult[e].value;
                }
            }
            results = allpipeResults;
        }
        if (done)
            break;
        iteratorResult = await iterator.next();
    }
}
//# sourceMappingURL=pipe-async.js.map