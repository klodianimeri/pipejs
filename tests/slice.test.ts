import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { slice } from '../src/pipes/slice';

test('sync slice', () => {
    let pipe = pipeSync(toGeneratorSync([1, 2, 3, 4, 5, 6]), slice(1, 4));

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toEqual(2);

    let item1: IteratorResult<any> = iterator.next();

    expect(item1.value).toEqual(3);

    let item2: IteratorResult<any> = iterator.next();

    expect(item2.value).toEqual(4);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async slice', async () => {
    let pipe = pipeAsync(toGeneratorAsync([1, 2, 3, 4, 5, 6]), slice(1, 4));

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toEqual(2);

    let item1: IteratorResult<any> = await iterator.next();

    expect(item1.value).toEqual(3);

    let item2: IteratorResult<any> = await iterator.next();

    expect(item2.value).toEqual(4);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});