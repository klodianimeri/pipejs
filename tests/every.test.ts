import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { every } from '../src/pipes/every';

test('sync every true', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 6]), every(x => x < 10));

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(true);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('sync every valse', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 6, 12]), every(x => x < 10));

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(false);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async every true', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 6]), every(x => x < 10));

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(true);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});

test('async every valse', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 6, 12]), every(x => x < 10));

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(false);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});