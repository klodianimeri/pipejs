import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { takeWhile } from '../src/pipes/take-while';

test('sync takeWhile', () => {
    let pipe = pipeSync(toGeneratorSync([0, 1, 2, 3]), takeWhile(x => x < 3));

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toEqual(0);

    let item1: IteratorResult<any> = iterator.next();

    expect(item1.value).toEqual(1);

    let item2: IteratorResult<any> = iterator.next();

    expect(item2.value).toEqual(2);

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async takeWhile', async () => {
    let pipe = pipeAsync(toGeneratorAsync([0, 1, 2, 3]), takeWhile(x => x < 3));

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toEqual(0);

    let item1: IteratorResult<any> = await iterator.next();

    expect(item1.value).toEqual(1);

    let item2: IteratorResult<any> = await iterator.next();

    expect(item2.value).toEqual(2);

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});