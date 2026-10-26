import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { fill } from '../pipes/fill.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync fill – fills entire sequence', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4],
        fill(0)
    )];
    expect(result).toEqual([0, 0, 0, 0]);
});

test('sync fill – from start index', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5],
        fill(9, 2)
    )];
    expect(result).toEqual([1, 2, 9, 9, 9]);
});

test('sync fill – start and end range', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5],
        fill(7, 1, 4)
    )];
    // indices 1,2,3
    expect(result).toEqual([1, 7, 7, 7, 5]);
});

test('sync fill – end exclusive', () => {
    const result = [...pipeSync(
        sequenceSync(0, 5),
        fill(1, 0, 0)
    )];
    // i >= 0 && i < 0 → never
    expect(result).toEqual([0, 1, 2, 3, 4]);
});

test('sync fill – start beyond length', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        fill(9, 10)
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync fill – empty source', () => {
    const result = [...pipeSync(
        [],
        fill(1)
    )];
    expect(result).toEqual([]);
});

test('sync fill – single element in range', () => {
    const result = [...pipeSync(
        [1],
        fill(99)
    )];
    expect(result).toEqual([99]);
});

test('sync fill – different fill type', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        fill("x", 1, 2)
    )];
    expect(result).toEqual([1, "x", 3]);
});

test('sync fill – works with map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 4),
        fill(10, 1, 3),
        map(x => (x as number) * 2)
    )];
    // [0, 10, 10, 3] → [0, 20, 20, 6]
    expect(result).toEqual([0, 20, 20, 6]);
});

// ---------- Async ----------

test('async fill – entire sequence', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 4),
            fill(0)
        )
    );
    expect(result).toEqual([0, 0, 0, 0]);
});

test('async fill – range', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            fill(9, 2, 4)
        )
    );
    expect(result).toEqual([0, 1, 9, 9, 4]);
});

test('async fill – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            fill(1)
        )
    );
    expect(result).toEqual([]);
});

test('async fill – works with map', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 5),
            fill(0, 1, 3),
            map(x => (x as number) + 1)
        )
    );
    // [1, 0, 0, 4] → [2, 1, 1, 5]
    expect(result).toEqual([2, 1, 1, 5]);
});