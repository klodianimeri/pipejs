
export type PipeIteratorResult<T = any, TReturn = any> = IteratorResult<T, TReturn> | Array<IteratorResult<T, TReturn>> | undefined;

export type PipeIterator<I = any, T = any, TReturn = any> = (value: IteratorResult<I, TReturn>) => PipeIteratorResult<T, TReturn>;

export type Pipe<I = any, T = I, TReturn = any> = () => PipeIterator<I, T, TReturn>;