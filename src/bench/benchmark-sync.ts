// import * as Ix from "ix/iterable";
// import * as IxOps from "ix/iterable/operators";

// import { pipeSync } from "../sync/pipe-sync.js";
// import * as Ops from "../pipes/index.js";

// const DATA_SIZE = 5_000_000;

// function* source(count = DATA_SIZE): Iterable<number> {
//     for (let i = 0; i < count; i++) yield i;
// }

// // function* source() {
// //     for (let i = 0; i < DATA_SIZE; i++) {
// //         yield i;
// //     }
// // }


// const inc = (x: number) => x + 1;
// const isEven = (x: number) => x % 2 === 0;
// const sumFn = (acc: number, x: number) => acc + x;

// let i: number = 0;

// async function runScenario(name: string, pipeline: () => Iterable<any>, dosum: boolean = true) {
//     if (i % 2 === 0) console.log(`-`.repeat(111));
//     const start = performance.now();
//     let count = 0;
//     let sum = 0;
//     for (const value of pipeline()) {
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


//     await runScenario("pipejs  map → filter", () => pipeSync(source(), Ops.map(inc), Ops.filter(isEven)));
//     await runScenario("IxJS  map → filter", () => Ix.from(source()).pipe(IxOps.map(inc), IxOps.filter(isEven)));


//     await runScenario("pipejs  skip(1000) → take(5000)", () => pipeSync(source(), Ops.skip(1000), Ops.take(5000)));
//     await runScenario("IxJS  skip(1000) → take(5000)", () => Ix.from(source()).pipe(IxOps.skip(1000), IxOps.take(5000)));


//     await runScenario("pipejs map", () => pipeSync(source(), Ops.map(inc)));
//     await runScenario("IxJS map", () => Ix.from(source()).pipe(IxOps.map(inc)));

//     await runScenario("pipejs filter", () => pipeSync(source(), Ops.filter(isEven)));
//     await runScenario("IxJS filter", () => Ix.from(source()).pipe(IxOps.filter(isEven)));

//     await runScenario("pipejs take", () => pipeSync(source(), Ops.take(1000)));
//     await runScenario("IxJS take", () => Ix.from(source()).pipe(IxOps.take(1000)));


//     await runScenario("pipejs skip", () => pipeSync(source(), Ops.skip(1000)));
//     await runScenario("IxJS skip", () => Ix.from(source()).pipe(IxOps.skip(1000)));



//     await runScenario("pipejs takeLast", () => pipeSync(source(), Ops.takeLast(100)));
//     await runScenario("IxJS takeLast", () => Ix.from(source()).pipe(IxOps.takeLast(100)));

//     await runScenario("pipejs skipLast", () => pipeSync(source(), Ops.skipLast(100)));
//     await runScenario("IxJS skipLast", () => Ix.from(source()).pipe(IxOps.skipLast(100)));

//     await runScenario("pipejs takeWhile", () => pipeSync(source(), Ops.takeWhile(x => x < 1000)));
//     await runScenario("IxJS takeWhile", () => Ix.from(source()).pipe(IxOps.takeWhile(x => x < 1000)));

//     await runScenario("pipejs skipWhile", () => pipeSync(source(), Ops.skipWhile(x => x < 1000)));
//     await runScenario("IxJS skipWhile", () => Ix.from(source()).pipe(IxOps.skipWhile(x => x < 1000)));

//     await runScenario("pipejs scan", () => pipeSync(source(), Ops.scan(sumFn, 0)));
//     await runScenario("IxJS scan", () => Ix.from(source()).pipe(IxOps.scan(sumFn, 0)));


//     await runScenario("pipejs scanRight", () => pipeSync(source(2000), Ops.reverse(), Ops.scan(sumFn, 0)));
//     await runScenario("IxJS scanRight", () => Ix.from(source(2000)).pipe(IxOps.reverse(), IxOps.scan(sumFn, 0)));

//     await runScenario("pipejs distinct", () => pipeSync(source(1000), Ops.distinct()));
//     await runScenario("IxJS distinct", () => Ix.from(source(1000)).pipe(IxOps.distinct()));

//     await runScenario("pipejs distinctUntilChanged", () => pipeSync(source(), Ops.distinctUntilChanged()));
//     await runScenario("IxJS distinctUntilChanged", () => Ix.from(source()).pipe(IxOps.distinctUntilChanged()));

//     await runScenario("pipejs startWith", () => pipeSync(source(), Ops.startWith(-1, -2)));
//     await runScenario("IxJS startWith", () => Ix.from(source()).pipe(IxOps.startWith(-1, -2)));

