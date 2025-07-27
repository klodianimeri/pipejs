export type PipeIteratorResult<T = any, TReturn = any> = IteratorResult<T, TReturn> | Array<IteratorResult<T, TReturn>>;
export type PipeIterator<T = any, TReturn = any> = (value: IteratorResult<T, TReturn>) => PipeIteratorResult<T, TReturn>;
export type Pipe<T = any, TReturn = any> = () => PipeIterator<T, TReturn>;
