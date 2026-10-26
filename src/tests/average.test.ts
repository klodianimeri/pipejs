import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { average } from '../pipes/average.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync average – basic mean', () => {
    const result = [...pipeSync(
        [1, 2, 3, 4],
        average()
    )];
    expect(result).toEqual([2.5]);
});

test('sync average – single value', () => {
    const result = [...pipeSync(
        [42],
        average()
    )];
    expect(result).toEqual([42]);
});

test('sync average – empty source emits nothing', () => {
    const result = [...pipeSync(
        [],
        average()
    )];
    expect(result).toEqual([]);
});

test('sync average – sequenceSync', () => {
    // 0+1+2+3+4 = 10, count 5 → 2
    const result = [...pipeSync(
        sequenceSync(0, 5),
        average()
    )];
    expect(result).toEqual([2]);
});

test('sync average – ignores non-numbers', () => {
    const result = [...pipeSync(
        [1, "x", 3, null, 5] as any,
        average()
    )];
    // only 1, 3, 5 → average 3
    expect(result).toEqual([3]);
});

test('sync average – all non-numbers → empty', () => {
    const result = [...pipeSync(
        ["a", "b", true] as any,
        average()
    )];
    expect(result).toEqual([]);
});

test('sync average – negative numbers', () => {
    const result = [...pipeSync(
        [-2, 0, 2],
        average()
    )];
    expect(result).toEqual([0]);
});

test('sync average – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(1, 4),               // 1,2,3
        map(x => x * 2),                  // 2,4,6
        average()
    )];
    expect(result).toEqual([4]);
});

test('sync average – emits only one value', () => {
    const result = [...pipeSync(
        [10, 20, 30],
        average()
    )];
    expect(result.length).toBe(1);
    expect(result[0]).toBe(20);
});

// ---------- Async ----------

test('async average – basic mean', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 5),            // 1,2,3,4
            average()
        )
    );
    expect(result).toEqual([2.5]);
});

test('async average – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            average()
        )
    );
    expect(result).toEqual([]);
});

test('async average – single value', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(7, 8),
            average()
        )
    );
    expect(result).toEqual([7]);
});

test('async average – works with map', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 4),            // 0,1,2,3
            map(x => x * 10),               // 0,10,20,30
            average()
        )
    );
    expect(result).toEqual([15]);
});