import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test.js";
import { lastIndexOf } from '../pipes/last-index-of.js';

test('sync lastIndexOf', () => {
    let pipe = pipeSync(toGeneratorSync([7, 4, 5, 4, 3]), lastIndexOf(4));

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(3);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('sync lastIndexOf no results', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 3, 5]), lastIndexOf(4));

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(-1);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async lastIndexOf', async () => {
    let pipe = pipeAsync(toGeneratorAsync([7, 4, 5, 4, 3]), lastIndexOf(4));

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(3);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});

test('async lastIndexOf no results', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 3, 5]), lastIndexOf(4));

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(-1);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});