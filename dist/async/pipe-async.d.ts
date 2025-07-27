import { Pipe } from "../pipe.js";
export declare function pipeAsync(source: AsyncIterable<any, any, unknown>, ...pipes: Array<Pipe>): AsyncIterable<any, any, unknown>;
