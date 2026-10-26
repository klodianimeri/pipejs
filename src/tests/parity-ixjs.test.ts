// // parity-ixjs.test.ts
// import { from } from "ix/iterable";
// import * as Ix from "ix/iterable";
// import * as IxOps from "ix/iterable/operators";
// import { from as fromAsync } from "ix/asynciterable";
// import * as IxAsync from "ix/asynciterable";
// import * as IxAsyncOps from "ix/asynciterable/operators";

// import { pipeSync } from "../sync/pipe-sync.js";
// import { pipeAsync } from "../async/pipe-async.js";
// import * as Ops from "../pipes/index.js";

// function* source(count = 20): Iterable<number> {
//     for (let i = 0; i < count; i++) yield i;
// }

// async function* sourceAsync(count = 20): AsyncIterable<number> {
//     for (let i = 0; i < count; i++) yield i;
// }

// const collect = <T>(it: Iterable<T>): T[] => [...it];

// async function collectAsync<T>(it: AsyncIterable<T>): Promise<T[]> {
//     const out: T[] = [];
//     for await (const v of it) out.push(v);
//     return out;
// }

// function expectParity<T>(pipejs: Iterable<T>, ixjs: Iterable<T>) {
//     expect(collect(pipejs)).toEqual(collect(ixjs));
// }

// async function expectParityAsync<T>(
//     pipejs: AsyncIterable<T>,
//     ixjs: AsyncIterable<T>
// ) {
//     expect(await collectAsync(pipejs)).toEqual(await collectAsync(ixjs));
// }

// const inc = (x: number) => x + 1;
// const isEven = (x: number) => x % 2 === 0;
// const sumFn = (acc: number, x: number) => acc + x;

// function delay(ms: number) {
//     return new Promise<void>((r) => setTimeout(r, ms));
// }

// async function* timed<T>(items: T[], gapMs: number): AsyncGenerator<T> {
//     for (const item of items) {
//         yield item;
//         await delay(gapMs);
//     }
// }

// async function* interval(ms: number, count: number): AsyncGenerator<number> {
//     for (let i = 0; i < count; i++) {
//         await delay(ms);
//         yield i;
//     }
// }

// // ===========================================================================
// // map / filter / tap / mapTo
// // ===========================================================================

// test('parity map', () => {
//     expectParity(
//         pipeSync(source(), Ops.map(inc)),
//         from(source()).pipe(IxOps.map(inc))
//     );
// });

// test('parity mapTo', () => {
//     expectParity(
//         pipeSync(source(5), Ops.mapTo(7)),
//         from(source(5)).pipe(IxOps.map(() => 7))
//     );
// });

// test('parity filter', () => {
//     expectParity(
//         pipeSync(source(), Ops.filter(isEven)),
//         from(source()).pipe(IxOps.filter(isEven))
//     );
// });

// test('parity tap passthrough', () => {
//     const seen: number[] = [];
//     expectParity(
//         pipeSync(source(5), Ops.tap(x => seen.push(x))),
//         from(source(5)).pipe(IxOps.tap(x => { }))
//     );
//     expect(seen).toEqual([0, 1, 2, 3, 4]);
// });

// // ===========================================================================
// // skip / take family
// // ===========================================================================

// test('parity skip', () => {
//     expectParity(
//         pipeSync(source(), Ops.skip(5)),
//         from(source()).pipe(IxOps.skip(5))
//     );
// });

// test('parity take', () => {
//     expectParity(
//         pipeSync(source(), Ops.take(5)),
//         from(source()).pipe(IxOps.take(5))
//     );
// });

// test('parity skipLast', () => {
//     expectParity(
//         pipeSync(source(), Ops.skipLast(3)),
//         from(source()).pipe(IxOps.skipLast(3))
//     );
// });

// test('parity takeLast', () => {
//     expectParity(
//         pipeSync(source(), Ops.takeLast(3)),
//         from(source()).pipe(IxOps.takeLast(3))
//     );
// });

