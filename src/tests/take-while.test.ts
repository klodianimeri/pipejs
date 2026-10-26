import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { takeWhile } from "../pipes/take-while.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync takeWhile – yields elements as long as predicate returns true', () => {
    const result = [...pipeSync(
        sequenceSync(1, 6), // yields 1, 2, 3, 4, 5
        takeWhile(x => x < 4)
    )];
    expect(result).toEqual([1, 2, 3]);
});

test('sync takeWhile – terminates immediately if the first element fails the predicate', () => {
    const result = [...pipeSync(
        sequenceSync(5, 10), // yields 5, 6, 7, 8, 9
        takeWhile(x => x < 3)
    )];
    expect(result).toEqual([]);
});

test('sync takeWhile – provides an accurate incremented element index to predicate', () => {
    const result = [...pipeSync(
        sequenceSync(10, 15), // yields 10, 11, 12, 13, 14
        takeWhile((_, index) => index < 2)
    )];
    expect(result).toEqual([10, 11]);
});

test('sync takeWhile – empty source yields nothing', () => {
    const result = [...pipeSync(
        sequenceSync(0, 0),
        takeWhile(() => true)
    )];
    expect(result).toEqual([]);
});

// ---------- Async ----------

test('async takeWhile – streams items from an async sequence stream while predicate matches', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 6), // yields 1, 2, 3, 4, 5
            takeWhile(x => x <= 2)
        )
    );
    expect(result).toEqual([1, 2]);
});

test('async takeWhile – empty async stream yields nothing', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            takeWhile(() => false)
        )
    );
    expect(result).toEqual([]);
});
