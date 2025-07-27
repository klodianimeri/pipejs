import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { max } from '../src/pipes/max';

test('sync max', () => {
    let pipe = pipeSync(toGeneratorSync([7, 4, 9, 5]), max());

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(9);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('sync max no results', () => {
    let pipe = pipeSync(toGeneratorSync([]), max());

    let iterator = pipe[Symbol.iterator]();

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async max', async () => {
    let pipe = pipeAsync(toGeneratorAsync([7, 4, 9, 5]), max());

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(9);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});

test('async max no results', async () => {
    let pipe = pipeAsync(toGeneratorAsync([]), max());

    let iterator = pipe[Symbol.asyncIterator]();

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});