import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { keys } from "../pipes/keys.js";
import { map } from "../pipes/map.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync keys – extracts keys from [K, V] entries', () => {
    const entries: [string, number][] = [["a", 1], ["b", 2], ["c", 3]];
    const result = [...pipeSync(
        entries,
        keys()
    )];
    expect(result).toEqual(["a", "b", "c"]);
});

test('sync keys – falls back to indices for regular primitives', () => {
    const result = [...pipeSync(
        ["apple", "banana", "cherry"],
        keys()
    )];
    expect(result).toEqual([0, 1, 2]);
});

test('sync keys – falls back to indices for arrays that are not length 2', () => {
    const result = [...pipeSync(
        [[1], [1, 2, 3], []],
        keys()
    )];
    expect(result).toEqual([0, 1, 2]);
});

test('sync keys – empty source', () => {
    const result = [...pipeSync(
        [],
        keys()
    )];
    expect(result).toEqual([]);
});

test('sync keys – works after map operator', () => {
    const result = [...pipeSync(
        sequenceSync(0, 3),
        map(x => [`key-${x}`, x] as [string, number]),
        keys()
    )];
    expect(result).toEqual(["key-0", "key-1", "key-2"]);
});
// ---------- Async ----------

async function* fromArrayAsync<T>(arr: T[]): AsyncIterable<T> {
    for (const item of arr) {
        yield item;
    }
}

test('async keys – extracts keys from [K, V] entries', async () => {
    const entries: [string, number][] = [["x", 10], ["y", 20]];

    const result = await collectAsync(
        pipeAsync(
            fromArrayAsync(entries),
            keys()
        )
    );
    expect(result).toEqual(["x", "y"]);
});

test('async keys – falls back to indices for sequenceAsync', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(10, 13), // yields 10, 11, 12
            keys()
        )
    );
    expect(result).toEqual([0, 1, 2]);
});


test('async keys – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            keys()
        )
    );
    expect(result).toEqual([]);
});
