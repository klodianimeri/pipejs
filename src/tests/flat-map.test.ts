import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { toGeneratorSync, toGeneratorAsync, sequenceAsync } from "./sequence.test.js";
import { flatMap, flatMapAsync } from '../pipes/flat-map.js';
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

test('sync flatMap maps items to iterables and flattens them', () => {
    const sourceData = Array.of(
        { category: 'Fruit', items: Array.of('Apple', 'Banana') },
        { category: 'Vehicles', items: Array.of('Car', 'Bike') }
    );

    let pipe = pipeSync(
        toGeneratorSync(sourceData),
        flatMap((group) => group.items)
    );

    let iterator = pipe[Symbol.iterator]();

    expect(iterator.next().value).toBe('Apple');
    expect(iterator.next().value).toBe('Banana');
    expect(iterator.next().value).toBe('Car');
    expect(iterator.next().value).toBe('Bike');

    let done = iterator.next();
    expect(done.done).toBe(true);
    expect(done.value).toBeUndefined();
});

test('sync flatMap provides a reliable element index to the selector', () => {
    const sourceData = Array.of('A', 'B');

    let pipe = pipeSync(
        toGeneratorSync(sourceData),
        flatMap((char, idx) => Array.of(`${char}${idx}`))
    );

    let iterator = pipe[Symbol.iterator]();

    expect(iterator.next().value).toBe('A0');
    expect(iterator.next().value).toBe('B1');

    let done = iterator.next();
    expect(done.done).toBe(true);
});

test('sync flatMap avoids errors on non-iterable selector outputs', () => {
    const sourceData = Array.of(
        { name: 'Valid', elements: Array.of(1, 2) },
        { name: 'Broken', elements: null }, // This would cause a crash in the old version
        { name: 'Valid2', elements: Array.of(3) }
    );

    let pipe = pipeSync(
        toGeneratorSync(sourceData),
        flatMap((item) => item.elements as any) // Force cast to test resilience
    );

    let iterator = pipe[Symbol.iterator]();

    expect(iterator.next().value).toBe(1);
    expect(iterator.next().value).toBe(2);
    // 'Broken' is skipped entirely instead of throwing an error
    expect(iterator.next().value).toBe(3);

    let done = iterator.next();
    expect(done.done).toBe(true);
});

test('async flatMap merges streams cleanly', async () => {
    const sourceData = Array.of(1, 2);

    let pipe = pipeAsync(
        toGeneratorAsync(sourceData),
        flatMap((num) => Array.of(num, num * 10))
    );

    let iterator = pipe[Symbol.asyncIterator]();

    expect((await iterator.next()).value).toBe(1);
    expect((await iterator.next()).value).toBe(10);
    expect((await iterator.next()).value).toBe(2);
    expect((await iterator.next()).value).toBe(20);

    let done = await iterator.next();
    expect(done.done).toBe(true);
});

test('async flatMapAsync – flattens projected async iterables', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            flatMapAsync(x => asyncInner([x, x * 10]))
        )
    );
    expect(result).toEqual([0, 0, 1, 10, 2, 20]);
});

test('async flatMapAsync – empty inners skipped', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            flatMapAsync(x => asyncInner(x === 1 ? [] : [x]))
        )
    );
    expect(result).toEqual([0, 2]);
});

test('async flatMapAsync – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            flatMapAsync(x => asyncInner([x]))
        )
    );
    expect(result).toEqual([]);
});

test('async flatMapAsync – index passed to selector', async () => {
    const indexes: number[] = [];
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            flatMapAsync((x, i) => {
                indexes.push(i);
                return asyncInner([x, i]);
            })
        )
    );
    expect(result).toEqual([0, 0, 1, 1, 2, 2]);
    expect(indexes).toEqual([0, 1, 2]);
});


test('async flatMapAsync – works after map', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            map(x => x + 1),
            flatMapAsync(x => asyncInner([x, x * 2]))
        )
    );
    expect(result).toEqual([1, 2, 2, 4, 3, 6]);
});

test('async flatMapAsync – non-asyncIterable projection → skip', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            flatMapAsync((x => (x === 1 ? null : asyncInner([x])) as any))
        )
    );
    expect(result).toEqual([0, 2]);
});

test('flatMapAsync concurrent – faster inner can finish first', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 2),
            flatMapAsync(x => ({
                async *[Symbol.asyncIterator]() {
                    await delay(x === 0 ? 50 : 5);
                    yield x;
                },
            }))
        )
    );
    // concurrent: 1 often before 0
    expect(result.sort()).toEqual([0, 1]);
});

test('flatMapAsync concurrent – all values emitted', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            flatMapAsync(x => asyncInner([x, x * 10], 10))
        )
    );
    expect(result.sort((a, b) => a - b)).toEqual([0, 0, 1, 2, 10, 20]);
});