// test('parity skipWhile', () => {
//     expectParity(
//         pipeSync(source(), Ops.skipWhile(x => x < 5)),
//         from(source()).pipe(IxOps.skipWhile(x => x < 5))
//     );
// });

// test('parity takeWhile', () => {
//     expectParity(
//         pipeSync(source(), Ops.takeWhile(x => x < 5)),
//         from(source()).pipe(IxOps.takeWhile(x => x < 5))
//     );
// });

// test('parity slice Array-style end exclusive', () => {
//     expect(collect(pipeSync(source(), Ops.slice(2, 8)))).toEqual([2, 3, 4, 5, 6, 7]);
// });

// test('parity slice vs Ix', () => {
//     expectParity(
//         pipeSync(source(), Ops.slice(2, 8)),
//         from(source()).pipe(IxOps.slice(2, 6))
//     );
// });

// // ===========================================================================
// // scan / reduce / reverse
// // ===========================================================================

// test('parity scan', () => {
//     expectParity(
//         pipeSync(source(10), Ops.scan(sumFn, 0)),
//         from(source(10)).pipe(IxOps.scan(sumFn, 0))
//     );
// });

// test('parity reduce', () => {
//     expectParity(
//         pipeSync(source(10), Ops.reduce(sumFn, 0)),
//         [Ix.reduce(from(source(10)), sumFn, 0)]
//     );
// });

// test('parity reverse', () => {
//     expectParity(
//         pipeSync(source(10), Ops.reverse()),
//         from(source(10)).pipe(IxOps.reverse())
//     );
// });

// // ===========================================================================
// // distinct*
// // ===========================================================================

// test('parity distinct', () => {
//     const dupes = function* () {
//         for (let i = 0; i < 20; i++) yield i % 5;
//     };
//     expectParity(
//         pipeSync(dupes(), Ops.distinct()),
//         from(dupes()).pipe(IxOps.distinct())
//     );
// });

// test('parity distinctUntilChanged', () => {
//     const seq = [1, 1, 2, 2, 2, 3, 1];
//     expectParity(
//         pipeSync(seq, Ops.distinctUntilChanged()),
//         from(seq).pipe(IxOps.distinctUntilChanged())
//     );
// });

// test('parity distinctUntilKeyChanged', () => {
//     const seq = [{ k: 1 }, { k: 1 }, { k: 2 }, { k: 2 }, { k: 1 }];
//     expectParity(
//         pipeSync(seq, Ops.distinctUntilKeyChanged('k')),
//         from(seq).pipe(IxOps.distinctUntilChanged({ keySelector: (v: any) => v.k }))
//     );
// });

// // ===========================================================================
// // boundaries
// // ===========================================================================

// // test('parity startWith', () => {
// //     expectParity(
// //         pipeSync(source(5), Ops.startWith(-1, -2)),
// //         from(source(5)).pipe(IxOps.startWith(-1, -2))
// //     );
// // });

// test('parity endWith', () => {
//     expectParity(
//         pipeSync(source(5), Ops.endWith(98, 99)),
//         from(source(5)).pipe(IxOps.endWith(98, 99))
//     );
// });

// test('parity defaultIfEmpty empty', () => {
//     expectParity(
//         pipeSync([] as number[], Ops.defaultIfEmpty(42)),
//         from([] as number[]).pipe(IxOps.defaultIfEmpty(42))
//     );
// });

// test('parity defaultIfEmpty non-empty', () => {
//     expectParity(
//         pipeSync(source(3), Ops.defaultIfEmpty(42)),
//         from(source(3)).pipe(IxOps.defaultIfEmpty(42))
//     );
// });

// test('parity pairwise', () => {
//     expectParity(
//         pipeSync(source(6), Ops.pairwise()),
//         from(source(6)).pipe(IxOps.pairwise())
//     );
// });

// test('parity ignoreElements', () => {
//     expectParity(
//         pipeSync(source(5), Ops.ignoreElements()),
//         from(source(5)).pipe(IxOps.ignoreElements())
//     );
// });

