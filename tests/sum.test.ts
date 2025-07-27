import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { sum } from '../src/pipes/sum';

test('sync sum', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 3]), sum());

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(6);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('sync sum no results', () => {
    let pipe = pipeSync(toGeneratorSync([]), sum());

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(0);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async sum', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 3]), sum());

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(6);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});

test('async sum no results', async () => {
    let pipe = pipeAsync(toGeneratorAsync([]), sum());

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(0);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});