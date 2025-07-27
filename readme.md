# PipeJS

This package aims to unify piping functions for both sync and async generators. Ex: same sum() pipe that can be used for both generators. 

The idea is to reduce the bundle sizes that comes from writing twice the same pipe to be used for sync and async code.

## Installation

```js
npm i @klodianimeri/pipejs
```

## Sync

Signature: function* pipeSync(source: Iterable<any, any, unknown>, ...pipes: Array<Pipe>): Iterable<any, any, unknown>

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

Signature: async function* pipeAsync(source: AsyncIterable<any, any, unknown>, ...pipes: Array<Pipe>): AsyncIterable<any, any, unknown>

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

for (let item of results) {
    console.log(`Sum:`, item);
}
```

## Pipes

```ts
at(index: number)
average()
bufferCount(count: number, every?: number)
concat(source: Iterable<any, any, unknown>)
count()
defaultIfEmpty(value: any)
difference(source: Iterable<any, any, unknown>)
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
intersection(source: Iterable<any, any, unknown>)
isDisjointFrom(source: Iterable<any, any, unknown>)
isEmpty()
isSubsetOf(source: Iterable<any, any, unknown>)
isSupersetOf(source: Iterable<any, any, unknown>)
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
symmetricDifference(source: Iterable<any, any, unknown>)
takeLast(count: number)
takeWhile(predicate: (element: any, inclusive?: number) => boolean, inclusive?: boolean)
take(count: number)
toArray()
toSet()
union(source: Iterable<any, any, unknown>)
values()
```

## Browser

https://unpkg.com/@klodianimeri/pipejs@^1/

The global namespace is pipejs:

```js
const { pipeSync } = pipejs;
```

## Build Statistics

```
    5.04 kB: index.cjs.gz
    4.59 kB: index.cjs.br
    3.36 kB: index.modern.js.gz
    3.08 kB: index.modern.js.br
    5.26 kB: index.module.js.gz
    4.83 kB: index.module.js.br
    5.08 kB: index.umd.js.gz
    4.64 kB: index.umd.js.br
 ```