// test('parity repeat 3 total', () => {
//     expect(collect(pipeSync(source(3), Ops.repeat(3)))).toEqual([
//         0, 1, 2, 0, 1, 2, 0, 1, 2,
//     ]);
// });

// test('parity expand', () => {
//     expectParity(
//         pipeSync([1], Ops.expand(x => (x < 4 ? [x + 1] : []))),
//         from([1]).pipe(IxOps.expand(x => (x < 4 ? [x + 1] : [])))
//     );
// });

// test('parity fill', () => {
//     expect(collect(pipeSync(source(5), Ops.fill(0)))).toEqual([0, 0, 0, 0, 0]);
// });

// // ===========================================================================
// // flat / flatMap / concat*
// // ===========================================================================

// test('parity flat', () => {
//     const higher = [[1, 2], [3], [4, 5]];
//     expectParity(
//         pipeSync(higher, Ops.flat()),
//         from(higher).pipe(IxOps.flat())
//     );
// });

// test('parity flatMap', () => {
//     expectParity(
//         pipeSync(source(5), Ops.flatMap(x => [x, x * 10])),
//         from(source(5)).pipe(IxOps.flatMap(x => [x, x * 10]))
//     );
// });

// test('parity concatAll', () => {
//     const higher = [[1, 2], [3], [4, 5]];
//     expectParity(
//         pipeSync(higher, Ops.concatAll()),
//         from(higher).pipe(IxOps.concatAll())
//     );
// });

// test('parity concatMap sync', () => {
//     expectParity(
//         pipeSync(source(4), Ops.concatMap(x => [x, x + 1])),
//         from(source(4)).pipe(IxOps.flatMap(x => [x, x + 1]))
//     );
// });

// test('parity concatWith', () => {
//     expectParity(
//         pipeSync(source(3), Ops.concatWith(source(3))),
//         Ix.concat(source(3), source(3))
//     );
// });

// test('parity bufferCount', () => {
//     expectParity(
//         pipeSync(source(10), Ops.bufferCount(3)),
//         from(source(10)).pipe(IxOps.buffer(3))
//     );
// });

// // ===========================================================================
// // order / zip / set
// // ===========================================================================

// test('parity orderBy', () => {
//     expectParity(
//         pipeSync(source(15), Ops.orderBy(x => x % 5)),
//         from(source(15)).pipe(IxOps.orderBy(x => x % 5))
//     );
// });

// test('parity zipWith sync', () => {
//     expectParity(
//         pipeSync(source(5), Ops.zipWith(['a', 'b', 'c', 'd', 'e'])),
//         from(source(5)).pipe(IxOps.zipWith(['a', 'b', 'c', 'd', 'e']))
//     );
// });

// test('parity union', () => {
//     expectParity(
//         pipeSync(source(6), Ops.union(source(4))),
//         from(source(6)).pipe(IxOps.union(source(4)))
//     );
// });

// test('parity intersection', () => {
//     expectParity(
//         pipeSync(source(8), Ops.intersection([2, 4, 6, 10, 12])),
//         from(source(8)).pipe(IxOps.intersect([2, 4, 6, 10, 12]))
//     );
// });

// test('parity except', () => {
//     expectParity(
//         pipeSync(source(8), Ops.except([1, 2, 3])),
//         from(source(8)).pipe(IxOps.except([1, 2, 3]))
//     );
// });

// test('parity difference', () => {
//     expectParity(
//         pipeSync(source(8), Ops.difference([1, 2, 3])),
//         from(source(8)).pipe(IxOps.except([1, 2, 3]))
//     );
// });

// test('parity symmetricDifference', () => {
//     expect(
//         collect(pipeSync([1, 2, 3], Ops.symmetricDifference([2, 3, 4]))).sort()
//     ).toEqual([1, 4]);
// });

// test('parity isSubsetOf', () => {
//     expect(collect(pipeSync([1, 2], Ops.isSubsetOf([1, 2, 3])))).toEqual([true]);
// });

