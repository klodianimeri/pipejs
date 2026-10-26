import { pipeAsync } from "../async/pipe-async.js";
import { mergeWith } from '../pipes/merge-with.js';
import { map } from '../pipes/map.js';
import { timer } from '../util/timer.js';

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

test('async mergeAll – flattens inner async iterables', async () => {
    const result = await collectAsync(
        pipeAsync(timer(10, 2), mergeWith(timer(10, 3), timer(10, 1)))
    );

    expect(result.length).toBe(6);
});

test('async mergeAll – empty outer', async () => {
    const result = await collectAsync(
        pipeAsync(timer(0, 0), mergeWith(timer(0, 0)))
    );

    expect(result).toEqual([]);
});

test('async mergeAll – empty inners', async () => {

    const result = await collectAsync(
        pipeAsync(timer(5, 0), mergeWith(timer(5, 2), timer(5, 0), timer(5, 1)))
    );

    expect(result.length).toBe(3);
});

test('async mergeAll – works with map', async () => {

    const result = await collectAsync(
        pipeAsync(
            timer(10, 2),
            mergeWith(timer(10, 1)),
            map(x => x * 10)
        )
    );

    expect(result.length).toBe(3);
});