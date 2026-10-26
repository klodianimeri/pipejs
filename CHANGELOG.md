# Changelog

## [3.0.0]

### Rewrite

Major rewrite of the pull engine and operators to **close the gap with IxJS on sync throughput** while preserving strong **async** performance. Full operator set still builds to ~**26 KB** minified (ESM / CJS / IIFE, ES6).

There **may be breaking changes** in semantics, names, and error behavior — review the lists below before upgrading.

---

### Removed

| Operator  | Migration |
|-----------|-----------|
| `at`      | Use `elementAt` |
| `drop`    | Use `skip` |
| `concat` (old module) | Use `concatWith` / `concatAll` / `concatMap` |

---

### Added

**Flatten / higher-order:** `concatAll`, `concatMap`, `flatMap`, `mergeAll`, `mergeWith`, `switchAll`, `switchMap`, `expand`, `exhaustAll` / `exhaustMap` (and async variants where applicable)

**Combine:** `zipWith`, `combineLatestWith`, `withLatestFrom`, `forkJoin`, `pairwise`, `startWith` (behavior fixed), `concatWith`

**Time / rate limit:** `delay`, `delayEach`, `timeout`, `debounce`, `debounceTime`, `throttle`, `throttleTime`, `sample`, `sampleTime`, `buffer`, `bufferTime`, `timeStamp`, `timeInterval`

**Error handling:** `catchError`, `ignoreErrors`, `retry`, `tryCatch`, `throwIfEmpty`

**Query / sets / joins:** `except`, `groupBy`, `groupJoin`, `innerJoin`, `sequenceEqual`, `orderBy`, `orderByDescending`

**Misc:** `memoize`, `repeat`, `single`, `skipWhile`, `skipUntil`, `takeUntil`, `tap`, `toMap`

---

### Breaking / behavior notes

- **`single`** — throws when the sequence is empty or has more than one match (no longer soft-fails the same way as before).
- **`slice`** — Array-style `[start, end)` (end exclusive).
- **Source errors** — throws from the source iterable while pulling are **not** handled by `catchError` / `retry` / `tryCatch`; only operator-chain `ErrorControl` is.
- **Flattening** — sync `flatMap` is sequential; concurrent merge is async (`flatMapAsync` / `mergeAll`). Use `concatMap*` when order must be preserved.
- Time-based operators are **pull-deferred** (decide on next pull / `DONE`), not scheduler-driven like Rx.

---

### Performance

- **Sync:** targeted rewrite to match IxJS-class speed on large drains; competitive on streaming, often ahead on terminals and set ops.
- **Async:** remains substantially faster than IxJS in typical benches (often 4–10×+).

---

### Migration (short)

1. `drop(n)` → `skip(n)` · `at(i)` → `elementAt(i)` · old `concat` → `concatWith` / `concatAll`.
2. Re-verify `slice`, `single`, and any code that assumed source throws were catchable mid-pipe.
3. For sequential async flatten, prefer `concatMapAsync` over concurrent `flatMapAsync`.