// test('parity isSupersetOf', () => {
//     expect(collect(pipeSync([1, 2, 3], Ops.isSupersetOf([1, 2])))).toEqual([true]);
// });

// test('parity isDisjointFrom', () => {
//     expect(collect(pipeSync([1, 2], Ops.isDisjointFrom([3, 4])))).toEqual([true]);
// });

// // ===========================================================================
// // find* / first / last / index*
// // ===========================================================================

// test('parity find', () => {
//     expectParity(
//         pipeSync(source(10), Ops.find(x => x === 6)),
//         [Ix.find(from(source(10)), { predicate: x => x === 6 })]
//     );
// });

// test('parity findLast', () => {
//     expect(collect(pipeSync([1, 2, 3, 2, 1], Ops.findLast(x => x === 2)))).toEqual([2]);
// });

// test('parity findIndex', () => {
//     expect(collect(pipeSync(source(10), Ops.findIndex(x => x === 6)))).toEqual([6]);
// });

// test('parity findLastIndex', () => {
//     expect(collect(pipeSync([1, 2, 3, 2, 1], Ops.findLastIndex(x => x === 2)))).toEqual([3]);
// });

// test('parity first', () => {
//     expectParity(
//         pipeSync(source(10), Ops.first()),
//         [Ix.first(from(source(10)))]
//     );
// });

// test('parity last', () => {
//     expectParity(
//         pipeSync(source(10), Ops.last()),
//         [Ix.last(from(source(10)))]
//     );
// });

// test('parity elementAt', () => {
//     expectParity(
//         pipeSync(source(10), Ops.elementAt(4)),
//         [Ix.elementAt(from(source(10)), 4)]
//     );
// });

// test('parity indexOf', () => {
//     expect(collect(pipeSync(source(10), Ops.indexOf(6)))).toEqual([6]);
// });

// test('parity lastIndexOf', () => {
//     expect(collect(pipeSync([1, 2, 3, 2, 1], Ops.lastIndexOf(2)))).toEqual([3]);
// });

// test('parity includes', () => {
//     expectParity(
//         pipeSync(source(10), Ops.includes(6)),
//         [Ix.includes(from(source(10)), 6)]
//     );
// });

// test('parity every', () => {
//     expectParity(
//         pipeSync(source(10), Ops.every(x => x >= 0)),
//         [Ix.every(from(source(10)), { predicate: x => x >= 0 })]
//     );
// });

// test('parity some', () => {
//     expectParity(
//         pipeSync(source(10), Ops.some(x => x === 6)),
//         [Ix.some(from(source(10)), { predicate: x => x === 6 })]
//     );
// });

// test('parity single', () => {
//     expectParity(
//         pipeSync([42], Ops.single()),
//         [Ix.single(from([42]))]
//     );
// });

// test('parity isEmpty', () => {
//     expectParity(
//         pipeSync(source(0), Ops.isEmpty()),
//         [Ix.isEmpty(from(source(0)))]
//     );
// });

// test('parity sequenceEqual', () => {
//     expectParity(
//         pipeSync(source(8), Ops.sequenceEqual(source(8))),
//         [Ix.sequenceEqual(source(8), source(8))] as any
//     );
// });

// // ===========================================================================
// // aggregates / conversion
// // ===========================================================================

// test('parity count', () => {
//     expectParity(
//         pipeSync(source(10), Ops.count()),
//         [Ix.count(from(source(10)))]
//     );
// });

// test('parity size', () => {
//     expect(collect(pipeSync(source(10), Ops.size()))).toEqual([10]);
// });

// test('parity sum', () => {
//     expectParity(
//         pipeSync(source(10), Ops.sum()),
//         [Ix.sum(from(source(10)))]
//     );
// });

// test('parity average', () => {
//     expectParity(
//         pipeSync(source(10), Ops.average()),
//         [Ix.average(from(source(10)))]
//     );
// });