//     await runScenario("pipejs endWith", () => pipeSync(source(), Ops.endWith(999, 1000)));
//     await runScenario("IxJS endWith", () => Ix.from(source()).pipe(IxOps.endWith(999, 1000)));

//     await runScenario("pipejs defaultIfEmpty", () => pipeSync(source(0), Ops.defaultIfEmpty(42)), false);
//     await runScenario("IxJS defaultIfEmpty", () => Ix.from(source(0)).pipe(IxOps.defaultIfEmpty(42)), false);

//     await runScenario("pipejs pairwise", () => pipeSync(source(), Ops.pairwise()), false);
//     await runScenario("IxJS pairwise", () => Ix.from(source()).pipe(IxOps.pairwise()), false);

//     await runScenario("pipejs tap", () => pipeSync(source(), Ops.tap(() => { })), false);
//     await runScenario("IxJS tap", () => Ix.from(source()).pipe(IxOps.tap(() => { })), false);

//     await runScenario("pipejs ignoreElements", () => pipeSync(source(), Ops.ignoreElements()));
//     await runScenario("IxJS ignoreElements", () => Ix.from(source()).pipe(IxOps.ignoreElements()));

//     await runScenario("pipejs reverse", () => pipeSync(source(1000), Ops.reverse()));
//     await runScenario("IxJS reverse", () => Ix.from(source(1000)).pipe(IxOps.reverse()));

//     await runScenario("pipejs slice", () => pipeSync(source(), Ops.slice(100, 1100)));
//     await runScenario("IxJS slice", () => Ix.from(source()).pipe(IxOps.slice(100, 1100)));

//     await runScenario("pipejs repeat", () => pipeSync(source(100), Ops.repeat(5)));
//     await runScenario("IxJS repeat", () => Ix.from(source(100)).pipe(IxOps.repeat(5)));

//     await runScenario("pipejs expand", () => pipeSync([1], Ops.expand(x => (x < 8 ? [x + 1] : []))), false);
//     await runScenario("IxJS expand", () => Ix.from([1]).pipe(IxOps.expand(x => (x < 8 ? [x + 1] : []))), false);

//     const higher = [[1, 2], [3, 4, 5], [6]];
//     await runScenario("pipejs concatAll", () => pipeSync(higher, Ops.concatAll()));
//     await runScenario("IxJS concatAll", () => Ix.from(higher).pipe(IxOps.concatAll()));

//     await runScenario("pipejs flatMap", () => pipeSync(source(1000), Ops.flatMap(x => [x, x + 1])), false);
//     await runScenario("IxJS flatMap", () => Ix.from(source(1000)).pipe(IxOps.flatMap(x => [x, x + 1])), false);

//     await runScenario("pipejs buffer (count)", () => pipeSync(source(), Ops.bufferCount?.(3)), false);
//     await runScenario("IxJS buffer", () => Ix.from(source()).pipe(IxOps.buffer(3)), false);

//     await runScenario("pipejs memoize", () => pipeSync(source(2000), Ops.memoize()))
//     await runScenario("IxJS memoize", () => Ix.from(source(2000)).pipe(IxOps.memoize()));


//     await runScenario("pipejs orderBy", () => pipeSync(source(3000), Ops.orderBy?.(x => x % 10) ?? Ops.orderBy(x => x)));
//     await runScenario("IxJS orderBy", () => Ix.from(source(3000)).pipe(IxOps.orderBy(x => x % 10)));

//     await runScenario("pipejs zipWith", () => pipeSync(source(3000), Ops.zipWith(source(3000))), false);
//     await runScenario("IxJS zipWith", () => Ix.from(source(3000)).pipe(IxOps.zipWith(source(3000))), false);

//     await runScenario("pipejs union", () => pipeSync(source(2000), Ops.union(source(1500))));
//     await runScenario("IxJS union", () => Ix.from(source(2000)).pipe(IxOps.union(source(1500))));


//     await runScenario("pipejs average", () => pipeSync(source(), Ops.average()));
//     await runScenario("IxJS average", () => Ix.of(Ix.average(Ix.from(source()))));

//     // const errorSource = function* () { yield 1; throw new Error("err"); };
//     // await runScenario("pipejs catchError", ()=>pipeSync(errorSource(), Ops.catchError(() => 2)), false);
//     // await runScenario("IxJS catchError",()=> Ix.catchError(Ix.from(errorSource()), [2]), false);

//     await runScenario("pipejs concat", () => pipeSync(source(), Ops.concatWith(source())));
//     await runScenario("IxJS concat", () => Ix.concat(source(), source()));

//     await runScenario("pipejs count", () => pipeSync(source(), Ops.count()));
//     await runScenario("IxJS count", () => Ix.of(Ix.count(Ix.from(source()))));

