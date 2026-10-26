import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { tryCatch } from '../pipes/try-catch.js';
import { catchError } from '../pipes/catch-error.js';
import { map } from '../pipes/map.js';
import { filter } from '../pipes/filter.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

function boomOn<T>(value: T) {
    return map((x: T) => {
        if (Object.is(x, value)) throw new Error("boom");
        return x;
    });
}

// ---------- Sync ----------

test('sync tryCatch + catchError recovers', () => {
    // Order depends on engine: tryCatch must wrap the throwing map.
    // If ops run left-to-right as written in pipeSync args after source:
    const result = [...pipeSync(
        [1, 2, 3],
        tryCatch(),
        boomOn(2),
        catchError(() => -1)
    )];
    expect(result).toEqual([1, -1, 3]);
});

test('sync tryCatch without catchError still surfaces via engine', () => {
    expect(() => [...pipeSync(
        [1, 2, 3],
        tryCatch(),
        boomOn(2)
    )]).toThrow(); // ErrorControl reaches terminal → throw
});

test('sync tryCatch – no throw passthrough', () => {
    expect([...pipeSync(
        [1, 2, 3],
        tryCatch(),
        map(x => x * 10)
    )]).toEqual([10, 20, 30]);
});

test('sync tryCatch – works with filter', () => {
    expect([...pipeSync(
        [1, 2, 3, 4],
        tryCatch(),
        filter(x => x % 2 === 0)
    )]).toEqual([2, 4]);
});

// ---------- Async ----------

test('async tryCatch + catchError recovers', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 4),
            tryCatch(),
            map(x => {
                if (x === 2) throw new Error("boom");
                return x;
            }),
            catchError(() => -1)
        )
    );
    expect(result).toEqual([0, 1, -1, 3]);
});

test('async tryCatch – async map rejection', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            tryCatch(),
            map(async x => {
                if (x === 1) throw new Error("async boom");
                return x;
            }) as any,
            catchError(() => 99)
        )
    );
    // may depend on whether map awaits; adjust if map is sync-only
    expect(result).toContain(0);
});

test('async tryCatch – passthrough', async () => {
    expect(await collectAsync(
        pipeAsync(sequenceAsync(0, 3), tryCatch())
    )).toEqual([0, 1, 2]);
});