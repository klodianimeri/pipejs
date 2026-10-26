import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { indexOf } from '../pipes/index-of.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync indexOf – finds first match', () => {
    const result = [...pipeSync(
        [1, 2, 3, 2, 4],
        indexOf(2)
    )];
    expect(result).toEqual([1]);
});

test('sync indexOf – match at index 0', () => {
    const result = [...pipeSync(
        [5, 6, 7],
        indexOf(5)
    )];
    expect(result).toEqual([0]);
});

test('sync indexOf – no match → -1', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        indexOf(99)
    )];
    expect(result).toEqual([-1]);
});

test('sync indexOf – empty source → -1', () => {
    const result = [...pipeSync(
        [],
        indexOf(1)
    )];
    expect(result).toEqual([-1]);
});

test('sync indexOf – fromIndex skips earlier', () => {
    const result = [...pipeSync(
        [2, 4, 2, 6],
        indexOf(2, 1)
    )];
    // index 0 skipped; next 2 is at index 2
    expect(result).toEqual([2]);
});

test('sync indexOf – fromIndex past all → -1', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        indexOf(2, 10)
    )];
    expect(result).toEqual([-1]);
});

test('sync indexOf – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 5),
        map(x => x * 10),
        indexOf(30)
    )];
    expect(result).toEqual([3]);
});

test('sync indexOf – emits only one number', () => {
    const result = [...pipeSync(
        [0, 0, 0],
        indexOf(0)
    )];
    expect(result).toEqual([0]);
    expect(result.length).toBe(1);
});

// ---------- Async ----------

test('async indexOf – finds first match', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 6),
            indexOf(4)
        )
    );
    expect(result).toEqual([4]);
});

test('async indexOf – no match → -1', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            indexOf(100)
        )
    );
    expect(result).toEqual([-1]);
});

test('async indexOf – fromIndex', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 6),
            indexOf(2, 3)
        )
    );
    expect(result).toEqual([-1]);
});

test('async indexOf – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            indexOf(0)
        )
    );
    expect(result).toEqual([-1]);
});