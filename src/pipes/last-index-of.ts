import { findLastIndex } from "./find-last-index.js";

export const lastIndexOf = (value: any, fromIndex?: number) => findLastIndex((element) => element === value, fromIndex);