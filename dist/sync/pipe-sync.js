export function* pipeSync(source, ...pipes) {
    var _a, _b;
    if (!source || typeof source[Symbol.iterator] !== 'function') {
        throw new Error(`Source ${source} not a sync iterator!`);
    }
    if (!Array.isArray(pipes) || (pipes = pipes.filter(p => typeof p === 'function')).length === 0) {
        yield* source;
        return;
    }
    let pipeIterators = new Array();
    for (const pipe of pipes) {
        pipeIterators.push(pipe());
    }
    let iterator = source[Symbol.iterator]();
    let iteratorResult = iterator.next();
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
                    if ((_b = piperesult[e]) === null || _b === void 0 ? void 0 : _b.hasOwnProperty('value'))
                        yield (piperesult[e]).value;
                }
            }
            results = allpipeResults;
        }
        if (done)
            break;
        iteratorResult = iterator.next();
    }
}
//# sourceMappingURL=pipe-sync.js.map