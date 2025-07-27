import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { splice } from '../src/pipes/splice';

test('sync splice', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 3, 4, 5, 6]), splice(1, 3));

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toEqual(1);

    let item1: IteratorResult<any> = iterator.next();

    expect(item1.value).toEqual(5);

    let item2: IteratorResult<any> = iterator.next();

    expect(item2.value).toEqual(6);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('sync splice insert', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 3, 4, 5, 6]), splice(1, 4, 9));

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toEqual(1);

    let item1: IteratorResult<any> = iterator.next();

    expect(item1.value).toEqual(9);

    let item2: IteratorResult<any> = iterator.next();

    expect(item2.value).toEqual(6);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async splice', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 3, 4, 5, 6]), splice(1, 3));

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toEqual(1);

    let item1: IteratorResult<any> = await iterator.next();

    expect(item1.value).toEqual(5);

    let item2: IteratorResult<any> = await iterator.next();

    expect(item2.value).toEqual(6);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});

test('async splice insert', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 3, 4, 5, 6]), splice(1, 4, 9));

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toEqual(1);

    let item1: IteratorResult<any> = await iterator.next();

    expect(item1.value).toEqual(9);

    let item2: IteratorResult<any> = await iterator.next();

    expect(item2.value).toEqual(6);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});