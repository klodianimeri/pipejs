import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";
import { ignoreErrors } from '../pipes/ignore-errors.js'; // adjust path if needed
import { map } from '../pipes/map.js';
import { CONTINUE, DONE, BREAK, ErrorControl } from '../pipe.js';

// ---------- Sync ----------

test('sync ignoreErrors – no error, values pass through', () => {
    const pipe = pipeSync(
        sequenceSync(0, 5),
        map(x => x * 10),
        ignoreErrors()
    );

    const iterator = pipe[Symbol.iterator]();

    expect(iterator.next().value).toBe(0);
    expect(iterator.next().value).toBe(10);
    expect(iterator.next().value).toBe(20);
    expect(iterator.next().value).toBe(30);
    expect(iterator.next().value).toBe(40);
    expect(iterator.next().done).toBe(true);
});

test('sync ignoreErrors – skips the failing element', () => {
    const pipe = pipeSync(
        sequenceSync(0, 5),
        map(x => {
            if (x === 2) throw new Error('boom');
            return x * 10;
        }),
        ignoreErrors()
    );

    const iterator = pipe[Symbol.iterator]();

    expect(iterator.next().value).toBe(0);
    expect(iterator.next().value).toBe(10);
    // 2 is skipped
    expect(iterator.next().value).toBe(30);
    expect(iterator.next().value).toBe(40);
    expect(iterator.next().done).toBe(true);
});

test('sync ignoreErrors – multiple errors are all skipped', () => {
    const pipe = pipeSync(
        sequenceSync(0, 6),
        map(x => {
            if (x === 1 || x === 3 || x === 5) throw new Error('boom');
            return x * 10;
        }),
        ignoreErrors()
    );

    const iterator = pipe[Symbol.iterator]();

    expect(iterator.next().value).toBe(0);
    expect(iterator.next().value).toBe(20);
    expect(iterator.next().value).toBe(40);
    expect(iterator.next().done).toBe(true);
});

test('sync ignoreErrors – empty source', () => {
    const pipe = pipeSync(
        sequenceSync(0, 0),
        map(x => { throw new Error('should never run'); }),
        ignoreErrors()
    );

    const iterator = pipe[Symbol.iterator]();
    expect(iterator.next().done).toBe(true);
});

test('sync ignoreErrors – error on first element', () => {
    const pipe = pipeSync(
        sequenceSync(0, 4),
        map(x => {
            if (x === 0) throw new Error('boom');
            return x * 10;
        }),
        ignoreErrors()
    );

    const iterator = pipe[Symbol.iterator]();

    expect(iterator.next().value).toBe(10);
    expect(iterator.next().value).toBe(20);
    expect(iterator.next().value).toBe(30);
    expect(iterator.next().done).toBe(true);
});

test('sync ignoreErrors – error on last element', () => {
    const pipe = pipeSync(
        sequenceSync(0, 4),
        map(x => {
            if (x === 3) throw new Error('boom');
            return x * 10;
        }),
        ignoreErrors()
    );

    const iterator = pipe[Symbol.iterator]();

    expect(iterator.next().value).toBe(0);
    expect(iterator.next().value).toBe(10);
    expect(iterator.next().value).toBe(20);
    expect(iterator.next().done).toBe(true);
});

// ---------- Async ----------

test('async ignoreErrors – no error, values pass through', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        map(x => x * 10),
        ignoreErrors()
    );

    const iterator = pipe[Symbol.asyncIterator]();

    expect((await iterator.next()).value).toBe(0);
    expect((await iterator.next()).value).toBe(10);
    expect((await iterator.next()).value).toBe(20);
    expect((await iterator.next()).value).toBe(30);
    expect((await iterator.next()).value).toBe(40);
    expect((await iterator.next()).done).toBe(true);
});

test('async ignoreErrors – skips the failing element', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        map(x => {
            if (x === 2) throw new Error('boom');
            return x * 10;
        }),
        ignoreErrors()
    );

    const iterator = pipe[Symbol.asyncIterator]();

    expect((await iterator.next()).value).toBe(0);
    expect((await iterator.next()).value).toBe(10);
    expect((await iterator.next()).value).toBe(30);
    expect((await iterator.next()).value).toBe(40);
    expect((await iterator.next()).done).toBe(true);
});

test('async ignoreErrors – multiple errors are all skipped', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 6),
        map(x => {
            if (x === 1 || x === 3 || x === 5) throw new Error('boom');
            return x * 10;
        }),
        ignoreErrors()
    );

    const iterator = pipe[Symbol.asyncIterator]();

    expect((await iterator.next()).value).toBe(0);
    expect((await iterator.next()).value).toBe(20);
    expect((await iterator.next()).value).toBe(40);
    expect((await iterator.next()).done).toBe(true);
});

test('async ignoreErrors – empty source', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 0),
        map(x => { throw new Error('should never run'); }),
        ignoreErrors()
    );

    const iterator = pipe[Symbol.asyncIterator]();
    expect((await iterator.next()).done).toBe(true);
});

test('async ignoreErrors – error on first element', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 4),
        map(x => {
            if (x === 0) throw new Error('boom');
            return x * 10;
        }),
        ignoreErrors()
    );

    const iterator = pipe[Symbol.asyncIterator]();

    expect((await iterator.next()).value).toBe(10);
    expect((await iterator.next()).value).toBe(20);
    expect((await iterator.next()).value).toBe(30);
    expect((await iterator.next()).done).toBe(true);
});

test('async ignoreErrors – error on last element', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 4),
        map(x => {
            if (x === 3) throw new Error('boom');
            return x * 10;
        }),
        ignoreErrors()
    );

    const iterator = pipe[Symbol.asyncIterator]();

    expect((await iterator.next()).value).toBe(0);
    expect((await iterator.next()).value).toBe(10);
    expect((await iterator.next()).value).toBe(20);
    expect((await iterator.next()).done).toBe(true);
});