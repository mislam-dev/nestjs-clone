export interface ITransformer<TInput, TOutput> {
  transform(data: TInput): TOutput | Promise<TOutput>;
}
