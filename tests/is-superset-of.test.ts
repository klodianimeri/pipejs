import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { isSupersetOf } from '../src/pipes/is-superset-of';

test('sync isSupersetOf', () => {
    let pipe = pipeSync(toGeneratorSync([8, 9, 7]), isSupersetOf(toGeneratorSync([8, 9])));

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(true);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('sync isSupersetOf false', () => {
    let pipe = pipeSync(toGeneratorSync([8, 9, 7]), isSupersetOf(toGeneratorSync([8, 9, 10])));

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(false);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async isSupersetOf', async () => {
    let pipe = pipeAsync(toGeneratorAsync([8, 9, 7]), isSupersetOf(toGeneratorSync([8, 9])));

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toEqual(true);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});

test('async isSupersetOf false', async () => {
    let pipe = pipeAsync(toGeneratorAsync([8, 9, 7]), isSupersetOf(toGeneratorSync([8, 9, 10])));

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toEqual(false);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});