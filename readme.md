# PipeJS

PipeJS provides a convenient and efficient way to work with iterators by providing unified piping functions for both sync and async iterables / generators.

The primary goal of this package is to reduce bundle sizes. Instead of writing separate pipe logic for synchronous and asynchronous code, you can use the same utility (like sum() or map()) for both.

PipeJS is a pull-based library designed to minimize microtask overhead. By using a unified execution loop, it processes async chains with a single await per source item. This architecture avoids the performance bottleneck of deep promise chains, ensuring that even complex pipelines remain fast and efficient.

## Installation

```js
npm i @klodianimeri/pipejs
```

## Sync

Signature

```ts
function* pipeSync(source: Iterable<any>, ...pipes: Array<Pipe>): Iterable<any>
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
async function* pipeAsync(source: AsyncIterable<any>, ...pipes: Array<Pipe>): AsyncIterable<any>
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

## Operators

```ts
at(index: number)
average()
bufferCount(count: number, every?: number)
concat(source: Iterable<any>)
count()
defaultIfEmpty(value: any)
difference(...sources: Array<Iterable<any>>)
distinctUntilChanged(comparator?: (previous: any, current: any) => boolean)
distinctUntilKeyChanged(key: string, comparator?: (previous: any, current: any) => boolean)
distinct(keyselector?: (element: any) => any)
drop(count: number)
elementAt(index: number)
endWith(...elements: Array<any>)
entries()
every(predicate: (element: any, index?: number) => boolean)
fill(value: any, start?: number, end?: number)
filter(predicate: (element: any, index?: number) => boolean)
findIndex(predicate: (element: any, index?: number) => boolean, fromIndex?: number)
findLastIndex(predicate: (element: any, index?: number) => boolean, fromIndex?: number)
findLast(predicate: (element: any, index?: number) => boolean)
find(predicate: (element: any, index?: number) => boolean)
first()
flat(depth?: number) *flats only arrays
ignoreElements()
includes(value: any, fromIndex?: number)
indexOf(value: any, fromIndex?: number)
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
min()
pop()
reduce(accumulator: (accumulator: any, currentValue: any, index?: number) => any, initialValue?: any)
reverse()
scan(accumulator: (accumulator: any, currentValue: any, index?: number) => any, initialValue?: any)
size()
skipLast(count: number)
skip(count: number)
slice(start: number, end?: number)
some(predicate: (element: any, index?: number) => boolean)
splice(start: number, deleteCount: number, ...elements: Array<any>)
startWith(...elements: Array<any>)
sum()
symmetricDifference(...sources: Array<Iterable<any>>)
takeLast(count: number)
takeWhile(predicate: (element: any, index?: number) => boolean, inclusive?: boolean)
take(count: number)
toArray()
toSet()
union(...sources: Array<Iterable<any>>)
values()
```

## Browser

https://unpkg.com/@klodianimeri/pipejs@^2/dist/index.global.js

The global namespace is pipejs:

```js
const { pipeSync } = pipejs;
```