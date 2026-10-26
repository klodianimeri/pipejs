import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { distinctUntilKeyChanged } from '../pipes/distinct-until-key-changed.js';
import { map } from '../pipes/map.js';
import { sequenceAsync } from "./sequence.test.js";

async function collectAsync<T>(source: AsyncIterable<T>): Promise<T[]> {
    const result: T[] = [];
    for await (const v of source) result.push(v);
    return result;
}

type User = { id: number; name: string };

// ---------- Sync ----------

test('sync distinctUntilKeyChanged – removes consecutive same key', () => {
    const result = [...pipeSync(
        [
            { id: 1, name: "a" },
            { id: 1, name: "b" },
            { id: 2, name: "c" },
            { id: 2, name: "d" },
            { id: 1, name: "e" },
        ] as User[],
        distinctUntilKeyChanged("id")
    )];

    expect(result).toEqual([
        { id: 1, name: "a" },
        { id: 2, name: "c" },
        { id: 1, name: "e" },
    ]);
});

test('sync distinctUntilKeyChanged – all keys unique', () => {
    const result = [...pipeSync(
        [
            { id: 1, name: "a" },
            { id: 2, name: "b" },
            { id: 3, name: "c" },
        ] as User[],
        distinctUntilKeyChanged("id")
    )];

    expect(result).toEqual([
        { id: 1, name: "a" },
        { id: 2, name: "b" },
        { id: 3, name: "c" },
    ]);
});

test('sync distinctUntilKeyChanged – all same key', () => {
    const result = [...pipeSync(
        [
            { id: 1, name: "a" },
            { id: 1, name: "b" },
            { id: 1, name: "c" },
        ] as User[],
        distinctUntilKeyChanged("id")
    )];

    expect(result).toEqual([{ id: 1, name: "a" }]);
});

test('sync distinctUntilKeyChanged – empty source', () => {
    const result = [...pipeSync(
        [] as User[],
        distinctUntilKeyChanged("id")
    )];
    expect(result).toEqual([]);
});

test('sync distinctUntilKeyChanged – single value', () => {
    const result = [...pipeSync(
        [{ id: 7, name: "x" }] as User[],
        distinctUntilKeyChanged("id")
    )];
    expect(result).toEqual([{ id: 7, name: "x" }]);
});

test('sync distinctUntilKeyChanged – by name key', () => {
    const result = [...pipeSync(
        [
            { id: 1, name: "ann" },
            { id: 2, name: "ann" },
            { id: 3, name: "bob" },
        ] as User[],
        distinctUntilKeyChanged("name")
    )];

    expect(result).toEqual([
        { id: 1, name: "ann" },
        { id: 3, name: "bob" },
    ]);
});

test('sync distinctUntilKeyChanged – custom comparator on key', () => {
    const result = [...pipeSync(
        [
            { id: 1, name: "A" },
            { id: 2, name: "a" },
            { id: 3, name: "B" },
        ] as User[],
        distinctUntilKeyChanged(
            "name",
            (a, b) => a.toLowerCase() === b.toLowerCase()
        )
    )];

    expect(result).toEqual([
        { id: 1, name: "A" },
        { id: 3, name: "B" },
    ]);
});

test('sync distinctUntilKeyChanged – non-consecutive same key kept', () => {
    const result = [...pipeSync(
        [
            { id: 1, name: "a" },
            { id: 2, name: "b" },
            { id: 1, name: "c" },
        ] as User[],
        distinctUntilKeyChanged("id")
    )];

    expect(result).toEqual([
        { id: 1, name: "a" },
        { id: 2, name: "b" },
        { id: 1, name: "c" },
    ]);
});

// ---------- Async ----------

test('async distinctUntilKeyChanged – basic', async () => {
    async function* source(): AsyncIterable<User> {
        yield { id: 1, name: "a" };
        yield { id: 1, name: "b" };
        yield { id: 2, name: "c" };
    }

    const result = await collectAsync(
        pipeAsync(source(), distinctUntilKeyChanged("id"))
    );

    expect(result).toEqual([
        { id: 1, name: "a" },
        { id: 2, name: "c" },
    ]);
});

test('async distinctUntilKeyChanged – empty', async () => {
    async function* source(): AsyncIterable<User> { }

    const result = await collectAsync(
        pipeAsync(source(), distinctUntilKeyChanged("id"))
    );
    expect(result).toEqual([]);
});

test('async distinctUntilKeyChanged – custom comparator', async () => {
    async function* source(): AsyncIterable<User> {
        yield { id: 1, name: "X" };
        yield { id: 2, name: "x" };
        yield { id: 3, name: "y" };
    }

    const result = await collectAsync(
        pipeAsync(
            source(),
            distinctUntilKeyChanged(
                "name",
                (a, b) => a.toLowerCase() === b.toLowerCase()
            )
        )
    );

    expect(result).toEqual([
        { id: 1, name: "X" },
        { id: 3, name: "y" },
    ]);
});