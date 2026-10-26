import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { count } from '../pipes/count.js';
import { map, filter } from '../pipes/index.js'; // adjust imports
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync count – counts all values', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4, 5],
        count()
    )];
    expect(result).toEqual([5]);
});

test('sync count – empty source is 0', () => {
    const result = [...pipeSync(
        [],
        count()
    )];
    expect(result).toEqual([0]);
});

test('sync count – single value', () => {
    const result = [...pipeSync(
        [42],
        count()
    )];
    expect(result).toEqual([1]);
});

test('sync count – sequenceSync', () => {
    const result = [...pipeSync(
        sequenceSync(0, 10),              // 0..9
        count()
    )];
    expect(result).toEqual([10]);
});

test('sync count – after filter', () => {
    const result = [...pipeSync(
        sequenceSync(0, 10),
        filter(x => x % 2 === 0),         // 0,2,4,6,8
        count()
    )];
    expect(result).toEqual([5]);
});

test('sync count – after map still counts items', () => {
    const result = [...pipeSync(
        sequenceSync(0, 4),
        map(x => x * 10),
        count()
    )];
    expect(result).toEqual([4]);
});

test('sync count – emits only one value', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        count()
    )];
    expect(result.length).toBe(1);
    expect(typeof result[0]).toBe('number');
});

// ---------- Async ----------

test('async count – counts all values', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 7),
            count()
        )
    );
    expect(result).toEqual([7]);
});

test('async count – empty source is 0', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            count()
        )
    );
    expect(result).toEqual([0]);
});

test('async count – single value', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 2),
            count()
        )
    );
    expect(result).toEqual([1]);
});

test('async count – after filter', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 10),
            filter(x => x % 2 === 1),       // 1,3,5,7,9
            count()
        )
    );
    expect(result).toEqual([5]);
});