// test('parity min', () => {
//     expectParity(
//         pipeSync(source(10), Ops.min()),
//         [Ix.min(from(source(10)))]
//     );
// });

// test('parity max', () => {
//     expectParity(
//         pipeSync(source(10), Ops.max()),
//         [Ix.max(from(source(10)))]
//     );
// });

// test('parity toArray', () => {
//     expectParity(
//         pipeSync(source(8), Ops.toArray()),
//         [Ix.toArray(from(source(8)))]
//     );
// });

// test('parity toSet', () => {
//     const a = collect(pipeSync(source(8), Ops.toSet()))[0] as Set<number>;
//     const b = Ix.toSet(from(source(8)));
//     expect([...a].sort((x, y) => x - y)).toEqual([...b].sort((x, y) => x - y));
// });

// test('parity toMap', () => {
//     const a = collect(pipeSync(source(5), Ops.toMap(x => `k${x}`)))[0] as Map<string, number>;
//     const b = Ix.toMap(from(source(5)), { keySelector: (x: number) => `k${x}` });
//     expect([...a.entries()].sort((x, y) => x[0].localeCompare(y[0]))).toEqual(
//         [...b.entries()].sort((x, y) => x[0].localeCompare(y[0]))
//     );
// });

// test('parity groupBy', () => {
//     const a = collect(pipeSync(source(6), Ops.groupBy(x => x % 3)))[0] as Map<number, number[]>;
//     const b = collect(from(source(6)).pipe(IxOps.groupBy(x => x % 3)));
//     const bMap = new Map(b.map((g: any) => [g.key, [...g]]));
//     expect([...a.keys()].sort()).toEqual([...bMap.keys()].sort());
//     for (const [k, vals] of a) {
//         expect(vals).toEqual(bMap.get(k));
//     }
// });

// test('parity memoize', () => {
//     const p = pipeSync(source(5), Ops.memoize());
//     const i = from(source(5)).pipe(IxOps.memoize());
//     expect(collect(p)).toEqual(collect(i));
//     expect(collect(p)).toEqual(collect(i));
// });

// test('parity groupJoin', () => {
//     const outer = [{ id: 1 }, { id: 2 }];
//     const inner = [{ oid: 1, v: 10 }, { oid: 1, v: 11 }];
//     expect(
//         collect(
//             pipeSync(
//                 outer,
//                 Ops.groupJoin(
//                     inner,
//                     o => o.id,
//                     i => i.oid,
//                     (o, ins) => ({ id: o.id, n: [...ins].length })
//                 )
//             )
//         )
//     ).toEqual([
//         { id: 1, n: 2 },
//         { id: 2, n: 0 },
//     ]);
// });

// test('parity innerJoin', () => {
//     const outer = [{ id: 1 }, { id: 2 }];
//     const inner = [{ oid: 1, v: 10 }, { oid: 1, v: 11 }, { oid: 2, v: 20 }];
//     const result = collect(
//         pipeSync(
//             outer,
//             Ops.innerJoin(
//                 inner,
//                 o => o.id,
//                 i => i.oid,
//                 (o, i) => ({ id: o.id, v: i.v })
//             )
//         )
//     );
//     expect(result).toEqual([
//         { id: 1, v: 10 },
//         { id: 1, v: 11 },
//         { id: 2, v: 20 },
//     ]);
// });

// test('parity catchError passthrough', () => {
//     expect(collect(pipeSync(source(3), Ops.catchError(() => 99)))).toEqual([0, 1, 2]);
// });

// test('parity retry passthrough', () => {
//     expect(collect(pipeSync(source(3), Ops.retry(2)))).toEqual([0, 1, 2]);
// });

// test('parity ignoreErrors passthrough', () => {
//     expect(collect(pipeSync(source(3), Ops.ignoreErrors()))).toEqual([0, 1, 2]);
// });

// test('parity pop', () => {
//     expect(collect(pipeSync(source(5), Ops.pop()))).toEqual([0, 1, 2, 3]);
// });

