import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { includes } from '../src/pipes/includes';

test('sync includes', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 3, 4, 5]), includes(2));

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(true);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('sync includes no results', () => {
    let pipe = pipeSync(toGeneratorSync([1, 3, 5]), includes(2));

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(false);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async includes', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 3, 4, 5]), includes(2));

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(true);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});

test('async includes no results', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 3, 5]), includes(2));

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(false);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});