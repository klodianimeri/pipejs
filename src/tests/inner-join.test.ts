import { pipeSync } from "../sync/pipe-sync.js";
import { pipeAsync } from "../async/pipe-async.js";
import { toGeneratorSync, toGeneratorAsync } from "./sequence.test.js";
import { innerJoin } from '../pipes/inner-join.js'; // Assuming this file location

test('sync innerJoin with empty inner collection yields nothing', () => {
    const outerData = [{ id: 1, name: 'Task A' }, { id: 2, name: 'Task B' }];
    const innerData: Array<{ taskId: number; comment: string }> = [];

    let pipe = pipeSync(
        toGeneratorSync(outerData),
        innerJoin(
            innerData,
            (task) => task.id,
            (comment) => comment.taskId,
            (task, comment) => ({ title: task.name, comment: comment.comment })
        )
    );

    let iterator = pipe[Symbol.iterator]();
    let done = iterator.next();
    expect(done.done).toBe(true);
    expect(done.value).toBeUndefined();
});

test('sync innerJoin books with authors (removes unmatched, flattens multiples)', () => {
    const books = [
        { title: 'The Hobbit', authorId: 1 },
        { title: 'Murder on the Orient Express', authorId: 2 },
        { title: 'The Old Man and the Sea', authorId: 4 } // No matching author, will be filtered out
    ];
    const authors = [
        { id: 1, name: 'J.R.R. Tolkien' },
        { id: 1, name: 'Tolkien Co-Author' }, // Multiple matches, will cause 'The Hobbit' to yield twice
        { id: 2, name: 'Agatha Christie' },
        { id: 3, name: 'Stephen King' }
    ];

    let pipe = pipeSync(
        toGeneratorSync(books),
        innerJoin(
            authors,
            (book) => book.authorId,
            (author) => author.id,
            (book, author) => ({ bookTitle: book.title, authorName: author.name })
        )
    );

    let iterator = pipe[Symbol.iterator]();

    // First match for Tolkien
    expect(iterator.next().value).toEqual({ bookTitle: 'The Hobbit', authorName: 'J.R.R. Tolkien' });
    // Second match for Tolkien (one-to-many explosion)
    expect(iterator.next().value).toEqual({ bookTitle: 'The Hobbit', authorName: 'Tolkien Co-Author' });
    // Match for Agatha Christie
    expect(iterator.next().value).toEqual({ bookTitle: 'Murder on the Orient Express', authorName: 'Agatha Christie' });

    // 'The Old Man and the Sea' is skipped completely, so next is completion
    let done = iterator.next();
    expect(done.done).toBe(true);
    expect(done.value).toBeUndefined();
});

test('sync innerJoin with empty outer stream', () => {
    const outerData: Array<{ id: number; name: string }> = [];
    const innerData = [{ id: 1, details: 'Valid Detail' }];

    let pipe = pipeSync(
        toGeneratorSync(outerData),
        innerJoin(
            innerData,
            (outer) => outer.id,
            (inner) => inner.id,
            (outer, inner) => ({ outer, inner })
        )
    );

    let iterator = pipe[Symbol.iterator]();
    let done = iterator.next();
    expect(done.done).toBe(true);
    expect(done.value).toBeUndefined();
});

test('async innerJoin with empty inner collection yields nothing', async () => {
    const outerData = [{ id: 1, name: 'Task A' }, { id: 2, name: 'Task B' }];
    const innerData: Array<{ taskId: number; comment: string }> = [];

    let pipe = pipeAsync(
        toGeneratorAsync(outerData),
        innerJoin(
            innerData,
            (task) => task.id,
            (comment) => comment.taskId,
            (task, comment) => ({ title: task.name, comment: comment.comment })
        )
    );

    let iterator = pipe[Symbol.asyncIterator]();
    let done = await iterator.next();
    expect(done.done).toBe(true);
    expect(done.value).toBeUndefined();
});

test('async innerJoin books with authors', async () => {
    const books = [
        { title: 'The Hobbit', authorId: 1 },
        { title: 'Murder on the Orient Express', authorId: 2 },
        { title: 'The Old Man and the Sea', authorId: 4 }
    ];
    const authors = [
        { id: 1, name: 'J.R.R. Tolkien' },
        { id: 1, name: 'Tolkien Co-Author' },
        { id: 2, name: 'Agatha Christie' }
    ];

    let pipe = pipeAsync(
        toGeneratorAsync(books),
        innerJoin(
            authors,
            (book) => book.authorId,
            (author) => author.id,
            (book, author) => ({ bookTitle: book.title, authorName: author.name })
        )
    );

    let iterator = pipe[Symbol.asyncIterator]();

    expect((await iterator.next()).value).toEqual({ bookTitle: 'The Hobbit', authorName: 'J.R.R. Tolkien' });
    expect((await iterator.next()).value).toEqual({ bookTitle: 'The Hobbit', authorName: 'Tolkien Co-Author' });
    expect((await iterator.next()).value).toEqual({ bookTitle: 'Murder on the Orient Express', authorName: 'Agatha Christie' });

    let done = await iterator.next();
    expect(done.done).toBe(true);
    expect(done.value).toBeUndefined();
});

test('async innerJoin with empty outer stream', async () => {
    const outerData: Array<{ id: number; name: string }> = [];
    const innerData = [{ id: 1, details: 'Valid Detail' }];

    let pipe = pipeAsync(
        toGeneratorAsync(outerData),
        innerJoin(
            innerData,
            (outer) => outer.id,
            (inner) => inner.id,
            (outer, inner) => ({ outer, inner })
        )
    );

    let iterator = pipe[Symbol.asyncIterator]();
    let done = await iterator.next();
    expect(done.done).toBe(true);
    expect(done.value).toBeUndefined();
});
