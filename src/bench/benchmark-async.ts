// import * as Ix from "ix/asynciterable";
// import * as IxOps from "ix/asynciterable/operators";

// import { pipeAsync } from "../async/pipe-async.js";
// import * as Ops from "../pipes/index.js";

// const DATA_SIZE = 500_000;

// async function* source(count = DATA_SIZE): AsyncIterable<number> {
//     for (let i = 0; i < count; i++) yield i;
// }

// function* sourceSync(count = DATA_SIZE) {
//     for (let i = 0; i < count; i++) yield i;
// }


// const inc = (x: number) => x + 1;
// const isEven = (x: number) => x % 2 === 0;
// const sumFn = (acc: number, x: number) => acc + x;

// let i: number = 0;

// async function runScenario(name: string, pipeline: () => AsyncIterable<any>, dosum: boolean = true) {
//     if (i % 2 === 0) console.log(`-`.repeat(111));
//     const start = performance.now();
//     let count = 0;
//     let sum = 0;
//     for await (const value of pipeline()) {
//         count++;
//         if (dosum) sum += value;
//     }
//     const end = performance.now();
//     console.log(`${name.padEnd(45)} | ${count.toLocaleString().padStart(10)} items | ${(end - start).toFixed(2).padStart(8)}ms | ${sum.toLocaleString().padStart(30)}`);
//     i++;
// }

// async function runBenchmark() {
//     i = 0;
//     console.log(`await  PipeJS (${DATA_SIZE.toLocaleString()} items)`);
//     // console.log(`-`.repeat(55);


//     await runScenario("pipejs  map → filter", () => pipeAsync(source(), Ops.map(inc), Ops.filter(isEven)));
//     await runScenario("IxJS  map → filter", () => Ix.from(source()).pipe(IxOps.map(inc), IxOps.filter(isEven)));


//     await runScenario("pipejs  skip(1000) → take(5000)", () => pipeAsync(source(), Ops.skip(1000), Ops.take(5000)));
//     await runScenario("IxJS  skip(1000) → take(5000)", () => Ix.from(source()).pipe(IxOps.skip(1000), IxOps.take(5000)));


//     await runScenario("pipejs map", () => pipeAsync(source(), Ops.map(inc)));
//     await runScenario("IxJS map", () => Ix.from(source()).pipe(IxOps.map(inc)));

//     await runScenario("pipejs filter", () => pipeAsync(source(), Ops.filter(isEven)));
//     await runScenario("IxJS filter", () => Ix.from(source()).pipe(IxOps.filter(isEven)));

//     await runScenario("pipejs take", () => pipeAsync(source(), Ops.take(1000)));
//     await runScenario("IxJS take", () => Ix.from(source()).pipe(IxOps.take(1000)));


//     await runScenario("pipejs skip", () => pipeAsync(source(), Ops.skip(1000)));
//     await runScenario("IxJS skip", () => Ix.from(source()).pipe(IxOps.skip(1000)));



//     await runScenario("pipejs takeLast", () => pipeAsync(source(), Ops.takeLast(100)));
//     await runScenario("IxJS takeLast", () => Ix.from(source()).pipe(IxOps.takeLast(100)));

//     await runScenario("pipejs skipLast", () => pipeAsync(source(), Ops.skipLast(100)));
//     await runScenario("IxJS skipLast", () => Ix.from(source()).pipe(IxOps.skipLast(100)));

//     await runScenario("pipejs takeWhile", () => pipeAsync(source(), Ops.takeWhile(x => x < 1000)));
//     await runScenario("IxJS takeWhile", () => Ix.from(source()).pipe(IxOps.takeWhile(x => x < 1000)));

//     await runScenario("pipejs skipWhile", () => pipeAsync(source(), Ops.skipWhile(x => x < 1000)));
//     await runScenario("IxJS skipWhile", () => Ix.from(source()).pipe(IxOps.skipWhile(x => x < 1000)));

//     await runScenario("pipejs scan", () => pipeAsync(source(), Ops.scan(sumFn, 0)));
//     await runScenario("IxJS scan", () => Ix.from(source()).pipe(IxOps.scan({ callback: sumFn, seed: 0 })));


//     await runScenario("pipejs scanRight", () => pipeAsync(source(2000), Ops.reverse(), Ops.scan(sumFn, 0)));
//     await runScenario("IxJS scanRight", () => Ix.from(source(2000)).pipe(IxOps.reverse(), IxOps.scan({ callback: sumFn, seed: 0 })));

//     await runScenario("pipejs distinct", () => pipeAsync(source(1000), Ops.distinct()));
//     await runScenario("IxJS distinct", () => Ix.from(source(1000)).pipe(IxOps.distinct()));

//     await runScenario("pipejs distinctUntilChanged", () => pipeAsync(source(), Ops.distinctUntilChanged()));
//     await runScenario("IxJS distinctUntilChanged", () => Ix.from(source()).pipe(IxOps.distinctUntilChanged()));

