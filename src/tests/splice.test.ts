import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { splice } from "../pipes/splice.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync splice – removes items and injects elements at start index', () => {
    const result = [...pipeSync(
        sequenceSync(1, 6), // yields 1, 2, 3, 4, 5
        splice(2, 2, "a", "b") // At index 2, delete 2 items (3, 4) and insert 'a', 'b'
    )];
    expect(result).toEqual([1, 2, "a", "b", 5]);
});

test('sync splice – inserts elements without deleting if deleteCount is 0', () => {
    const result = [...pipeSync(
        sequenceSync(1, 4), // yields 1, 2, 3
        splice(1, 0, "x") // At index 1, delete 0, insert 'x'
    )];
    expect(result).toEqual([1, "x", 2, 3]);
});

test('sync splice – appends elements at the end if start index is beyond stream length', () => {
    const result = [...pipeSync(
        sequenceSync(1, 4), // yields 1, 2, 3
        splice(5, 2, "y", "z") // index 5 is out of bounds, inserts at DONE
    )];
    expect(result).toEqual([1, 2, 3, "y", "z"]);
});

test('sync splice – injects items into an entirely empty stream', () => {
    const result = [...pipeSync(
        sequenceSync(0, 0), // empty
        splice(0, 0, "empty-start")
    )];
    expect(result).toEqual(["empty-start"]);
});

test('sync splice – falls back to 0 if negative values are passed for start or deleteCount', () => {
    const result = [...pipeSync(
        sequenceSync(1, 4), // yields 1, 2, 3
        splice(-3, -1, "fallback") // behaves like splice(0, 0, "fallback")
    )];
    expect(result).toEqual(["fallback", 1, 2, 3]);
});

// ---------- Async ----------

test('async splice – splices an async sequence stream successfully', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(10, 14), // yields 10, 11, 12, 13
            splice(1, 2, 99) // At index 1, delete 2 items (11, 12), insert 99
        )
    );
    expect(result).toEqual([10, 99, 13]);
});

test('async splice – empty async stream correctly flushes injected elements', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            splice(2, 0, "async-flush")
        )
    );
    expect(result).toEqual(["async-flush"]);
});
