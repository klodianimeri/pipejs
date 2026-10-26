import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { isEmpty } from "../pipes/is-empty.js";
import { map } from "../pipes/map.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync isEmpty – empty source → true', () => {
    const result = [...pipeSync(
        [],
        isEmpty()
    )];
    expect(result).toEqual([true]);
});

test('sync isEmpty – non-empty source → false', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        isEmpty()
    )];
    expect(result).toEqual([false]);
});

test('sync isEmpty – works after map with sequence', () => {
    const result = [...pipeSync(
        sequenceSync(0, 5),
        map(x => x * 10),
        isEmpty()
    )];
    expect(result).toEqual([false]);
});

test('sync isEmpty – single-element array → false', () => {
    const result = [...pipeSync(
        [0],
        isEmpty()
    )];
    expect(result).toEqual([false]);
});

// ---------- Async ----------

test('async isEmpty – empty source → true', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            isEmpty()
        )
    );
    expect(result).toEqual([true]);
});

test('async isEmpty – non-empty source → false', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            isEmpty()
        )
    );
    expect(result).toEqual([false]);
});
