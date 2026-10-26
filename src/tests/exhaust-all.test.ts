// exhaust.test.ts
import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { exhaustAll, exhaustAllAsync } from '../pipes/exhaust-all.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

function delay(ms: number) {
    return new Promise<void>((r) => setTimeout(r, ms));
}

async function* asyncInner<T>(items: T[], gapMs = 0): AsyncIterable<T> {
    for (const item of items) {
        if (gapMs > 0) await delay(gapMs);
        yield item;
    }
}

// ---------- Sync ----------

test('sync exhaustAll', () => {
    expect([...pipeSync([[1, 2], [3], [4, 5]], exhaustAll())])
        .toEqual([1, 2, 3, 4, 5]);
});

// ---------- Async exhaustAll ----------

test('async exhaustAll – drops inners while busy', async () => {
    const result = await collectAsync(
        pipeAsync(
            (async function* () {
                yield asyncInner([1, 2], 40);
                yield asyncInner([10]); // dropped
                yield asyncInner([20]); // dropped if still busy
            })(),
            exhaustAllAsync()
        )
    );
    expect(result).toContain(1);
    expect(result).toContain(2);
    expect(result).not.toContain(10);
});

test('async exhaustAll – accepts next after free', async () => {
    const result = await collectAsync(
        pipeAsync(
            (async function* () {
                yield asyncInner([1], 10);
                await delay(50);
                yield asyncInner([2], 10);
            })(),
            exhaustAllAsync()
        )
    );
    expect(result).toEqual([1, 2]);
});

test('async exhaustAll – empty source', async () => {
    expect(await collectAsync(
        pipeAsync((async function* () { })(), exhaustAllAsync())
    )).toEqual([]);
});

test('exhaustAllAsync – coverage: drop burst, then run after free, empty inners', async () => {
    const started: string[] = [];

    const result = await collectAsync(
        pipeAsync(
            (async function* () {
                // 1) long inner — should run fully
                yield (async function* () {
                    started.push("A");
                    yield "a1";
                    await delay(30);
                    yield "a2";
                    await delay(30);
                    yield "a3";
                })();

                // 2) burst while A still active — all dropped
                yield (async function* () {
                    started.push("B");
                    yield "b1";
                })();
                yield (async function* () {
                    started.push("C");
                    yield "c1";
                })();

                // 3) empty inner while still busy — dropped, must not break
                yield (async function* () {
                    started.push("empty-busy");
                })();

                // 4) wait until A finished
                await delay(100);

                // 5) empty inner while free — starts but emits nothing
                yield (async function* () {
                    started.push("empty-free");
                })();

                await delay(20);

                // 6) next real inner after free
                yield (async function* () {
                    started.push("D");
                    yield "d1";
                    yield "d2";
                })();
            })(),
            exhaustAllAsync()
        )
    );

    // A ran; B/C/empty-busy never started; empty-free + D started
    expect(started).toEqual(["A", "empty-free", "D"]);
    expect(result).toEqual(["a1", "a2", "a3", "d1", "d2"]);
});