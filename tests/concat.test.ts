import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { concat } from '../src/pipes/concat';
test('sync concat', () => {
    let pipe = pipeSync(toGeneratorSync([2]), concat([4, 6]));

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toEqual(2);

    let item1: IteratorResult<any> = iterator.next();

    expect(item1.value).toEqual(4);

    let item2: IteratorResult<any> = iterator.next();

    expect(item2.value).toEqual(6);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async concat', async () => {
    let pipe = pipeAsync(toGeneratorAsync([2]), concat([4, 6]));

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toEqual(2);

    let item1: IteratorResult<any> = await iterator.next();

    expect(item1.value).toEqual(4);

    let item2: IteratorResult<any> = await iterator.next();

    expect(item2.value).toEqual(6);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});