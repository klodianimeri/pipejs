import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { reduce } from "../pipes/reduce.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync reduce – accumulates values using a provided initial value', () => {
    const result = [...pipeSync(
        sequenceSync(1, 5), // yields 1, 2, 3, 4
        reduce((acc, curr) => acc + curr, 10)
    )];
    expect(result).toEqual([20]); // 10 + 1 + 2 + 3 + 4
});

test('sync reduce – works without an initial value using the first element', () => {
    const result = [...pipeSync(
        sequenceSync(1, 5), // yields 1, 2, 3, 4
        reduce((acc: any, curr: any) => acc + curr)
    )];
    expect(result).toEqual([10]); // 1 + 2 + 3 + 4
});

test('sync reduce – provides correct element tracking index to accumulator', () => {
    const result = [...pipeSync(
        sequenceSync(10, 13), // yields 10, 11, 12
        reduce((acc, curr, index) => {
            acc.push(index);
            return acc;
        }, [] as number[])
    )];
    expect(result).toEqual([[0, 1, 2]]);
});

test('sync reduce – single element source without initial value', () => {
    const result = [...pipeSync(
        sequenceSync(5, 6), // yields 5
        reduce((acc: any, curr) => acc + curr)
    )];
    expect(result).toEqual([5]);
});

test('sync reduce – empty source with initial value returns initial value', () => {
    const result = [...pipeSync(
        sequenceSync(0, 0),
        reduce((acc, curr) => acc + curr, 42)
    )];
    expect(result).toEqual([42]);
});

test('sync reduce – empty source without initial value yields nothing', () => {
    const result = [...pipeSync(
        sequenceSync(0, 0),
        reduce((acc: any, curr) => acc + curr)
    )];
    expect(result).toEqual([]);
});

// ---------- Async ----------

test('async reduce – accumulates async sequence elements with initial value', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 4), // yields 1, 2, 3
            reduce((acc, curr) => acc * curr, 2)
        )
    );
    expect(result).toEqual([12]); // 2 * 1 * 2 * 3
});

test('async reduce – accumulates async sequence elements without initial value', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(2, 5), // yields 2, 3, 4
            reduce((acc: any, curr) => acc * curr)
        )
    );
    expect(result).toEqual([24]); // 2 * 3 * 4
});
