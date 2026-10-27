# PipeJS

**Pull-based sync & async pipelines for TypeScript / JavaScript.**

PipeJS provides a convenient and efficient way to work with iterators by providing unified piping functions for both sync and async iterables / generators.

The primary goal of this package is to reduce bundle sizes. Instead of writing separate pipe logic for synchronous and asynchronous code, you can use the same utility (like sum() or map()) for both.

PipeJS is a pull-based library designed to minimize microtask overhead. By using a unified execution loop, it processes async chains with a single await per source item. This architecture avoids the performance bottleneck of deep promise chains, ensuring that even complex pipelines remain fast and efficient.

## Why PipeJS?

- **Pull, not push** — consumers drive iteration; natural backpressure, no subscription lifecycle
- **One API for sync & async** — `pipeSync` / `pipeAsync` + matching operators
- **Tiny** — ~26 KB minified for the full operator set
- **Fast async** — deep async pipelines typically **4–10×** faster than IxJS on large drains
- **Competitive sync** — strong on terminals, filters, and set operations vs IxJS

Inspired by IxJS / RxJS operator names, implemented for native `Iterable` / `AsyncIterable`


## Installation

```js
npm i @klodianimeri/pipejs
```

## Sync

Signature

```ts
function pipeSync(source: Iterable<any>, ...pipes: Array<Pipe>): Iterable<any>
```

Usage

```js
import { pipeSync, filter, sum } from '@klodianimeri/pipejs';

let numbers = [...Array(100000).keys()];

let results = pipeSync(numbers,
    filter(x => x % 2 === 0),
    sum()
);

for (let item of results) {
    console.log(`Sum:`, item);
}
```

## Async

Signature

```ts
async function pipeAsync(source: AsyncIterable<any>, ...pipes: Array<Pipe>): AsyncIterable<any>
```

Usage

```js
import { pipeAsync, filter, sum } from '@klodianimeri/pipejs';

async function* asyncRange(from, to) {
    for (let i = from; i < to; i++) {
        yield i;
    }
}

let results = pipeAsync(asyncRange(0, 100000),
    filter(x => x % 2 === 0),
    sum()
);

for await (let item of results) {
    console.log(`Sum:`, item);
}
```

# Performance (summary)

Benchmarks vs IxJS on large drains (performance.now(), Node):

## Async (~500k items)

PipeJS leads on nearly every operator — typically 4–10× faster on streaming and terminals; larger gaps on flatMap, distinct, and set operations.

## Sync (~5M items)

Ahead on many terminals (sum, count, reduce, toArray, …) and set ops (distinct, union)
Competitive on filter-heavy chains
Ix still faster on some hot paths (map alone, concat, pairwise) — under active optimization

Native map → filter remains the baseline; PipeJS aims to stay within a small multiple of that cost while remaining composable.Numbers vary by machine and Ix version.


## Operators

