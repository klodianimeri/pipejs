import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { some } from '../src/pipes/some';

test('sync some', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 9, 3]), some(x => x > 7));

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(true);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('sync some no results', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 3, 4]), some(x => x > 7));

    let iterator = pipe[Symbol.iterator]();

    let item: IteratorResult<any> = iterator.next();

    expect(item.value).toBe(false);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async some', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 9, 3]), some(x => x > 7));

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(true);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});

test('async some no results', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 3, 4]), some(x => x > 7));

    let iterator = pipe[Symbol.asyncIterator]();

    let item: IteratorResult<any> = await iterator.next();

    expect(item.value).toBe(false);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});