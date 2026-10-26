
// // bench-sync-operators.ts
// import { run, bench, group } from "mitata";
// import { from } from "ix/asynciterable";
// import * as Ix from "ix/asynciterable";
// import * as IxOps from "ix/asynciterable/operators";

// import { pipeAsync } from "../async/pipe-async.js";
// import * as Ops from "../pipes/index.js";

// // ---------- Setup ----------
// const SIZE = 10_000;
// const LARGE = 100_000;
// const MEDIUM = 100_000;

// async function* source(count = SIZE): AsyncIterable<number> {
//     for (let i = 0; i < count; i++) yield i;
// }

// function* sourceSync(count = SIZE): Iterable<number> {
//     for (let i = 0; i < count; i++) yield i;
// }

// const inc = (x: number) => x + 1;
// const isEven = (x: number) => x % 2 === 0;
// const sumFn = (acc: number, x: number) => acc + x;

// // Helper to drain an iterable
// const drain = async (it: AsyncIterable<any>) => {
//     for await (const _ of it) { }
// };


// group("LIMIT: Mixed (map → filter → skip → take → map) · 1M", () => {
//     bench("pipejs mixed 1M", () =>
//         drain(
//             pipeAsync(
//                 source(LARGE),
//                 Ops.map(inc),
//                 Ops.filter(isEven),
//                 Ops.skip(5_000),
//                 Ops.take(50_000),
//                 Ops.map(x => x * 2)
//             )
//         )
//     );

//     bench("IxJS mixed 1M", () =>
//         drain(
//             from(source(LARGE)).pipe(
//                 IxOps.map(inc),
//                 IxOps.filter(isEven),
//                 IxOps.skip(5_000),
//                 IxOps.take(50_000),
//                 IxOps.map(x => x * 2)
//             )
//         )
//     );
// });

// group("LIMIT: Deep map ×20 · 500k", () => {
//     const n = 500_000;

//     bench("pipejs map×20", () =>
//         drain(
//             pipeAsync(
//                 source(n),
//                 Ops.map(inc), Ops.map(inc), Ops.map(inc), Ops.map(inc), Ops.map(inc),
//                 Ops.map(inc), Ops.map(inc), Ops.map(inc), Ops.map(inc), Ops.map(inc),
//                 Ops.map(inc), Ops.map(inc), Ops.map(inc), Ops.map(inc), Ops.map(inc),
//                 Ops.map(inc), Ops.map(inc), Ops.map(inc), Ops.map(inc), Ops.map(inc)
//             )
//         )
//     );

//     bench("IxJS map×20", () =>
//         drain(
//             from(source(n)).pipe(
//                 IxOps.map(inc), IxOps.map(inc), IxOps.map(inc), IxOps.map(inc), IxOps.map(inc),
//                 IxOps.map(inc), IxOps.map(inc), IxOps.map(inc), IxOps.map(inc), IxOps.map(inc),
//                 IxOps.map(inc), IxOps.map(inc), IxOps.map(inc), IxOps.map(inc), IxOps.map(inc),
//                 IxOps.map(inc), IxOps.map(inc), IxOps.map(inc), IxOps.map(inc), IxOps.map(inc)
//             )
//         )
//     );
// });

// group("LIMIT: Filter-heavy (keep 1%) · 1M", () => {
//     const rare = (x: number) => x % 100 === 0;

//     bench("pipejs filter 1%", () =>
//         drain(pipeAsync(source(LARGE), Ops.filter(rare), Ops.map(inc)))
//     );

//     bench("IxJS filter 1%", () =>
//         drain(from(source(LARGE)).pipe(IxOps.filter(rare), IxOps.map(inc)))
//     );
// });

// group("LIMIT: Early exit take(100) from 1M", () => {
//     bench("pipejs take(100)", () =>
//         drain(pipeAsync(source(LARGE), Ops.map(inc), Ops.take(100)))
//     );

//     bench("IxJS take(100)", () =>
//         drain(from(source(LARGE)).pipe(IxOps.map(inc), IxOps.take(100)))
//     );
// });

// group("LIMIT: scan full · 1M", () => {
//     bench("pipejs scan", () =>
//         drain(pipeAsync(source(LARGE), Ops.scan(sumFn)))
//     );

