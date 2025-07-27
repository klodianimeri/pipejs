import { pipeSync } from "../src/sync/pipe-sync";
import { pipeAsync } from "../src/async/pipe-async";
import { sequenceSync, sequenceAsync } from "./sequence.test";
import { elementAt } from '../src/pipes/element-at';


test('sync elementAt empty', () => {
    let pipe = pipeSync(sequenceSync(0, 0), elementAt(0));

    let iterator = pipe[Symbol.iterator]();

    let res: IteratorResult<any> = iterator.next();

    expect(res.value).toBeUndefined();
});

test('sync elementAt first index', () => {
    let pipe = pipeSync(sequenceSync(0, 5), elementAt(0));

    let iterator = pipe[Symbol.iterator]();

    let res: IteratorResult<any> = iterator.next();

    expect(res.value).toBe(0);
});

test('sync elementAt some index', () => {
    let pipe = pipeSync(sequenceSync(0, 5), elementAt(1));

    let iterator = pipe[Symbol.iterator]();

    let res: IteratorResult<any> = iterator.next();

    expect(res.value).toBe(1);
});

test('sync elementAt invalid index', () => {
    let pipe = pipeSync(sequenceSync(0, 5), elementAt(30));

    let iterator = pipe[Symbol.iterator]();

    let res: IteratorResult<any> = iterator.next();

    expect(res.value).toBeUndefined();
});

test('async elementAt empty index 0 undefined', async () => {
    let pipe = pipeAsync(sequenceAsync(0, 0), elementAt(0));

    let iterator = pipe[Symbol.asyncIterator]();

    let res: IteratorResult<any> = await iterator.next();

    expect(res.value).toBeUndefined();
});

test('async elementAt first index', async () => {
    let pipe = pipeAsync(sequenceAsync(0, 5), elementAt(0));

    let iterator = pipe[Symbol.asyncIterator]();

    let res: IteratorResult<any> = await iterator.next();

    expect(res.value).toBe(0);
});

test('async elementAt some index', async () => {
    let pipe = pipeAsync(sequenceAsync(0, 5), elementAt(1));

    let iterator = pipe[Symbol.asyncIterator]();

    let res: IteratorResult<any> = await iterator.next();

    expect(res.value).toBe(1);
});

test('async elementAt invalid index', async () => {
    let pipe = pipeAsync(sequenceAsync(0, 5), elementAt(30));

    let iterator = pipe[Symbol.asyncIterator]();

    let res: IteratorResult<any> = await iterator.next();

    expect(res.value).toBeUndefined();
});
