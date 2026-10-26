import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { skipWhile } from "../pipes/skip-while.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync skipWhile – skips elements as long as predicate returns true', () => {
    const result = [...pipeSync(
        sequenceSync(1, 6), // yields 1, 2, 3, 4, 5
        skipWhile((x: any) => x < 3)
    )];
    expect(result).toEqual([3, 4, 5]);
});

test('sync skipWhile – provides an accurate index to the predicate function', () => {
    const result = [...pipeSync(
        sequenceSync(10, 15), // yields 10, 11, 12, 13, 14
        skipWhile((_: any, index: number) => index < 2)
    )];
    expect(result).toEqual([12, 13, 14]);
});

test('sync skipWhile – skips everything if predicate always returns true', () => {
    const result = [...pipeSync(
        sequenceSync(1, 4), // yields 1, 2, 3
        skipWhile(() => true)
    )];
    expect(result).toEqual([]);
});

test('sync skipWhile – empty source yields nothing', () => {
    const result = [...pipeSync(
        sequenceSync(0, 0),
        skipWhile(x => x < 5)
    )];
    expect(result).toEqual([]);
});

// ---------- Async ----------

test('async skipWhile – skips items from an async sequence stream', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 6), // yields 1, 2, 3, 4, 5
            skipWhile(x => x <= 3)
        )
    );
    expect(result).toEqual([4, 5]);
});

test('async skipWhile – empty async stream yields nothing', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            skipWhile(() => false)
        )
    );
    expect(result).toEqual([]);
});
