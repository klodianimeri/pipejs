import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { reverse } from "../pipes/reverse.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync reverse – reverses a multi-element sequenceSync stream', () => {
    const result = [...pipeSync(
        sequenceSync(1, 5), // yields 1, 2, 3, 4
        reverse()
    )];
    expect(result).toEqual([4, 3, 2, 1]);
});

test('sync reverse – single item stream remains unchanged', () => {
    const result = [...pipeSync(
        sequenceSync(42, 43), // yields 42
        reverse()
    )];
    expect(result).toEqual([42]);
});

test('sync reverse – empty stream emits nothing', () => {
    const result = [...pipeSync(
        sequenceSync(0, 0),
        reverse()
    )];
    expect(result).toEqual([]);
});

// ---------- Async ----------

test('async reverse – reverses an async sequenceAsync stream', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(10, 14), // yields 10, 11, 12, 13
            reverse()
        )
    );
    expect(result).toEqual([13, 12, 11, 10]);
});

test('async reverse – empty async stream emits nothing', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            reverse()
        )
    );
    expect(result).toEqual([]);
});
