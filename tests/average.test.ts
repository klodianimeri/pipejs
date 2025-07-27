import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { average } from '../src/pipes/average';

test('sync average', () => {
    let pipe = pipeSync(toGeneratorSync([7, 4, 9, 5]), average());

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(6.25);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('sync average no results', () => {
    let pipe = pipeSync(toGeneratorSync([]), average());

    let iterator = pipe[Symbol.iterator]();

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async average', async () => {
    let pipe = pipeAsync(toGeneratorAsync([7, 4, 9, 5]), average());

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(6.25);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});

test('async average no results', async () => {
    let pipe = pipeAsync(toGeneratorAsync([]), average());

    let iterator = pipe[Symbol.asyncIterator]();

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});