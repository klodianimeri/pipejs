import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { union } from "../pipes/union.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync union – combines multiple streams with unique elements maintaining order', () => {
    const sourceArray = sequenceSync(1, 4); // yields 1, 2, 3
    const sourceB = sequenceSync(3, 6);     // yields 3, 4, 5
    const sourceC = sequenceSync(5, 8);     // yields 5, 6, 7

    const result = [...pipeSync(
        sourceArray,
        union(sourceB, sourceC)
    )];

    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7]);
});

test('sync union – filters duplicates from within the main stream itself', () => {
    // Handling duplicate scenario using overlapping sequenceSync ranges
    const sourceArray = sequenceSync(1, 4); // yields 1, 2, 3
    const sourceB = sequenceSync(2, 5);     // yields 2, 3, 4

    const result = [...pipeSync(
        sourceArray,
        union(sourceB)
    )];

    expect(result).toEqual([1, 2, 3, 4]);
});

test('sync union – operates correctly when secondary sources are empty', () => {
    const sourceArray = sequenceSync(1, 4); // yields 1, 2, 3
    const emptyB = sequenceSync(0, 0);
    const emptyC = sequenceSync(0, 0);

    const result = [...pipeSync(
        sourceArray,
        union(emptyB, emptyC)
    )];

    expect(result).toEqual([1, 2, 3]);
});

test('sync union – operates correctly when primary stream is empty', () => {
    const emptyPrimary = sequenceSync(0, 0);
    const sourceB = sequenceSync(10, 12); // yields 10, 11
    const sourceC = sequenceSync(11, 13); // yields 11, 12

    const result = [...pipeSync(
        emptyPrimary,
        union(sourceB, sourceC)
    )];

    expect(result).toEqual([10, 11, 12]);
});

// ---------- Async ----------

test('async union – handles combination of async head stream with sync iterables at DONE', async () => {
    const sourceB = sequenceSync(2, 5); // yields 2, 3, 4
    const sourceC = sequenceSync(4, 7); // yields 4, 5, 6

    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 3), // yields 1, 2
            union(sourceB, sourceC)
        )
    );

    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
});

test('async union – handles entirely empty async stream mixed with populated sync iterables', async () => {
    const sourceB = sequenceSync(10, 13); // yields 10, 11, 12

    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            union(sourceB)
        )
    );

    expect(result).toEqual([10, 11, 12]);
});
