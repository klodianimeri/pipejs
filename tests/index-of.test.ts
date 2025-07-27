import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { indexOf } from '../src/pipes/index-of';

test('sync indexOf', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 3, 4, 5]), indexOf(2));

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(1);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('sync indexOf no results', () => {
    let pipe = pipeSync(toGeneratorSync([1, 3, 5]), indexOf(2));

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(-1);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async indexOf', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 3, 4, 5]), indexOf(2));

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(1);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});

test('async indexOf no results', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 3, 5]), indexOf(2));

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(-1);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});