import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { findLast } from '../src/pipes/find-last';

test('sync findLast', () => {
    let pipe = pipeSync(toGeneratorSync([{ a: 6 }, { a: 5 }, { a: 6, b: 0 }, { a: 5 }]), findLast(x => x.a === 6));

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toEqual({ a: 6, b: 0 });

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async findLast', async () => {
    let pipe = pipeAsync(toGeneratorAsync([{ a: 6 }, { a: 5 }, { a: 6, b: 0 }, { a: 5 }]), findLast(x => x.a === 6));

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toEqual({ a: 6, b: 0 });

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});