//     bench("IxJS scan", () =>
//         drain(from(source(LARGE)).pipe(IxOps.scan({ callback: sumFn, seed: 0 })))
//     );
// });

// group("LIMIT: Long chain ×12 ops · 200k", () => {
//     const n = 200_000;

//     bench("pipejs long chain", () =>
//         drain(
//             pipeAsync(
//                 source(n),
//                 Ops.map(inc),
//                 Ops.filter(isEven),
//                 Ops.map(x => x * 3),
//                 Ops.skip(100),
//                 Ops.filter(x => x % 3 === 0),
//                 Ops.map(x => x + 1),
//                 Ops.take(20_000),
//                 Ops.scan(sumFn, 0),
//                 Ops.map(x => x % 1000),
//                 Ops.distinct(),
//                 Ops.takeLast(50),
//                 Ops.map(x => x)
//             )
//         )
//     );

//     bench("IxJS long chain", () =>
//         drain(
//             from(source(n)).pipe(
//                 IxOps.map(inc),
//                 IxOps.filter(isEven),
//                 IxOps.map(x => x * 3),
//                 IxOps.skip(100),
//                 IxOps.filter(x => x % 3 === 0),
//                 IxOps.map(x => x + 1),
//                 IxOps.take(20_000),
//                 IxOps.scan({ callback: sumFn, seed: 0 }),
//                 IxOps.map(x => x % 1000),
//                 IxOps.distinct(),
//                 IxOps.takeLast(50),
//                 IxOps.map(x => x)
//             )
//         )
//     );
// });

// group("LIMIT: skip(N-1000) + take(500) · 1M", () => {
//     bench("pipejs big skip", () =>
//         drain(
//             pipeAsync(
//                 source(LARGE),
//                 Ops.skip(LARGE - 1000),
//                 Ops.take(500)
//             )
//         )
//     );

//     bench("IxJS big skip", () =>
//         drain(
//             from(source(LARGE)).pipe(
//                 IxOps.skip(LARGE - 1000),
//                 IxOps.take(500)
//             )
//         )
//     );
// });

// group("Mixed Pipeline (map → filter → skip → take → map)", () => {
//     bench("pipejs  mixed", () => drain(pipeAsync(source(),
//         Ops.map(inc),
//         Ops.filter(isEven),
//         Ops.skip(500),
//         Ops.take(10_000),
//         Ops.map(x => x * 2)
//     )));
//     bench("IxJS  mixed", () => drain(from(source()).pipe(
//         IxOps.map(inc),
//         IxOps.filter(isEven),
//         IxOps.skip(500),
//         IxOps.take(10_000),
//         IxOps.map(x => x * 2)
//     )));
// });

// group("Deep Map Stack (10 × map) – SYNC", () => {
//     bench("pipejs 10× map", () => drain(pipeAsync(source(),
//         Ops.map(inc),
//         Ops.map(inc),
//         Ops.map(inc),
//         Ops.map(inc),
//         Ops.map(inc),
//         Ops.map(inc),
//         Ops.map(inc),
//         Ops.map(inc),
//         Ops.map(inc),
//         Ops.map(inc)
//     )));
//     bench("IxJS 10x map", () => drain(from(source()).pipe(
//         IxOps.map(inc),
//         IxOps.map(inc),
//         IxOps.map(inc),
//         IxOps.map(inc),
//         IxOps.map(inc),
//         IxOps.map(inc),
//         IxOps.map(inc),
//         IxOps.map(inc),
//         IxOps.map(inc),
//         IxOps.map(inc)
//     )));
// });

// group("Take / Skip", () => {
//     bench("pipejs  map → filter", () => drain(pipeAsync(source(), Ops.map(inc), Ops.filter(isEven))));
//     bench("IxJS  map → filter", () => drain(from(source()).pipe(IxOps.map(inc), IxOps.filter(isEven))));
// });


// group("Skip / Take", () => {
//     bench("pipejs  skip(1000) → take(5000)", () => drain(pipeAsync(source(), Ops.skip(1000), Ops.take(5000))));
//     bench("IxJS  skip(1000) → take(5000)", () => drain(from(source()).pipe(IxOps.skip(1000), IxOps.take(5000))));
// });


