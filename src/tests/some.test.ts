import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { some } from "../pipes/some.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync some – returns true if at least one item matches predicate', () => {
    const result = [...pipeSync(
        sequenceSync(1, 6), // yields 1, 2, 3, 4, 5
        some(x => x === 3)
    )];
    expect(result).toEqual([true]);
});

test('sync some – returns false if no items match predicate', () => {
    const result = [...pipeSync(
        sequenceSync(1, 5), // yields 1, 2, 3, 4
        some(x => x > 10)
    )];
    expect(result).toEqual([false]);
});

test('sync some – provides accurate incremented element indices to predicate', () => {
    const result = [...pipeSync(
        sequenceSync(10, 15), // yields 10, 11, 12, 13, 14
        some((_, index) => index === 3)
    )];
    expect(result).toEqual([true]);
});

test('sync some – empty source yields false', () => {
    const result = [...pipeSync(
        sequenceSync(0, 0),
        some(x => x === 1)
    )];
    expect(result).toEqual([false]);
});

// ---------- Async ----------

test('async some – finds matching criteria inside async stream', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 6), // yields 1, 2, 3, 4, 5
            some(x => x % 2 === 0)
        )
    );
    expect(result).toEqual([true]);
});

test('async some – returns false if empty async source terminates', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            some(() => true)
        )
    );
    expect(result).toEqual([false]);
});
