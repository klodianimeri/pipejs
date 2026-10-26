import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { tap } from '../pipes/tap.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync tap – callback form does not change values', () => {
    const seen: number[] = [];

    const result = [...pipeSync(
        sequenceSync(0, 4),
        tap(x => seen.push(x))
    )];

    expect(result).toEqual([0, 1, 2, 3]);
    expect(seen).toEqual([0, 1, 2, 3]);
});

test('sync tap – observer form next + complete', () => {
    const seen: number[] = [];
    let completed = false;

    const result = [...pipeSync(
        sequenceSync(1, 4),
        tap({
            next: x => seen.push(x),
            complete: () => { completed = true; },
        })
    )];

    expect(result).toEqual([1, 2, 3]);
    expect(seen).toEqual([1, 2, 3]);
    expect(completed).toBe(true);
});

test('sync tap – empty source still calls complete', () => {
    let completed = false;
    const seen: number[] = [];

    const result = [...pipeSync(
        sequenceSync(0, 0),
        tap({
            next: x => seen.push(x),
            complete: () => { completed = true; },
        })
    )];

    expect(result).toEqual([]);
    expect(seen).toEqual([]);
    expect(completed).toBe(true);
});

test('sync tap – works with map', () => {
    const seen: number[] = [];

    const result = [...pipeSync(
        sequenceSync(0, 3),
        map(x => x * 10),
        tap(x => seen.push(x))
    )];

    expect(result).toEqual([0, 10, 20]);
    expect(seen).toEqual([0, 10, 20]);
});

test('sync tap – side effect does not alter downstream', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        tap(x => x * 100),   // return value ignored
        map(x => x + 1)
    )];
    expect(result).toEqual([2, 3, 4]);
});

// ---------- Async ----------

test('async tap – callback form', async () => {
    const seen: number[] = [];

    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 4),
            tap(x => seen.push(x))
        )
    );

    expect(result).toEqual([0, 1, 2, 3]);
    expect(seen).toEqual([0, 1, 2, 3]);
});

test('async tap – observer complete', async () => {
    let completed = false;

    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 3),
            tap({
                next: () => { },
                complete: () => { completed = true; },
            })
        )
    );

    expect(result).toEqual([1, 2]);
    expect(completed).toBe(true);
});

test('async tap – empty source', async () => {
    let completed = false;

    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            tap({ complete: () => { completed = true; } })
        )
    );

    expect(result).toEqual([]);
    expect(completed).toBe(true);
});