// group("map", () => {
//     bench("pipejs map", () => drain(pipeAsync(source(), Ops.map(inc))));
//     bench("IxJS map", () => drain(from(source()).pipe(IxOps.map(inc))));
// });

// group("filter", () => {
//     bench("pipejs filter", () => drain(pipeAsync(source(), Ops.filter(isEven))));
//     bench("IxJS filter", () => drain(from(source()).pipe(IxOps.filter(isEven))));
// });

// group("take", () => {
//     bench("pipejs take", () => drain(pipeAsync(source(), Ops.take(1000))));
//     bench("IxJS take", () => drain(from(source()).pipe(IxOps.take(1000))));
// });


// group("skip", () => {
//     bench("pipejs skip", () => drain(pipeAsync(source(), Ops.skip(1000))));
//     bench("IxJS skip", () => drain(from(source()).pipe(IxOps.skip(1000))));

// });


// group("takeLast", () => {
//     bench("pipejs takeLast", () => drain(pipeAsync(source(), Ops.takeLast(100))));
//     bench("IxJS takeLast", () => drain(from(source()).pipe(IxOps.takeLast(100))));
// });

// group("skipLast", () => {
//     bench("pipejs skipLast", () => drain(pipeAsync(source(), Ops.skipLast(100))));
//     bench("IxJS skipLast", () => drain(from(source()).pipe(IxOps.skipLast(100))));
// });

// group("takeWhile", () => {
//     bench("pipejs takeWhile", () => drain(pipeAsync(source(), Ops.takeWhile(x => x < 1000))));
//     bench("IxJS takeWhile", () => drain(from(source()).pipe(IxOps.takeWhile(x => x < 1000))));
// });

// group("skipWhile", () => {
//     bench("pipejs skipWhile", () => drain(pipeAsync(source(), Ops.skipWhile(x => x < 1000))));
//     bench("IxJS skipWhile", () => drain(from(source()).pipe(IxOps.skipWhile(x => x < 1000))));
// });

// group("scan", () => {
//     bench("pipejs scan", () => drain(pipeAsync(source(), Ops.scan(sumFn, 0))));
//     bench("IxJS scan", () => drain(from(source()).pipe(IxOps.scan({ callback: sumFn, seed: 0 }))));
// });

// group("distinct", () => {
//     bench("pipejs distinct", () => drain(pipeAsync(source(), Ops.distinct())));
//     bench("IxJS distinct", () => drain(from(source()).pipe(IxOps.distinct())));
// });

// group("distinctUntilChanged", () => {
//     bench("pipejs distinctUntilChanged", () => drain(pipeAsync(source(), Ops.distinctUntilChanged())));
//     bench("IxJS distinctUntilChanged", () => drain(from(source()).pipe(IxOps.distinctUntilChanged())));
// });

// group("startWith", () => {
//     bench("pipejs startWith", () => drain(pipeAsync(source(), Ops.startWith(-1, -2))));
//     bench("IxJS startWith", () => drain(from(source()).pipe(IxOps.startWith(-1, -2))));
// });

// group("endWith", () => {
//     bench("pipejs endWith", () => drain(pipeAsync(source(), Ops.endWith(999, 1000))));
//     bench("IxJS endWith", () => drain(from(source()).pipe(IxOps.endWith(999, 1000))));
// });

// group("defaultIfEmpty", () => {
//     bench("pipejs defaultIfEmpty", () => drain(pipeAsync(source(0), Ops.defaultIfEmpty(42))));
//     bench("IxJS defaultIfEmpty", () => drain(from(source(0)).pipe(IxOps.defaultIfEmpty(42))));
// });

// group("pairwise", () => {
//     bench("pipejs pairwise", () => drain(pipeAsync(source(), Ops.pairwise())));
//     bench("IxJS pairwise", () => drain(from(source()).pipe(IxOps.pairwise())));
// });

// group("tap / finalize", () => {
//     bench("pipejs tap", () => drain(pipeAsync(source(), Ops.tap(() => { }))));
//     bench("IxJS tap", () => drain(from(source()).pipe(IxOps.tap(() => { }))));
// });

