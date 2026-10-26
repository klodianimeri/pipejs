// exhaust.test.ts
import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { exhaustMap, exhaustMapAsync } from '../pipes/exhaust-map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";
import { map } from "../pipes/index.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

function delay(ms: number) {
    return new Promise<void>((r) => setTimeout(r, ms));
}

async function* asyncInner<T>(items: T[], gapMs = 0): AsyncIterable<T> {
    for (const item of items) {
        if (gapMs > 0) await delay(gapMs);
        yield item;
    }
}

// ---------- Sync ----------

test('sync exhaustMap', () => {
    expect([...pipeSync([1, 2, 3], exhaustMap(x => [x, x * 10]))])
        .toEqual([1, 10, 2, 20, 3, 30]);
});

test('sync exhaustMap index', () => {
    const idxs: number[] = [];
    expect([...pipeSync(['a', 'b'], exhaustMap((x, i) => {
        idxs.push(i);
        return [x];
    }))]).toEqual(['a', 'b']);
    expect(idxs).toEqual([0, 1]);
});

// ---------- Async exhaustMap ----------

test('async exhaustMap – drops while inner active', async () => {
    const started: number[] = [];
    const result = await collectAsync(
        pipeAsync(
            (async function* () {
                yield 1;
                yield 2;
                yield 3;
            })(),
            exhaustMapAsync(x => {
                started.push(x);
                return asyncInner([x, x + 0.1], 30);
            })
        )
    );
    expect(started).toEqual([1]);
    expect(result[0]).toBe(1);
});

test('async exhaustMap – next after complete', async () => {
    const result = await collectAsync(
        pipeAsync(
            (async function* () {
                yield 1;
                await delay(80);
                yield 2;
            })(),
            exhaustMapAsync(x => asyncInner([x * 10], 20))
        )
    );
    expect(result).toEqual([10, 20]);
});

test('async exhaustMap – empty source', async () => {
    expect(await collectAsync(
        pipeAsync(sequenceAsync(0, 0), exhaustMapAsync(x => asyncInner([x])))
    )).toEqual([]);
});

test('exhaustMapAsync – coverage: index, project, drop mid-flight, resume', async () => {
    const projects: { value: number; index: number }[] = [];
    const innerStarted: number[] = [];

    const result = await collectAsync(
        pipeAsync(
            (async function* () {
                yield 10; // runs
                yield 20; // dropped (busy)
                yield 30; // dropped (busy)
                await delay(120);
                yield 40; // runs after free
                yield 50; // dropped if 40 still active
                await delay(120);
                yield 60; // runs
            })(),
            map(x => x), // identity — ensures HO works after another op
            exhaustMapAsync((value, index) => {
                projects.push({ value, index });
                return (async function* () {
                    innerStarted.push(value);
                    yield value;
                    await delay(50);
                    yield value + 1;
                })();
            })
        )
    );

    // only free values projected: 10, 40, 60
    expect(projects.map(p => p.value)).toEqual([10, 40, 60]);
    expect(projects.map(p => p.index)).toEqual([0, 1, 2]); // index only advances when projected
    expect(innerStarted).toEqual([10, 40, 60]);
    expect(result).toEqual([10, 11, 40, 41, 60, 61]);
});