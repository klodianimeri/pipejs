import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { startWith } from "../pipes/start-with.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync startWith – prepends multiple elements to the beginning of the stream', () => {
    const result = [...pipeSync(
        sequenceSync(0, 4), // yields 1, 2, 3
        startWith("a", "b")
    )];

    expect(result).toEqual(["a", "b", 0, 1, 2, 3]);
});

test('sync startWith – prepends elements to an entirely empty stream', () => {
    const result = [...pipeSync(
        sequenceSync(0, 0), // empty
        startWith("empty-prefix")
    )];
    expect(result).toEqual(["empty-prefix"]);
});

test('sync startWith – handles no parameters gracefully without altering the stream', () => {
    const result = [...pipeSync(
        sequenceSync(10, 13), // yields 10, 11, 12
        startWith()
    )];
    expect(result).toEqual([10, 11, 12]);
});

// ---------- Async ----------

test('async startWith – prepends values ahead of an async sequence stream', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(5, 8), // yields 5, 6, 7
            startWith(0, 1)
        )
    );
    expect(result).toEqual([0, 1, 5, 6, 7]);
});

test('async startWith – handles empty async source by prefixing elements upon initiation', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0), // empty
            startWith("async-prefix")
        )
    );
    expect(result).toEqual(["async-prefix"]);
});