// group("ignoreElements", () => {
//     bench("pipejs ignoreElements", () => drain(pipeAsync(source(), Ops.ignoreElements())));
//     bench("IxJS ignoreElements", () => drain(from(source()).pipe(IxOps.ignoreElements())));
// });

// group("reverse", () => {
//     bench("pipejs reverse", () => drain(pipeAsync(source(), Ops.reverse())));
//     bench("IxJS reverse", () => drain(from(source()).pipe(IxOps.reverse())));
// });

// group("slice", () => {
//     bench("pipejs slice", () => drain(pipeAsync(source(), Ops.slice(100, 1100))));
//     bench("IxJS slice", () => drain(from(source()).pipe(IxOps.slice(100, 1100))));
// });

// group("repeat", () => {
//     bench("pipejs repeat", () => drain(pipeAsync(source(100), Ops.repeat(5))));
//     bench("IxJS repeat", () => drain(from(source(100)).pipe(IxOps.repeat(5))));
// });

// async function* expandSource(): AsyncIterable<number> {
//     yield 1;
// }

// group("expand", () => {
//     bench("pipejs expand", () =>
//         drain(pipeAsync(expandSource(), Ops.expand(x => (x < 8 ? [x + 1] : []))))
//     );
//     bench("IxJS expand", () =>
//         drain(from(expandSource()).pipe(IxOps.expand((x) => (x < 8 ? [x + 1] : []) as any)))
//     );
// });

// async function* higher(): AsyncIterable<Iterable<number>> {
//     yield [1, 2];
//     yield [3, 4, 5];
//     yield [6];
// }

// group("concatAll / flat", () => {
//     bench("pipejs concatAll", () => drain(pipeAsync(higher(), Ops.concatAll())));
//     bench("IxJS concatAll", () => drain(from(higher()).pipe(IxOps.concatAll())));
// });

// group("flatMap", () => {
//     bench("pipejs flatMap", () =>
//         drain(pipeAsync(source(1000), Ops.flatMap(x => [x, x + 1])))
//     );
//     bench("IxJS flatMap", () =>
//         drain(from(source(1000)).pipe(IxOps.flatMap(x => [x, x + 1])))
//     );
// });

// group("buffer", () => {
//     bench("pipejs buffer (count)", () =>
//         drain(pipeAsync(source(), Ops.bufferCount?.(3)))
//     );
//     bench("IxJS buffer", () =>
//         drain(from(source()).pipe(IxOps.buffer(3)))
//     );
// });

// group("memoize", () => {
//     bench("pipejs memoize", () => {
//         const m = pipeAsync(source(2000), Ops.memoize());
//         drain(m);
//         drain(m);
//     });
//     bench("IxJS memoize", () => {
//         const m = from(source(2000)).pipe(IxOps.memoize());
//         drain(m);
//         drain(m);
//     });
// });

// group("orderBy", () => {
//     bench("pipejs orderBy", () =>
//         drain(pipeAsync(source(), Ops.orderBy?.(x => x % 10) ?? Ops.orderBy(x => x)))
//     );
//     bench("IxJS orderBy", () =>
//         drain(from(source()).pipe(IxOps.orderBy(x => x % 10)))
//     );
// });


// group("average", () => {
//     bench("pipejs average", () => drain(pipeAsync(source(), Ops.average())));
//     bench("IxJS average", () => Ix.average(from(source())));
// });

// group("count", () => {
//     bench("pipejs count", () => drain(pipeAsync(source(), Ops.count())));
//     bench("IxJS count", () => Ix.count(from(source())));
// });

// group("elementAt", () => {
//     bench("pipejs elementAt", () => drain(pipeAsync(source(), Ops.elementAt(2500))));
//     bench("IxJS elementAt", () => Ix.elementAt(from(source()), 2500));
// });

// group("every", () => {
//     bench("pipejs every", () => drain(pipeAsync(source(), Ops.every(x => x >= 0))));
//     bench("IxJS every", () => Ix.every(from(source()), { predicate: x => x >= 0 }));
// });

// group("find", () => {
//     bench("pipejs find", () => drain(pipeAsync(source(), Ops.find(x => x === 2500))));
//     bench("IxJS find", () => Ix.find(from(source()), { predicate: x => x === 2500 }));
// });