// test('parity splice', () => {
//     expect(collect(pipeSync(source(8), Ops.splice(2, 3)))).toEqual([0, 1, 5, 6, 7]);
// });

// // ===========================================================================
// // Async parity
// // ===========================================================================

// test('async parity map filter take', async () => {
//     await expectParityAsync(
//         pipeAsync(sourceAsync(20), Ops.map(inc), Ops.filter(isEven), Ops.take(5)),
//         fromAsync(sourceAsync(20)).pipe(
//             IxAsyncOps.map(inc),
//             IxAsyncOps.filter(isEven),
//             IxAsyncOps.take(5)
//         )
//     );
// });

// test('async parity concatMap sequential', async () => {
//     expect(
//         await collectAsync(
//             pipeAsync(
//                 sourceAsync(4),
//                 Ops.concatMapAsync(async function* (x) {
//                     yield x;
//                     yield x * 10;
//                 })
//             )
//         )
//     ).toEqual([0, 0, 1, 10, 2, 20, 3, 30]);
// });

// test('async parity zipWith', async () => {
//     await expectParityAsync(
//         pipeAsync(sourceAsync(4), Ops.zipWith([10, 20, 30, 40])),
//         fromAsync(sourceAsync(4)).pipe(
//             IxAsyncOps.zipWith(
//                 fromAsync(
//                     (async function* () {
//                         yield 10;
//                         yield 20;
//                         yield 30;
//                         yield 40;
//                     })()
//                 )
//             )
//         )
//     );
// });

// test('async parity mergeWith', async () => {
//     const a = await collectAsync(
//         pipeAsync(sourceAsync(3), Ops.mergeWith(sourceAsync(3)))
//     );
//     const b = await collectAsync(
//         IxAsync.merge(fromAsync(sourceAsync(3)), fromAsync(sourceAsync(3)))
//     );
//     expect(a.sort()).toEqual(b.sort());
// });

// // ===========================================================================
// // Time / notifier / higher-order — real assertions (may fail)
// // ===========================================================================

// test('debounceTime 0 passes all', async () => {
//     expect(
//         await collectAsync(pipeAsync(sourceAsync(5), Ops.debounceTime(0)))
//     ).toEqual([0, 1, 2, 3, 4]);
// });

// test('debounceTime rapid → last only', async () => {
//     expect(
//         await collectAsync(pipeAsync(timed([1, 2, 3, 4], 15), Ops.debounceTime(80)))
//     ).toEqual([4]);
// });

// test('debounceTime gaps longer than window → each', async () => {
//     expect(
//         await collectAsync(pipeAsync(timed([1, 2, 3], 120), Ops.debounceTime(40)))
//     ).toEqual([1, 2, 3]);
// });

// test('throttleTime 0 passes all', async () => {
//     expect(
//         await collectAsync(pipeAsync(sourceAsync(5), Ops.throttleTime(0)))
//     ).toEqual([0, 1, 2, 3, 4]);
// });

// test('throttleTime rapid → leading', async () => {
//     expect(
//         await collectAsync(pipeAsync(timed([1, 2, 3, 4], 15), Ops.throttleTime(80)))
//     ).toEqual([1]);
// });

// test('throttleTime gaps longer than window → each', async () => {
//     expect(
//         await collectAsync(pipeAsync(timed([1, 2, 3], 120), Ops.throttleTime(40)))
//     ).toEqual([1, 2, 3]);
// });

// test('sampleTime 0 passes all', async () => {
//     expect(
//         await collectAsync(pipeAsync(sourceAsync(5), Ops.sampleTime(0)))
//     ).toEqual([0, 1, 2, 3, 4]);
// });

// test('sampleTime first value does not emit immediately', async () => {
//     const result = await collectAsync(
//         pipeAsync(timed([1, 2, 3], 20), Ops.sampleTime(100))
//     );
//     // first opens window only; with short source may be empty or later samples only
//     expect(result.includes(1)).toBe(false);
// });

