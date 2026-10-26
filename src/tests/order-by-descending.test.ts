import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { orderByDescending } from '../pipes/order-by-descending.js';
import { map } from '../pipes/map.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync orderByDescending – descending by value', () => {
    const result = [...pipeSync(
        [3, 1, 4, 1, 5, 9, 2],
        orderByDescending(x => x)
    )];
    expect(result).toEqual([9, 5, 4, 3, 2, 1, 1]);
});

test('sync orderByDescending – by property', () => {
    const result = [...pipeSync(
        [
            { name: 'a', n: 1 },
            { name: 'c', n: 3 },
            { name: 'b', n: 2 },
        ],
        orderByDescending(x => x.name)
    )];
    expect(result.map(x => x.name)).toEqual(['c', 'b', 'a']);
});

test('sync orderByDescending – custom comparer', () => {
    // comparer is used as-is; here ascending via custom fn
    const result = [...pipeSync(
        [3, 1, 4, 1, 5],
        orderByDescending(x => x, (a, b) => a - b)
    )];
    expect(result).toEqual([1, 1, 3, 4, 5]);
});

test('sync orderByDescending – empty source', () => {
    const result = [...pipeSync(
        [] as number[],
        orderByDescending(x => x)
    )];
    expect(result).toEqual([]);
});

test('sync orderByDescending – single element', () => {
    const result = [...pipeSync(
        [42],
        orderByDescending(x => x)
    )];
    expect(result).toEqual([42]);
});

test('sync orderByDescending – works after map', () => {
    const result = [...pipeSync(
        sequenceSync(0, 5),
        map(x => x * 10),
        orderByDescending(x => x)
    )];
    expect(result).toEqual([40, 30, 20, 10, 0]);
});

test('sync orderByDescending – stable for equal keys', () => {
    const result = [...pipeSync(
        [
            { k: 1, id: 'a' },
            { k: 2, id: 'b' },
            { k: 1, id: 'c' },
        ],
        orderByDescending(x => x.k)
    )];
    // k=2 first; k=1 keeps arrival order a then c
    expect(result.map(x => x.id)).toEqual(['b', 'a', 'c']);
});

// ---------- Async ----------

test('async orderByDescending – descending by value', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            orderByDescending(x => x)
        )
    );
    expect(result).toEqual([4, 3, 2, 1, 0]);
});

test('async orderByDescending – by property', async () => {
    const result = await collectAsync(
        pipeAsync(
            (async function* () {
                yield { n: 1 };
                yield { n: 3 };
                yield { n: 2 };
            })(),
            orderByDescending(x => x.n)
        )
    );
    expect(result.map(x => x.n)).toEqual([3, 2, 1]);
});

test('async orderByDescending – empty source', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            orderByDescending((x: number) => x)
        )
    );
    expect(result).toEqual([]);
});