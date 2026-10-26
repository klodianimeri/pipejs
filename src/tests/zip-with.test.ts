import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { zipWith, zipWithAsync } from '../pipes/zip-with.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

async function* asyncFrom<T>(items: T[]): AsyncIterable<T> {
    for (const item of items) yield item;
}

// ---------- Sync ----------

test('sync zipWith – pairs to tuples', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        zipWith(['a', 'b', 'c'])
    )];
    expect(result).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
});

test('sync zipWith – with resultSelector', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        zipWith(['a', 'b', 'c'], (n, s) => `${n}${s}`)
    )];
    expect(result).toEqual(['1a', '2b', '3c']);
});

test('sync zipWith – source longer → stops at other end', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4],
        zipWith(['a', 'b'])
    )];
    expect(result).toEqual([[1, 'a'], [2, 'b']]);
});

test('sync zipWith – other longer → stops at source end', () => {
    const result = [...pipeSync(
        [1, 2],
        zipWith(['a', 'b', 'c', 'd'])
    )];
    expect(result).toEqual([[1, 'a'], [2, 'b']]);
});

test('sync zipWith – empty source', () => {
    const result = [...pipeSync(
        [] as number[],
        zipWith(['a', 'b'])
    )];
    expect(result).toEqual([]);
});

test('sync zipWith – empty other', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        zipWith([] as string[])
    )];
    expect(result).toEqual([]);
});

test('sync zipWith – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 3),
        map(x => x * 10),
        zipWith(['x', 'y', 'z'], (n, s) => ({ n, s }))
    )];
    expect(result).toEqual([
        { n: 0, s: 'x' },
        { n: 10, s: 'y' },
        { n: 20, s: 'z' },
    ]);
});

// ---------- Async (source async, other sync) ----------

test('async zipWith – pairs to tuples', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            zipWith(['a', 'b', 'c'])
        )
    );
    expect(result).toEqual([[0, 'a'], [1, 'b'], [2, 'c']]);
});

test('async zipWith – source longer', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            zipWith(['a', 'b'])
        )
    );
    expect(result).toEqual([[0, 'a'], [1, 'b']]);
});

test('async zipWith – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            zipWith(['a', 'b'])
        )
    );
    expect(result).toEqual([]);
});

test('async zipWithAsync – pairs to tuples', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            zipWithAsync(asyncFrom(['a', 'b', 'c']))
        )
    );
    expect(result).toEqual([[0, 'a'], [1, 'b'], [2, 'c']]);
});

test('async zipWithAsync – resultSelector', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            zipWithAsync(asyncFrom(['a', 'b', 'c']), (n, s) => `${n}${s}`)
        )
    );
    expect(result).toEqual(['0a', '1b', '2c']);
});

test('async zipWithAsync – source longer', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            zipWithAsync(asyncFrom(['a', 'b']))
        )
    );
    expect(result).toEqual([[0, 'a'], [1, 'b']]);
});

test('async zipWithAsync – other longer', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 2),
            zipWithAsync(asyncFrom(['a', 'b', 'c', 'd']))
        )
    );
    expect(result).toEqual([[0, 'a'], [1, 'b']]);
});

test('async zipWithAsync – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            zipWithAsync(asyncFrom(['a', 'b']))
        )
    );
    expect(result).toEqual([]);
});

test('async zipWithAsync – empty other', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            zipWithAsync(asyncFrom([] as string[]))
        )
    );
    expect(result).toEqual([]);
});

test('async zipWithAsync – works after map', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            map(x => x * 10),
            zipWithAsync(asyncFrom(['x', 'y', 'z']), (n, s) => ({ n, s }))
        )
    );
    expect(result).toEqual([
        { n: 0, s: 'x' },
        { n: 10, s: 'y' },
        { n: 20, s: 'z' },
    ]);
});