//     await runScenario("pipejs startWith", () => pipeAsync(source(), Ops.startWith(-1, -2)));
//     await runScenario("IxJS startWith", () => Ix.from(source()).pipe(IxOps.startWith(-1, -2)));

//     await runScenario("pipejs endWith", () => pipeAsync(source(), Ops.endWith(999, 1000)));
//     await runScenario("IxJS endWith", () => Ix.from(source()).pipe(IxOps.endWith(999, 1000)));

//     await runScenario("pipejs defaultIfEmpty", () => pipeAsync(source(0), Ops.defaultIfEmpty(42)), false);
//     await runScenario("IxJS defaultIfEmpty", () => Ix.from(source(0)).pipe(IxOps.defaultIfEmpty(42)), false);

//     await runScenario("pipejs pairwise", () => pipeAsync(source(), Ops.pairwise()), false);
//     await runScenario("IxJS pairwise", () => Ix.from(source()).pipe(IxOps.pairwise()), false);

//     await runScenario("pipejs tap", () => pipeAsync(source(), Ops.tap(() => { })), false);
//     await runScenario("IxJS tap", () => Ix.from(source()).pipe(IxOps.tap(() => { })), false);

//     await runScenario("pipejs ignoreElements", () => pipeAsync(source(), Ops.ignoreElements()));
//     await runScenario("IxJS ignoreElements", () => Ix.from(source()).pipe(IxOps.ignoreElements()));

//     await runScenario("pipejs reverse", () => pipeAsync(source(1000), Ops.reverse()));
//     await runScenario("IxJS reverse", () => Ix.from(source(1000)).pipe(IxOps.reverse()));

//     await runScenario("pipejs slice", () => pipeAsync(source(), Ops.slice(100, 1100)));
//     await runScenario("IxJS slice", () => Ix.from(source()).pipe(IxOps.slice(100, 1100)));

//     await runScenario("pipejs repeat", () => pipeAsync(source(100), Ops.repeat(5)));
//     await runScenario("IxJS repeat", () => Ix.from(source(100)).pipe(IxOps.repeat(5)));

//     // await runScenario("pipejs expand", () => pipeAsync([1], Ops.expand(x => (x < 8 ? [x + 1] : []))), false);
//     // await runScenario("IxJS expand", () => Ix.from([1]).pipe(IxOps.expand(x => (x < 8 ? [x + 1] : []))), false);

//     // const higher = [[1, 2], [3, 4, 5], [6]];
//     // await runScenario("pipejs concatAll", () => pipeAsync(higher, Ops.concatAll()));
//     // await runScenario("IxJS concatAll", () => Ix.from(higher).pipe(IxOps.concatAll()));

//     await runScenario("pipejs flatMap", () => pipeAsync(source(1000), Ops.flatMap(x => [x, x + 1])), false);
//     await runScenario("IxJS flatMap", () => Ix.from(source(1000)).pipe(IxOps.flatMap(x => [x, x + 1])), false);

//     await runScenario("pipejs buffer (count)", () => pipeAsync(source(), Ops.bufferCount?.(3)), false);
//     await runScenario("IxJS buffer", () => Ix.from(source()).pipe(IxOps.buffer(3)), false);

//     await runScenario("pipejs memoize", () => pipeAsync(source(2000), Ops.memoize()))
//     await runScenario("IxJS memoize", () => Ix.from(source(2000)).pipe(IxOps.memoize()));


//     await runScenario("pipejs orderBy", () => pipeAsync(source(3000), Ops.orderBy?.(x => x % 10) ?? Ops.orderBy(x => x)));
//     await runScenario("IxJS orderBy", () => Ix.from(source(3000)).pipe(IxOps.orderBy(x => x % 10)));

//     // await runScenario("pipejs zipWith", () => pipeAsync(source(3000), Ops.zipWith(sourceSync(3000))), false);
//     // await runScenario("IxJS zipWith", () => Ix.from(source(3000)).pipe(IxOps.zipWith(source(3000) as any)), false);

//     await runScenario("pipejs union", () => pipeAsync(source(2000), Ops.union(sourceSync(1500))));
//     await runScenario("IxJS union", () => Ix.from(source(2000)).pipe(IxOps.union(sourceSync(1500) as any)));


//     await runScenario("pipejs average", () => pipeAsync(source(), Ops.average()));
//     await runScenario("IxJS average", () => Ix.of(Ix.average(Ix.from(source()))));

//     // const errorSource = function* () { yield 1; throw new Error("err"); };
//     // await runScenario("pipejs catchError", ()=>pipeAsync(errorSource(), Ops.catchError(() => 2)), false);
//     // await runScenario("IxJS catchError",()=> Ix.catchError(Ix.from(errorSource()), [2]), false);

//     await runScenario("pipejs concat", () => pipeAsync(source(), Ops.concatWithAsync(source())));
//     await runScenario("IxJS concat", () => Ix.concat(source(), source()));

//     await runScenario("pipejs count", () => pipeAsync(source(), Ops.count()));
//     await runScenario("IxJS count", () => Ix.of(Ix.count(Ix.from(source()))));

