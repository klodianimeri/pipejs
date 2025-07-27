import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { toSet } from '../src/pipes/to-set';

test('sync toSet', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 3]), toSet());

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect([...item.value]).toEqual([1, 2, 3]);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('sync toSet no results', () => {
    let pipe = pipeSync(toGeneratorSync([]), toSet());

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect([...item.value]).toEqual([])

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async toSet', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 3]), toSet());

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect([...item.value]).toEqual([1, 2, 3]);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});

test('async toSet no results', async () => {
    let pipe = pipeAsync(toGeneratorAsync([]), toSet());

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect([...item.value]).toEqual([])

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});