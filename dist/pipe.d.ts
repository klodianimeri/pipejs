export declare const IS_ASYNC_OPERATOR: unique symbol;
export declare const DONE: unique symbol;
export declare const BREAK: unique symbol;
export declare class CONTINUE {
}
export type PipeControl = CONTINUE | typeof BREAK | typeof DONE;
export type PipeArgument<T = unknown> = T | CONTINUE | typeof DONE;
export declare class PipeResults<T = unknown> {
    #private;
    constructor(results?: Array<T | PipeControl>);
    get(index: number): T | PipeControl;
    set(index: number, value: T | PipeControl): void;
    push(value: T | PipeControl): void;
    singleOrDefault(): T | PipeResult<T>;
    [Symbol.iterator](): Generator<T | PipeControl>;
}
export type PipeResult<T = unknown> = T | PipeControl | PipeResults<T>;
export type Pipe<In = unknown, Out = unknown> = (value: PipeArgument<In>) => PipeResult<Out>;
export type Operator<In = unknown, Out = unknown> = <NextOut = unknown>(next: Pipe<Out, NextOut>) => Pipe<In, NextOut>;
export declare class ErrorControl extends CONTINUE {
    #private;
    constructor(err: Error | any);
    get error(): Error | any;
}
export declare function start<T>(next: Pipe<T, any>): (element: T) => PipeResult;
export declare function terminal<T>(item: PipeResult<T>): PipeResult<T>;
export declare function done<In = unknown, Out = unknown>(next: Pipe<In, Out>, item: PipeArgument<In>): PipeResult<Out>;
export declare function forward<In = unknown, Out = unknown>(next: Pipe<In, Out>, items: Iterable<PipeArgument<In>>): PipeResult<Out>;
export declare function forwardAnd<In = unknown, Out = unknown>(next: Pipe<In, Out>, items: Iterable<PipeArgument<In>>, last: PipeArgument<In>): PipeResult<Out>;
export declare function forwardAsync<In = unknown, Out = unknown>(next: Pipe<In, Out>, items: AsyncIterable<PipeArgument<In>>): Promise<PipeResult<Out>>;
export declare function forwardAndAsync<In = unknown, Out = unknown>(next: Pipe<In, Out>, items: AsyncIterable<PipeArgument<In>>, last: PipeArgument<In>): Promise<PipeResult<Out>>;
