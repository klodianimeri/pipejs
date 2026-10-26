import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { endWith } from '../pipes/end-with.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync endWith – appends one value', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        endWith(99)
    )];
    expect(result).toEqual([1, 2, 3, 99]);
});

test('sync endWith – appends multiple values', () => {
    const result = [...pipeSync(
        [1, 2],
        endWith(8, 9, 10)
    )];
    expect(result).toEqual([1, 2, 8, 9, 10]);
});

test('sync endWith – empty source still appends', () => {
    const result = [...pipeSync(
        [],
        endWith(1, 2)
    )];
    expect(result).toEqual([1, 2]);
});

test('sync endWith – no extra elements', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        endWith()
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync endWith – different type', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        endWith("done")
    )];
    expect(result).toEqual([1, 2, 3, "done"]);
});

test('sync endWith – sequenceSync', () => {
    const result = [...pipeSync(
        sequenceSync(0, 3),
        endWith(100)
    )];
    expect(result).toEqual([0, 1, 2, 100]);
});

test('sync endWith – works with map', () => {
    const result = [...pipeSync(
        sequenceSync(1, 4),
        map(x => x * 10),
        endWith(0)
    )];
    expect(result).toEqual([10, 20, 30, 0]);
});

// ---------- Async ----------

test('async endWith – appends one value', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            endWith(99)
        )
    );
    expect(result).toEqual([0, 1, 2, 99]);
});

test('async endWith – appends multiple values', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 3),
            endWith(8, 9)
        )
    );
    expect(result).toEqual([1, 2, 8, 9]);
});

test('async endWith – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            endWith(1, 2)
        )
    );
    expect(result).toEqual([1, 2]);
});

test('async endWith – works with map', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            map(x => x * 10),
            endWith(-1)
        )
    );
    expect(result).toEqual([0, 10, 20, -1]);
});