// group("findIndex", () => {
//     bench("pipejs findIndex", () => drain(pipeAsync(source(), Ops.findIndex(x => x === 2500))));
//     bench("IxJS findIndex", () => Ix.findIndex(from(source()), { predicate: x => x === 2500 }));
// });

// group("first", () => {
//     bench("pipejs first", () => drain(pipeAsync(source(), Ops.first())));
//     bench("IxJS first", () => Ix.first(from(source())));
// });

// group("includes", () => {
//     bench("pipejs includes", () => drain(pipeAsync(source(), Ops.includes(2500))));
//     bench("IxJS includes", () => Ix.includes(from(source()), 2500));
// });

// group("isEmpty", () => {
//     bench("pipejs isEmpty", () => drain(pipeAsync(source(), Ops.isEmpty())));
//     bench("IxJS isEmpty", () => Ix.isEmpty(from(source())));
// });

// group("last", () => {
//     bench("pipejs last", () => drain(pipeAsync(source(), Ops.last())));
//     bench("IxJS last", () => Ix.last(from(source())));
// });

// group("max", () => {
//     bench("pipejs max", () => drain(pipeAsync(source(), Ops.max())));
//     bench("IxJS max", () => Ix.max(from(source())));
// });

// group("min", () => {
//     bench("pipejs min", () => drain(pipeAsync(source(), Ops.min())));
//     bench("IxJS min", () => Ix.min(from(source())));
// });

// group("reduce", () => {
//     bench("pipejs reduce", () => drain(pipeAsync(source(), Ops.reduce(sumFn, 0))));
//     bench("IxJS reduce", () => Ix.reduce(from(source()), { callback: sumFn, seed: 0 }));
// });

// group("sequenceEqual", () => {
//     bench("pipejs sequenceEqual", () => drain(pipeAsync(source(1000), Ops.sequenceEqualAsync(source(1000)))));
//     bench("IxJS sequenceEqual", () => Ix.sequenceEqual(source(1000), source(1000)));
// });

// async function* singleSource(): AsyncIterable<number> {
//     yield 42;
// }

// group("single", () => {
//     bench("pipejs single", () => drain(pipeAsync(singleSource(), Ops.single())));
//     bench("IxJS single", () => Ix.single(from(singleSource())));
// });

// group("some", () => {
//     bench("pipejs some", () => drain(pipeAsync(source(), Ops.some(x => x === 2500))));
//     bench("IxJS some", () => Ix.some(from(source()), { predicate: x => x === 2500 }));
// });

// group("sum", () => {
//     bench("pipejs sum", () => drain(pipeAsync(source(), Ops.sum())));
//     bench("IxJS sum", () => Ix.sum(from(source())));
// });

// group("toArray", () => {
//     bench("pipejs toArray", () => drain(pipeAsync(source(), Ops.toArray())));
//     bench("IxJS toArray", () => Ix.toArray(from(source())));
// });

// group("toMap", () => {
//     bench("pipejs toMap", () => drain(pipeAsync(source(1000), Ops.mapTo((x: any) => `val-${x}`))));
//     bench("IxJS toMap", () => Ix.toMap(from(source(1000)), { keySelector: x => `val-${x}` }));
// });

// group("toSet", () => {
//     bench("pipejs toSet", () => drain(pipeAsync(source(), Ops.toSet())));
//     bench("IxJS toSet", () => Ix.toSet(from(source())));
// });


// // ---------- Run ----------
// // const results = await run();
// const results = await run({ filter: /average*/ });

// const analysis: any[] = [];
// results.benchmarks.forEach((trial) => {
//     trial.runs.forEach((runItem) => {
//         if (!runItem.stats) return;
//         const s = runItem.stats;
//         analysis.push({
//             name: trial.alias,
//             avgUs: (s.avg / 1000).toFixed(2),
//             p50Us: (s.p50 / 1000).toFixed(2),
//             p99Us: (s.p99 / 1000).toFixed(2),
//         });
//     });
// });

// analysis.sort((a, b) => {
//     let aName = a.name.replace('pipejs ', '').replace('IxJS ', '');
//     let bName = a.name.replace('pipejs ', '').replace('IxJS ', '');
//     return aName - bName;
//     // a.avgUs - b.avgUs
// });

// console.table(analysis);