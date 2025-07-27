import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { sequenceSync, sequenceAsync } from "./sequence.test";
import { at } from '../src/pipes/at';

test('sync at empty index 0 undefined', () => {
    let pipe = pipeSync(sequenceSync(0, 0), at(0));

    let iterator = pipe[Symbol.iterator]();

    let res: IteratorResult<any> = iterator.next();

    expect(res.value).toBeUndefined();
});

test('sync at first index', () => {
    let pipe = pipeSync(sequenceSync(0, 5), at(0));

    let iterator = pipe[Symbol.iterator]();

    let res: IteratorResult<any> = iterator.next();

    expect(res.value).toBe(0);
});

test('sync at some index', () => {
    let pipe = pipeSync(sequenceSync(0, 5), at(1));

    let iterator = pipe[Symbol.iterator]();

    let res: IteratorResult<any> = iterator.next();

    expect(res.value).toBe(1);
});

test('sync at invalid index', () => {
    let pipe = pipeSync(sequenceSync(0, 5), at(30));

    let iterator = pipe[Symbol.iterator]();

    let res: IteratorResult<any> = iterator.next();

    expect(res.value).toBeUndefined();
});

test('async at empty index 0 undefined', async () => {
    let pipe = pipeAsync(sequenceAsync(0, 0), at(0));

    let iterator = pipe[Symbol.asyncIterator]();

    let res: IteratorResult<any> = await iterator.next();

    expect(res.value).toBeUndefined();
});

test('async at first index', async () => {
    let pipe = pipeAsync(sequenceAsync(0, 5), at(0));

    let iterator = pipe[Symbol.asyncIterator]();

    let res: IteratorResult<any> = await iterator.next();

    expect(res.value).toBe(0);
});

test('async at some index', async () => {
    let pipe = pipeAsync(sequenceAsync(0, 5), at(1));

    let iterator = pipe[Symbol.asyncIterator]();

    let res: IteratorResult<any> = await iterator.next();

    expect(res.value).toBe(1);
});

test('async at invalid index', async () => {
    let pipe = pipeAsync(sequenceAsync(0, 5), at(30));

    let iterator = pipe[Symbol.asyncIterator]();

    let res: IteratorResult<any> = await iterator.next();

    expect(res.value).toBeUndefined();
});
