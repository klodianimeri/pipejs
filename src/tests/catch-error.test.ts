import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { sequenceSync, sequenceAsync } from "./sequence.test.js";
import { catchError } from '../pipes/catch-error.js';
import { map } from '../pipes/map.js';          // ← adjust if your map lives elsewhere
import { CONTINUE, DONE, BREAK, ErrorControl } from '../pipe.js';

// ---------- Sync ----------

test('sync catchError – no error, values pass through', () => {
    const pipe = pipeSync(
        sequenceSync(0, 5),
        map(x => x * 10),
        catchError(() => 999)
    );

    const iterator = pipe[Symbol.iterator]();

    expect(iterator.next().value).toBe(0);
    expect(iterator.next().value).toBe(10);
    expect(iterator.next().value).toBe(20);
    expect(iterator.next().value).toBe(30);
    expect(iterator.next().value).toBe(40);
    expect(iterator.next().done).toBe(true);
});

test('sync catchError – recovers with a replacement value', () => {
    const pipe = pipeSync(
        sequenceSync(0, 5),
        map(x => {
            if (x === 2) throw new Error('boom');
            return x * 10;
        }),
        catchError(() => 999)
    );

    const iterator = pipe[Symbol.iterator]();

    expect(iterator.next().value).toBe(0);
    expect(iterator.next().value).toBe(10);
    expect(iterator.next().value).toBe(999);   // recovered
    expect(iterator.next().value).toBe(30);
    expect(iterator.next().value).toBe(40);
    expect(iterator.next().done).toBe(true);
});

test('sync catchError – recovers with CONTINUE (skips the element)', () => {
    const pipe = pipeSync(
        sequenceSync(0, 5),
        map(x => {
            if (x === 2) throw new Error('boom');
            return x * 10;
        }),
        catchError(() => new CONTINUE())
    );

    const iterator = pipe[Symbol.iterator]();

    expect(iterator.next().value).toBe(0);
    expect(iterator.next().value).toBe(10);
    // 2 is skipped
    expect(iterator.next().value).toBe(30);
    expect(iterator.next().value).toBe(40);
    expect(iterator.next().done).toBe(true);
});

test('sync catchError – recovers with DONE (stops the pipeline)', () => {
    const pipe = pipeSync(
        sequenceSync(0, 5),
        map(x => {
            if (x === 2) throw new Error('boom');
            return x * 10;
        }),
        catchError(() => DONE)
    );

    const iterator = pipe[Symbol.iterator]();

    expect(iterator.next().value).toBe(0);
    expect(iterator.next().value).toBe(10);
    expect(iterator.next().done).toBe(true);   // stopped after recovery
});

test('sync catchError – recovers with BREAK (same as CONTINUE for this collector)', () => {
    const pipe = pipeSync(
        sequenceSync(0, 5),
        map(x => {
            if (x === 2) throw new Error('boom');
            return x * 10;
        }),
        catchError(() => BREAK)
    );

    const iterator = pipe[Symbol.iterator]();

    expect(iterator.next().value).toBe(0);
    expect(iterator.next().value).toBe(10);
    expect(iterator.next().value).toBe(30);
    expect(iterator.next().value).toBe(40);
    expect(iterator.next().done).toBe(true);
});

test('sync catchError – re-throws when handler returns ErrorControl', () => {
    const pipe = pipeSync(
        sequenceSync(0, 5),
        map(x => {
            if (x === 2) throw new Error('boom');
            return x * 10;
        }),
        catchError(err => {
            return new ErrorControl(err)
        })
    );

    const iterator = pipe[Symbol.iterator]();

    expect(iterator.next().value).toBe(0);
    expect(iterator.next().value).toBe(10);

    expect(() => iterator.next()).toThrow('boom');
});

test('sync catchError – empty source', () => {
    const pipe = pipeSync(
        sequenceSync(0, 0),
        map(x => { throw new Error('should never run'); }),
        catchError(() => 999)
    );

    const iterator = pipe[Symbol.iterator]();
    expect(iterator.next().done).toBe(true);
});

// ---------- Async ----------

test('async catchError – no error, values pass through', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        map(x => x * 10),
        catchError(() => 999)
    );

    const iterator = pipe[Symbol.asyncIterator]();

    expect((await iterator.next()).value).toBe(0);
    expect((await iterator.next()).value).toBe(10);
    expect((await iterator.next()).value).toBe(20);
    expect((await iterator.next()).value).toBe(30);
    expect((await iterator.next()).value).toBe(40);
    expect((await iterator.next()).done).toBe(true);
});

test('async catchError – recovers with a replacement value', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        map(x => {
            if (x === 2) throw new Error('boom');
            return x * 10;
        }),
        catchError(() => 999)
    );

    const iterator = pipe[Symbol.asyncIterator]();

    expect((await iterator.next()).value).toBe(0);
    expect((await iterator.next()).value).toBe(10);
    expect((await iterator.next()).value).toBe(999);
    expect((await iterator.next()).value).toBe(30);
    expect((await iterator.next()).value).toBe(40);
    expect((await iterator.next()).done).toBe(true);
});

test('async catchError – recovers with CONTINUE (skips the element)', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        map(x => {
            if (x === 2) throw new Error('boom');
            return x * 10;
        }),
        catchError(() => new CONTINUE())
    );

    const iterator = pipe[Symbol.asyncIterator]();

    expect((await iterator.next()).value).toBe(0);
    expect((await iterator.next()).value).toBe(10);
    expect((await iterator.next()).value).toBe(30);
    expect((await iterator.next()).value).toBe(40);
    expect((await iterator.next()).done).toBe(true);
});

test('async catchError – recovers with DONE (stops the pipeline)', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        map(x => {
            if (x === 2) throw new Error('boom');
            return x * 10;
        }),
        catchError(() => DONE)
    );

    const iterator = pipe[Symbol.asyncIterator]();

    expect((await iterator.next()).value).toBe(0);
    expect((await iterator.next()).value).toBe(10);
    expect((await iterator.next()).done).toBe(true);
});

test('async catchError – re-throws when handler returns ErrorControl', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 5),
        map(x => {
            if (x === 2) throw new Error('boom');
            return x * 10;
        }),
        catchError(err => new ErrorControl(err))
    );

    const iterator = pipe[Symbol.asyncIterator]();

    expect((await iterator.next()).value).toBe(0);
    expect((await iterator.next()).value).toBe(10);

    await expect(iterator.next()).rejects.toThrow('boom');
});

test('async catchError – empty source', async () => {
    const pipe = pipeAsync(
        sequenceAsync(0, 0),
        map(x => { throw new Error('should never run'); }),
        catchError(() => 999)
    );

    const iterator = pipe[Symbol.asyncIterator]();
    expect((await iterator.next()).done).toBe(true);
});