import { Pipe } from "../pipe.js";
export declare function distinctUntilKeyChanged(key: string, comparator?: (previous: any, current: any) => boolean): Pipe;
