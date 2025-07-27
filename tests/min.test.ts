import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { min } from '../src/pipes/min';

test('sync min', () => {
    let pipe = pipeSync(toGeneratorSync([7, 4, 9, 5]), min());

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(4);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('sync min no results', () => {
    let pipe = pipeSync(toGeneratorSync([]), min());

    let iterator = pipe[Symbol.iterator]();

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async min', async () => {
    let pipe = pipeAsync(toGeneratorAsync([7, 4, 9, 5]), min());

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(4);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});

test('async min no results', async () => {
    let pipe = pipeAsync(toGeneratorAsync([]), min());

    let iterator = pipe[Symbol.asyncIterator]();

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});