```ts
average()
bufferCount(count: number, every?: number)
bufferTime(interval: number)
buffer(notifier: AsyncIterable<any>)
catchError(handler: (error: unknown) => any)
combineLatestWith(...others: { [K in keyof R]: AsyncIterable<R[K]> })
concatAll()
concatAllAsync()
concatMap(project: (value: I, index: number) => Iterable<any>)
concatMapAsync(project: (value: I, index: number) => AsyncIterable<any>)
concatWith(...sources: Iterable<any>[])
concatWithAsync(...sources: AsyncIterable<any>[])
count()
debounceTime(dueTime: number)
debounce(durationSelector: (value: any) => number)
defaultIfEmpty(value: any)
delayEach(ms: number)
delay(ms: number)
difference(...sources: Array<Iterable<any>>)
distinctUntilChanged(comparator?: (previous: I, current: I) => boolean)
distinctUntilKeyChanged(key: K, comparator?: (previous: I[K], current: I[K]) => boolean)
distinct(keySelector?: (value: I) => K)
elementAt(index: number)
endWith(...elements: Array<any>)
entries()
every(predicate: (element: any, index: number) => boolean)
except(second: Iterable<I>, keySelector?: (value: I) => any)
expand(project: (value: T, index: number) => Iterable<T> | null | undefined)
expandAsync(project: (value: T, index: number) => AsyncIterable<T> | Promise<AsyncIterable<T>> | null | undefined)
fill(value: any, start?: number, end?: number)
filter(predicate: (element: any, index?: number) => boolean)
findIndex(predicate: (element: any, index?: number) => boolean, fromIndex?: number)
findLastIndex(predicate: (element: any, index?: number) => boolean, fromIndex?: number)
findLast(predicate: (element: any, index?: number) => boolean)
find(predicate: (element: any, index?: number) => boolean)
first()
flatMap(selector: (value: I, index: number) => Iterable<O>)
flatMapAsync(selector: (value: I, index: number) => AsyncIterable<O>)
flat(depth?: number)
forkJoin(...sources: AsyncIterable<any>[])
groupBy(keySelector: (value: I) => K, elementSelector?: (value: I) => V)
groupJoin(inner: Iterable<TInner>, outerKeySelector: (value: I) => TKey, innerKeySelector: (value: TInner) => TKey, resultSelector: (outer: I, innerArgs: Iterable<TInner>) => TResult)
ignoreElements()
ignoreErrors()
includes(value: I, fromIndex?: number)
indexOf(value: I, fromIndex?: number)
innerJoin(inner: Iterable<TInner>, outerKeySelector: (value: I) => TKey, innerKeySelector: (value: TInner) => TKey, resultSelector: (outer: I, inner: TInner) => TResult)
intersection(...sources: Array<Iterable<any>>)
isDisjointFrom(...sources: Array<Iterable<any>>)
isEmpty()
isSubsetOf(...sources: Array<Iterable<any>>)
isSupersetOf(...sources: Array<Iterable<any>>)
keys()
lastIndexOf(value: any, fromIndex?: number)
last()
mapTo(value: any)
map(callbackFn: (element: any, index?: number) => any)
max()
memoize()
mergeAll()
mergeWith(...sources: Array<AsyncIterable<any>>)
min()
orderByDescending(keySelector: (item: I) => K, comparer?: (a: K, b: K) => number)
orderBy(keySelector: (item: I) => K, comparer?: (a: K, b: K) => number)
pairwise()
pop()
reduce(accumulator: (acc: T, currentValue: I, index: number) => T, initialValue?: T)
repeat(count?: number)
retry(count: number = Infinity)
reverse()
sampleTime(period: number)
sample(notifier: AsyncIterable<any>)
scan(accumulator: (acc: T, currentValue: I, index: number) => T, initialValue?: T)
sequenceEqual(other: Iterable<R>, comparer?: (first: T, second: R) => boolean)
sequenceEqualAsync(other: AsyncIterable<R>, comparer?: (first: T, second: R) => boolean)
single(predicate?: (value: T, index: number))
size()
skipLast(count: number)
skipUntil(notifier: () => Promise<any>)
skipWhile(predicate: (element: I, index: number) => boolean)
skip(count: number)
slice(start: number, end?: number)
some(predicate: (element: I, index: number) => boolean)
splice(start: number, deleteCount: number, ...elements: Array<T>)
startWith(...elements: Array<any>)
sum()
switchAll()
switchMap(project: (value: T, index: number) => AsyncIterable<R>)
symmetricDifference(...sources: Array<Iterable<any>>)
takeLast(count: number)
takeUntil(notifier: () => Promise<any>)
takeWhile(predicate: (element: I, index: number) => boolean)
take(count: number)
tap(observer: TapObserver<T> | ((value: T) => void))
throttleTime(dueTime: number)
throttle(durationSelector: (value: I) => AsyncIterable<any>)
timeInterval()
timeStamp()
timeout(interval: number)
toArray()
toMap(keySelector: (item: TSource) => TKey,valueSelector?: (item: TSource) => TValue)
toSet()
tryCatch()
union(...sources: Array<Iterable<any>>)
values()
withLatestFrom(...others: { [K in keyof R]: AsyncIterable<R[K]> })
zipWith(other: Iterable<TZip>, resultSelector?: (sourceItem: I, zippedItem: TZip) => TResult)
zipWithAsync(other: AsyncIterable<TZip>, resultSelector?: (sourceItem: I, zippedItem: TZip) => TResult)
```

## Error handling example

```ts
import { pipeSync, map, tryCatch, catchError } from '@klodianimeri/pipejs';

const result = [...pipeSync(
  [1, 2, 3],
  map(x => {
    if (x === 2) throw new Error("boom");
    return x;
  }),
  catchError(() => -1)
)];
// → [1, -1, 3]
```

*Source errors (throws from the iterable while it’s being pulled) propagate out of pipeSync / pipeAsync as normal exceptions — they are not turned into ErrorControl and are not handled by catchError, retry, or tryCatch.


## Browser

https://unpkg.com/@klodianimeri/pipejs@^3/dist/index.global.js

The global namespace is pipejs:

```js
const { pipeSync } = pipejs;
```

## Build

| Build                         |   Size (min) |
|-------------------------------|--------------|
| **IIFE** `index.global.js`    | **25.46 KB** |
| **ESM** `index.js`            | **25.99 KB** |
| **CJS** `index.cjs`           | **26.05 KB** |

Target: **ES6** · Zero runtime dependencies · Full TypeScript types