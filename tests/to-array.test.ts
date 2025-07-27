import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { toArray } from '../src/pipes/to-array';

test('sync toArray', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 3]), toArray());

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toEqual([1, 2, 3]);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('sync toArray no results', () => {
    let pipe = pipeSync(toGeneratorSync([]), toArray());

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toEqual([])

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async toArray', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 3]), toArray());

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toEqual([1, 2, 3]);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});

test('async toArray no results', async () => {
    let pipe = pipeAsync(toGeneratorAsync([]), toArray());

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toEqual([])

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});