import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { pop } from "../pipes/pop.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync pop – drops the final element of a multi-item sequence', () => {
    const result = [...pipeSync(
        sequenceSync(1, 5), // yields 1, 2, 3, 4
        pop()
    )];
    // Drops 4, emits 1, 2, 3
    expect(result).toEqual([1, 2, 3]);
});

test('sync pop – single item source yields nothing', () => {
    const result = [...pipeSync(
        sequenceSync(10, 11), // yields 10
        pop()
    )];
    expect(result).toEqual([]);
});

test('sync pop – empty source yields nothing', () => {
    const result = [...pipeSync(
        sequenceSync(0, 0), // yields empty
        pop()
    )];
    expect(result).toEqual([]);
});

// ---------- Async ----------

test('async pop – drops the final element of an async sequence', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(10, 14), // yields 10, 11, 12, 13
            pop()
        )
    );
    // Drops 13, emits 10, 11, 12
    expect(result).toEqual([10, 11, 12]);
});

test('async pop – empty async source yields nothing', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            pop()
        )
    );
    expect(result).toEqual([]);
});
