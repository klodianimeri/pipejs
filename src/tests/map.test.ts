import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { map } from "../pipes/map.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync map – transforms elements using a projection callback', () => {
    const result = [...pipeSync([1, 2, 3], map(x => x * 2))];
    expect(result).toEqual([2, 4, 6]);
});

test('sync map – provides an accurate, incremented tracking index to callbackFn', () => {
    const result = [...pipeSync(["a", "b", "c"], map((char, index) => `${char}-${index}`))];
    expect(result).toEqual(["a-0", "b-1", "c-2"]);
});

test('sync map – falls back safely to identity map if callbackFn is not a function', () => {
    // Cast to any to simulate an invalid parameter pass
    const result = [...pipeSync([10, 20], map(null as any))];
    expect(result).toEqual([10, 20]);
});

test('sync map – empty source yields nothing', () => {
    const sourceArray: number[] = [];
    const result = [...pipeSync(sourceArray, map(x => x + 1))];
    expect(result).toEqual([]);
});

// ---------- Async ----------

test('async map – transforms sequenceAsync items', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 4), // yields 1, 2, 3
            map(x => x.toString())
        )
    );
    expect(result).toEqual(["1", "2", "3"]);
});

test('async map – empty async source yields nothing', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            map(x => x)
        )
    );
    expect(result).toEqual([]);
});
