import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { every } from '../pipes/every.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync every – all match → true', () => {
    const result = [...pipeSync(
        [2, 4, 6, 8],
        every(x => x % 2 === 0)
    )];
    expect(result).toEqual([true]);
});

test('sync every – one fails → false', () => {
    const result = [...pipeSync(
        [2, 4, 5, 8],
        every(x => x % 2 === 0)
    )];
    expect(result).toEqual([false]);
});

test('sync every – empty source → true', () => {
    // vacuous truth
    const result = [...pipeSync(
        [],
        every(() => false)
    )];
    expect(result).toEqual([true]);
});

test('sync every – single matching value', () => {
    const result = [...pipeSync(
        [42],
        every(x => x > 0)
    )];
    expect(result).toEqual([true]);
});

test('sync every – single non-matching value', () => {
    const result = [...pipeSync(
        [42],
        every(x => x < 0)
    )];
    expect(result).toEqual([false]);
});

test('sync every – index is passed', () => {
    const indexes: number[] = [];
    const result = [...pipeSync(
        ["a", "b", "c"],
        every((_, i) => {
            indexes.push(i);
            return true;
        })
    )];
    expect(result).toEqual([true]);
    expect(indexes).toEqual([0, 1, 2]);
});

test('sync every – short-circuits on first failure', () => {
    const seen: number[] = [];
    const result = [...pipeSync(
        [1, 2, 3, 4],
        every(x => {
            seen.push(x);
            return x < 3;
        })
    )];
    expect(result).toEqual([false]);
    expect(seen).toEqual([1, 2, 3]); // stops at 3
});

test('sync every – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 4),
        map(x => x * 2),
        every(x => x % 2 === 0)
    )];
    expect(result).toEqual([true]);
});

test('sync every – emits only one boolean', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        every(x => x > 0)
    )];
    expect(result.length).toBe(1);
    expect(result[0]).toBe(true);
});

// ---------- Async ----------

test('async every – all match → true', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            every(x => x >= 0)
        )
    );
    expect(result).toEqual([true]);
});

test('async every – one fails → false', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            every(x => x < 3)
        )
    );
    expect(result).toEqual([false]);
});

test('async every – empty source → true', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            every(() => false)
        )
    );
    expect(result).toEqual([true]);
});

test('async every – index is passed', async () => {
    const indexes: number[] = [];
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(10, 13),
            every((_, i) => {
                indexes.push(i);
                return true;
            })
        )
    );
    expect(result).toEqual([true]);
    expect(indexes).toEqual([0, 1, 2]);
});