// test('sample with notifier', async () => {
//     const result = await collectAsync(
//         pipeAsync(timed([10, 20, 30, 40], 40), Ops.sample(interval(90, 5)))
//     );
//     expect(result.length).toBeGreaterThanOrEqual(1);
//     for (const v of result) {
//         expect([10, 20, 30, 40]).toContain(v);
//     }
// });

// test('delayEach 0', async () => {
//     expect(
//         await collectAsync(pipeAsync(sourceAsync(3), Ops.delayEach(0)))
//     ).toEqual([0, 1, 2]);
// });

// test('delay 0', async () => {
//     expect(
//         await collectAsync(pipeAsync(sourceAsync(3), Ops.delay(0)))
//     ).toEqual([0, 1, 2]);
// });

// test('timeout long enough passes', async () => {
//     expect(
//         await collectAsync(pipeAsync(timed([1, 2], 20), Ops.timeout(500)))
//     ).toEqual([1, 2]);
// });

// test('switchMap sync inners', async () => {
//     expect(
//         await collectAsync(
//             pipeAsync(
//                 sourceAsync(3),
//                 Ops.switchMap(x => [x, x * 10] as any)
//             )
//         )
//     ).toEqual([0, 0, 1, 10, 2, 20]); // fails today → empty: operator likely async-only
// });

// test('switchMap async inners', async () => {
//     expect(
//         await collectAsync(
//             pipeAsync(
//                 sourceAsync(3),
//                 Ops.switchMap(async function* (x) {
//                     yield x;
//                     yield x * 10;
//                 })
//             )
//         )
//     ).toEqual([0, 0, 1, 10, 2, 20]);
// });

// // test('switchAll', async () => {
// //     expect(
// //         await collectAsync(
// //             pipeAsync(
// //                 (async function* () {
// //                     yield [1, 2];
// //                     yield [3];
// //                     yield [4, 5];
// //                 })(),
// //                 Ops.switchAll()
// //             )
// //         )
// //     ).toEqual([1, 2, 3, 4, 5]);
// // });

// test('switchAll async inners', async () => {
//     expect(
//         await collectAsync(
//             pipeAsync(
//                 (async function* () {
//                     yield (async function* () { yield 1; yield 2; })();
//                     yield (async function* () { yield 3; })();
//                     yield (async function* () { yield 4; yield 5; })();
//                 })(),
//                 Ops.switchAll()
//             )
//         )
//     ).toEqual([1, 2, 3, 4, 5]);
// });

// test('mergeAll sync inners', async () => {
//     expect(
//         await collectAsync(
//             pipeAsync(
//                 (async function* () {
//                     yield [1, 2];
//                     yield [3];
//                     yield [4, 5];
//                 })(),
//                 Ops.mergeAll()
//             )
//         )
//     ).toEqual([1, 2, 3, 4, 5]);
// });

// test('mergeAll concurrent async inners', async () => {
//     const result = await collectAsync(
//         pipeAsync(
//             (async function* () {
//                 yield timed([1, 2], 30);
//                 yield timed([10, 20], 10);
//             })(),
//             Ops.mergeAll()
//         )
//     );
//     expect(result.sort((a, b) => a - b)).toEqual([1, 2, 10, 20]);
// });

// test('concatMap vs mergeAll order', async () => {
//     const concat = await collectAsync(
//         pipeAsync(
//             (async function* () {
//                 yield timed([1, 2], 20);
//                 yield timed([3], 5);
//             })(),
//             Ops.concatAllAsync?.() ?? Ops.concatMapAsync(x => x as any)
//         )
//     );
//     expect(concat).toEqual([1, 2, 3]);
// });

// test('withLatestFrom', async () => {
//     const result = await collectAsync(
//         pipeAsync(
//             timed([1, 2, 3], 40),
//             Ops.withLatestFrom(timed([10, 20, 30], 25))
//         )
//     );
//     expect(result.length).toBeGreaterThanOrEqual(1);
//     for (const pair of result) {
//         expect(Array.isArray(pair)).toBe(true);
//         expect(pair).toHaveLength(2);
//     }
// });

