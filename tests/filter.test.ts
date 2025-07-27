import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { filter } from '../src/pipes/filter';

test('sync filter', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 3, 4, 5]), filter(x => x % 2 === 0));

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(2);

    let item2: IteratorResult<any> = iterator.next();

    expect(item2.value).toEqual(4);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('sync filter no results', () => {
    let pipe = pipeSync(toGeneratorSync([1, 3, 5]), filter(x => x % 2 === 0));

    let iterator = pipe[Symbol.iterator]();

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async filter', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 3, 4, 5]), filter(x => x % 2 === 0));

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(2);

    let item2: IteratorResult<any> = await iterator.next();

    expect(item2.value).toBe(4);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});

test('async filter no results', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 3, 5]), filter(x => x % 2 === 0));

    let iterator = pipe[Symbol.asyncIterator]();

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});