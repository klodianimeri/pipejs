import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test";
import { find } from '../src/pipes/find';

test('sync find', () => {
    let pipe = pipeSync(toGeneratorSync([{ a: 5 }, { a: 5 }, { a: 6 }, { a: 5 }]), find(x => x.a === 6));

    let iterator = pipe[Symbol.iterator]();

    let item0: IteratorResult<any> = iterator.next();

    expect(item0.value).toEqual({ a: 6 });

    let done: IteratorResult<any> = iterator.next();

    expect(done.value).toBeUndefined();
});

test('async find', async () => {
    let pipe = pipeAsync(toGeneratorAsync([{ a: 5 }, { a: 5 }, { a: 6 }, { a: 5 }]), find(x => x.a === 6));

    let iterator = pipe[Symbol.asyncIterator]();

    let item0: IteratorResult<any> = await iterator.next();

    expect(item0.value).toEqual({ a: 6 });

    let done: IteratorResult<any> = await iterator.next();

    expect(done.value).toBeUndefined();
});