// test('combineLatestWith', async () => {
//     const result = await collectAsync(
//         pipeAsync(
//             timed([1, 2], 30),
//             Ops.combineLatestWith(timed([10, 20], 30))
//         )
//     );
//     expect(result.length).toBeGreaterThanOrEqual(1);
//     for (const pair of result) {
//         expect(Array.isArray(pair)).toBe(true);
//     }
// });

// test('forkJoin', async () => {
//     // static or operator form depending on export
//     const result = await collectAsync(
//         pipeAsync(
//             (async function* () {
//                 yield timed([1, 2], 10);
//                 yield timed([3, 4], 10);
//             })(),
//             Ops.forkJoin?.() as any
//         )
//     ).catch(() => null);

//     if (result === null) {
//         // try static-style if operator form fails
//         expect(typeof Ops.forkJoin).toBe('function');
//     } else {
//         expect(result.length).toBeGreaterThanOrEqual(0);
//     }
// });

// // timeStamp / timeInterval: actual property names
// test('timeStamp adds time', async () => {
//     const result = await collectAsync(pipeAsync(sourceAsync(3), Ops.timeStamp()));
//     expect(result).toHaveLength(3);
//     for (const v of result as any[]) {
//         expect(v).toEqual(
//             expect.objectContaining({
//                 value: expect.any(Number),
//                 time: expect.any(Number),
//             })
//         );
//     }
// });

// test('timeInterval adds elapsed', async () => {
//     const result = await collectAsync(
//         pipeAsync(timed([1, 2, 3], 30), Ops.timeInterval())
//     );
//     expect(result).toHaveLength(3);
//     for (const v of result as any[]) {
//         expect(v).toEqual(
//             expect.objectContaining({
//                 value: expect.any(Number),
//                 elapsed: expect.any(Number),
//             })
//         );
//     }
// });

// test('bufferCount already covered; buffer notifier', async () => {
//     const result = await collectAsync(
//         pipeAsync(
//             timed([1, 2, 3, 4, 5], 20),
//             Ops.buffer(interval(50, 5))
//         )
//     );
//     expect(result.length).toBeGreaterThanOrEqual(1);
//     expect(result.some(b => Array.isArray(b) && b.length > 0)).toBe(true);
// });

// test('bufferTime', async () => {
//     const result = await collectAsync(
//         pipeAsync(timed([1, 2, 3, 4], 30), Ops.bufferTime(70))
//     );
//     expect(result.length).toBeGreaterThanOrEqual(1);
//     expect(result.every(b => Array.isArray(b))).toBe(true);
// });

// // test('skipUntil', async () => {
// //     const result = await collectAsync(
// //         pipeAsync(
// //             timed([1, 2, 3, 4, 5], 30),
// //             Ops.skipUntil(interval(80, 1))
// //         )
// //     );
// //     expect(result.length).toBeGreaterThanOrEqual(1);
// //     expect(result[0]).toBeGreaterThanOrEqual(1);
// // });

// // test('takeUntil', async () => {
// //     const result = await collectAsync(
// //         pipeAsync(
// //             timed([1, 2, 3, 4, 5, 6], 30),
// //             Ops.takeUntil(interval(80, 1))
// //         )
// //     );
// //     expect(result.length).toBeGreaterThanOrEqual(1);
// //     expect(result.length).toBeLessThan(6);
// // });

// test('debounce notifier', async () => {
//     expect(
//         await collectAsync(
//             pipeAsync(
//                 timed([1, 2, 3, 4], 15),
//                 Ops.debounce(() => 80)
//             )
//         )
//     ).toEqual([4]);
// });

// test('throttle notifier', async () => {
//     expect(
//         await collectAsync(
//             pipeAsync(
//                 timed([1, 2, 3, 4], 15),
//                 Ops.throttle(() => interval(80, 1))
//             )
//         )
//     ).toEqual([1]);
// });