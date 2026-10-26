import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { last } from "../pipes/last.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync last – returns the final element of a multi-item source', () => {
    const result = [...pipeSync(
        [5, 7, 3, 40],
        last()
    )];
    expect(result).toEqual([40]);
});

test('sync last – single item source', () => {
    const result = [...pipeSync([99],
        last()
    )];
    expect(result).toEqual([99]);
});

test('sync last – empty source emits nothing', () => {
    const result = [...pipeSync(
        [],
        last()
    )];
    expect(result).toEqual([]);
});

// ---------- Async ----------

test('async last – returns the final element of a sequenceAsync', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 5), // yields 1, 2, 3, 4
            last()
        )
    );
    expect(result).toEqual([4]);
});

test('async last – empty source emits nothing', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            last()
        )
    );
    expect(result).toEqual([]);
});
