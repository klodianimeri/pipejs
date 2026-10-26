import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { mapTo } from "../pipes/map-to.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync ----------

test('sync mapTo – maps all emitted values to a constant primitive', () => {
    const result = [...pipeSync([1, 2, 3], mapTo("constant"))];
    expect(result).toEqual(["constant", "constant", "constant"]);
});

test('sync mapTo – maps values to an object reference', () => {
    const sourceArray = ["a", "b"];
    const objRef = { key: "value" };
    const result = [...pipeSync(sourceArray, mapTo(objRef))];

    expect(result).toEqual([objRef, objRef]);
    expect(result[0]).toBe(objRef); // Verifies reference stability
});

test('sync mapTo – empty source yields nothing', () => {
    const sourceArray: number[] = [];
    const result = [...pipeSync(sourceArray, mapTo(99))];
    expect(result).toEqual([]);
});

// ---------- Async ----------

test('async mapTo – maps sequenceAsync elements to constant values', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3), // yields 0, 1, 2
            mapTo(true)
        )
    );
    expect(result).toEqual([true, true, true]);
});

test('async mapTo – empty async source yields nothing', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            mapTo("never")
        )
    );
    expect(result).toEqual([]);
});
