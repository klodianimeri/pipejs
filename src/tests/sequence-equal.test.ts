import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { sequenceEqual, sequenceEqualAsync } from '../pipes/sequence-equal.js';
import { sequenceSync, sequenceAsync } from "./sequence.test.js";
import { timer } from '../util/timer.js';

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

// ---------- Sync sequenceEqual ----------

test('sync sequenceEqual – equal sequences', () => {
    const result = [...pipeSync(
        sequenceSync(0, 4),
        sequenceEqual([0, 1, 2, 3])
    )];
    expect(result).toEqual([true]);
});

test('sync sequenceEqual – different length (source longer)', () => {
    const result = [...pipeSync(
        sequenceSync(0, 5),
        sequenceEqual([0, 1, 2, 3])
    )];
    expect(result).toEqual([false]);
});

test('sync sequenceEqual – different length (other longer)', () => {
    const result = [...pipeSync(
        sequenceSync(0, 3),
        sequenceEqual([0, 1, 2, 3, 4])
    )];
    expect(result).toEqual([false]);
});

test('sync sequenceEqual – mismatch in the middle', () => {
    const result = [...pipeSync(
        sequenceSync(0, 4),
        sequenceEqual([0, 1, 9, 3])
    )];
    expect(result).toEqual([false]);
});

test('sync sequenceEqual – both empty', () => {
    const result = [...pipeSync(
        sequenceSync(0, 0),
        sequenceEqual([])
    )];
    expect(result).toEqual([true]);
});

test('sync sequenceEqual – custom comparer', () => {
    const result = [...pipeSync(
        [1, 2, 3],
        sequenceEqual(['1', '2', '3'], (a, b) => String(a) === b)
    )];
    expect(result).toEqual([true]);
});

// ---------- Async sequenceEqualAsync ----------

test('async sequenceEqualAsync – equal sequences', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 4),
            sequenceEqualAsync(sequenceAsync(0, 4))
        )
    );
    expect(result).toEqual([true]);
});

test('async sequenceEqualAsync – different length (source longer)', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 5),
            sequenceEqualAsync(sequenceAsync(0, 4))
        )
    );
    expect(result).toEqual([false]);
});

test('async sequenceEqualAsync – different length (other longer)', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 3),
            sequenceEqualAsync(sequenceAsync(0, 5))
        )
    );
    expect(result).toEqual([false]);
});

test('async sequenceEqualAsync – mismatch in the middle (clean)', async () => {
    async function* other() {
        yield 0; yield 1; yield 9; yield 3;
    }

    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 4),
            sequenceEqualAsync(other())
        )
    );
    expect(result).toEqual([false]);
});

test('async sequenceEqualAsync – both empty', async () => {
    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(0, 0),
            sequenceEqualAsync(sequenceAsync(0, 0))
        )
    );
    expect(result).toEqual([true]);
});

test('async sequenceEqualAsync – custom comparer', async () => {
    async function* other() {
        yield '1'; yield '2'; yield '3';
    }

    const result = await collectAsync(
        pipeAsync(
            sequenceAsync(1, 4),
            sequenceEqualAsync(other(), (a, b) => String(a) === b)
        )
    );
    expect(result).toEqual([true]);
});

test('async sequenceEqualAsync – with timer', async () => {
    const result = await collectAsync(
        pipeAsync(
            timer(10, 3),
            sequenceEqualAsync(timer(10, 3))
        )
    );
    expect(result).toEqual([true]);
});