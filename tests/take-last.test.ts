import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { takeLast } from '../src/pipes/take-last';

test('sync takeLast', () => {
    let pipe = pipeSync(toGeneratorSync([0, 1, 2, 3]), takeLast(2));

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toEqual(2);

    let item1: IteratorResult<any> = iterator.next();

    expect(item1.value).toEqual(3);


    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async takeLast', async () => {
    let pipe = pipeAsync(toGeneratorAsync([0, 1, 2, 3]), takeLast(2));

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toEqual(2);

    let item1: IteratorResult<any> = await iterator.next();

    expect(item1.value).toEqual(3);


    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});