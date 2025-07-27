import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { isEmpty } from '../src/pipes/is-empty';

test('sync isEmpty', () => {
    let pipe = pipeSync(toGeneratorSync([1]), isEmpty());

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(false);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('sync isEmpty no results', () => {
    let pipe = pipeSync(toGeneratorSync([]), isEmpty());

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(true);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async isEmpty', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1]), isEmpty());

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(false);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});

test('async isEmpty no results', async () => {
    let pipe = pipeAsync(toGeneratorAsync([]), isEmpty());

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(true);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});