//     await runScenario("pipejs elementAt", () => pipeAsync(source(), Ops.elementAt(2500)));
//     await runScenario("IxJS elementAt", () => Ix.of(Ix.elementAt(Ix.from(source()), 2500)));

//     await runScenario("pipejs every", () => pipeAsync(source(), Ops.every(x => x >= 0)));
//     await runScenario("IxJS every", () => Ix.of(Ix.every(Ix.from(source()), { predicate: x => x >= 0 })));

//     await runScenario("pipejs find", () => pipeAsync(source(), Ops.find(x => x === 2500)));
//     await runScenario("IxJS find", () => Ix.of(Ix.find(Ix.from(source()), { predicate: x => x === 2500 })));

//     await runScenario("pipejs findIndex", () => pipeAsync(source(), Ops.findIndex(x => x === 2500)));
//     await runScenario("IxJS findIndex", () => Ix.of(Ix.findIndex(Ix.from(source()), { predicate: x => x === 2500 })));

//     await runScenario("pipejs first", () => pipeAsync(source(), Ops.first()));
//     await runScenario("IxJS first", () => Ix.of(Ix.first(Ix.from(source()))));

//     await runScenario("pipejs includes", () => pipeAsync(source(), Ops.includes(2500)), false);
//     await runScenario("IxJS includes", () => Ix.of(Ix.includes(Ix.from(source()), 2500)), false);

//     await runScenario("pipejs isEmpty", () => pipeAsync(source(), Ops.isEmpty()), false);
//     await runScenario("IxJS isEmpty", () => Ix.of(Ix.isEmpty(Ix.from(source()))), false);

//     await runScenario("pipejs last", () => pipeAsync(source(), Ops.last()));
//     await runScenario("IxJS last", () => Ix.of(Ix.last(Ix.from(source()))));

//     await runScenario("pipejs max", () => pipeAsync(source(), Ops.max()));
//     await runScenario("IxJS max", () => Ix.of(Ix.max(Ix.from(source()))));

//     await runScenario("pipejs min", () => pipeAsync(source(), Ops.min()));
//     await runScenario("IxJS min", () => Ix.of(Ix.min(Ix.from(source()))));

//     await runScenario("pipejs reduce", () => pipeAsync(source(), Ops.reduce(sumFn, 0)));
//     await runScenario("IxJS reduce", () => Ix.of(Ix.reduce(Ix.from(source()), { callback: sumFn, seed: 0 })));

//     await runScenario("pipejs reduceRight", () => pipeAsync(source(1000), Ops.reverse(), Ops.reduce(sumFn, 0)));
//     await runScenario("IxJS reduceRight", () => Ix.of(Ix.reduceRight(Ix.from(source(1000)), { callback: sumFn, seed: 0 })));

//     await runScenario("pipejs sequenceEqual", () => pipeAsync(source(1000), Ops.sequenceEqualAsync(source(1000))), false);
//     await runScenario("IxJS sequenceEqual", () => Ix.of(Ix.sequenceEqual(source(1000), source(1000))), false);

//     await runScenario("pipejs single", () => pipeAsync(source(), Ops.single((x) => x === 42)));
//     await runScenario("IxJS single", () => Ix.of(Ix.single(Ix.from(source()), { predicate: (x) => x === 42 })));

//     await runScenario("pipejs some", () => pipeAsync(source(), Ops.some(x => x === 2500)), false);
//     await runScenario("IxJS some", () => Ix.of(Ix.some(Ix.from(source()), { predicate: x => x === 2500 })), false);

//     await runScenario("pipejs sum", () => pipeAsync(source(), Ops.sum()));
//     await runScenario("IxJS sum", () => Ix.of(Ix.sum(Ix.from(source()))));

//     await runScenario("pipejs toArray", () => pipeAsync(source(), Ops.toArray()), false);
//     await runScenario("IxJS toArray", () => Ix.of(Ix.toArray(Ix.from(source()))), false);

//     await runScenario("pipejs toMap", () => pipeAsync(source(1000), Ops.toMap((x: any) => `val-${x}`)), false);
//     await runScenario("IxJS toMap", () => Ix.of(Ix.toMap(Ix.from(source(1000)), { keySelector: x => `val-${x}` })), false);

//     await runScenario("pipejs toSet", () => pipeAsync(source(), Ops.toSet()), false);
//     await runScenario("IxJS toSet", () => Ix.of(Ix.toSet(Ix.from(source()))), false);


//     console.log(`-`.repeat(111));

//     // 5. Native for comparison (No library)
//     const startNative = performance.now();
//     let nativeCount = 0;
//     let sum = 0;
//     for await (const x of source()) {
//         const val = inc(x);
//         if (isEven(val)) {
//             nativeCount++;
//             sum += val;
//         }
//     }
//     const endNative = performance.now();
//     console.log(`${"Native (Baseline)".padEnd(45)} | ${nativeCount.toLocaleString().padStart(10)} items | ${(endNative - startNative).toFixed(2).padStart(8)}ms | ${sum.toLocaleString().padStart(30)}`);
// }

// runBenchmark();