//     await runScenario("pipejs elementAt", () => pipeSync(source(), Ops.elementAt(2500)));
//     await runScenario("IxJS elementAt", () => Ix.of(Ix.elementAt(Ix.from(source()), 2500)));

//     await runScenario("pipejs every", () => pipeSync(source(), Ops.every(x => x >= 0)));
//     await runScenario("IxJS every", () => Ix.of(Ix.every(Ix.from(source()), { predicate: x => x >= 0 })));

//     await runScenario("pipejs find", () => pipeSync(source(), Ops.find(x => x === 2500)));
//     await runScenario("IxJS find", () => Ix.of(Ix.find(Ix.from(source()), { predicate: x => x === 2500 })));

//     await runScenario("pipejs findIndex", () => pipeSync(source(), Ops.findIndex(x => x === 2500)));
//     await runScenario("IxJS findIndex", () => Ix.of(Ix.findIndex(Ix.from(source()), { predicate: x => x === 2500 })));

//     await runScenario("pipejs first", () => pipeSync(source(), Ops.first()));
//     await runScenario("IxJS first", () => Ix.of(Ix.first(Ix.from(source()))));

//     await runScenario("pipejs includes", () => pipeSync(source(), Ops.includes(2500)), false);
//     await runScenario("IxJS includes", () => Ix.of(Ix.includes(Ix.from(source()), 2500)), false);

//     await runScenario("pipejs isEmpty", () => pipeSync(source(), Ops.isEmpty()), false);
//     await runScenario("IxJS isEmpty", () => Ix.of(Ix.isEmpty(Ix.from(source()))), false);

//     await runScenario("pipejs last", () => pipeSync(source(), Ops.last()));
//     await runScenario("IxJS last", () => Ix.of(Ix.last(Ix.from(source()))));

//     await runScenario("pipejs max", () => pipeSync(source(), Ops.max()));
//     await runScenario("IxJS max", () => Ix.of(Ix.max(Ix.from(source()))));

//     await runScenario("pipejs min", () => pipeSync(source(), Ops.min()));
//     await runScenario("IxJS min", () => Ix.of(Ix.min(Ix.from(source()))));

//     await runScenario("pipejs reduce", () => pipeSync(source(), Ops.reduce(sumFn, 0)));
//     await runScenario("IxJS reduce", () => Ix.of(Ix.reduce(Ix.from(source()), sumFn, 0)));

//     await runScenario("pipejs reduceRight", () => pipeSync(source(1000), Ops.reverse(), Ops.reduce(sumFn, 0)));
//     await runScenario("IxJS reduceRight", () => Ix.of(Ix.reduceRight(Ix.from(source(1000)), sumFn, 0)));

//     await runScenario("pipejs sequenceEqual", () => pipeSync(source(1000), Ops.sequenceEqual(source(1000))), false);
//     await runScenario("IxJS sequenceEqual", () => Ix.of(Ix.sequenceEqual(source(1000), source(1000))), false);

//     await runScenario("pipejs single", () => pipeSync(source(), Ops.single((x) => x === 42)));
//     await runScenario("IxJS single", () => Ix.of(Ix.single(Ix.from(source()), { predicate: (x) => x === 42 })));

//     await runScenario("pipejs some", () => pipeSync(source(), Ops.some(x => x === 2500)), false);
//     await runScenario("IxJS some", () => Ix.of(Ix.some(Ix.from(source()), { predicate: x => x === 2500 })), false);

//     await runScenario("pipejs sum", () => pipeSync(source(), Ops.sum()));
//     await runScenario("IxJS sum", () => Ix.of(Ix.sum(Ix.from(source()))));

//     await runScenario("pipejs toArray", () => pipeSync(source(), Ops.toArray()), false);
//     await runScenario("IxJS toArray", () => Ix.of(Ix.toArray(Ix.from(source()))), false);

//     await runScenario("pipejs toMap", () => pipeSync(source(1000), Ops.toMap((x: any) => `val-${x}`)), false);
//     await runScenario("IxJS toMap", () => Ix.of(Ix.toMap(Ix.from(source(1000)), { keySelector: x => `val-${x}` })), false);

//     await runScenario("pipejs toSet", () => pipeSync(source(), Ops.toSet()), false);
//     await runScenario("IxJS toSet", () => Ix.of(Ix.toSet(Ix.from(source()))), false);


//     console.log(`-`.repeat(111));

//     // 5. Native for comparison (No library)
//     const startNative = performance.now();
//     let nativeCount = 0;
//     let sum = 0;
//     for (const x of source()) {
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
