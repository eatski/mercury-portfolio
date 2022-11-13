export class Loader<K extends string | number, R extends Record<K, unknown>> {
  private stack: { key: K; resolve: (res: R) => void }[] = [];
  constructor(private readonly read: (keys: Set<K>) => Promise<R>) {}
  async load(key: K): Promise<R[K]> {
    return new Promise<R>((resolve, reject) => {
      this.stack.push({ key, resolve });
      setTimeout(() => {
        if (this.stack.length) {
          const stack = this.stack;
          this.stack = [];
          this.read(new Set(stack.map((item) => item.key)))
            .then((res) => {
              stack.forEach((item) => item.resolve(res));
            })
            .catch(reject);
        }
      }, 0);
    }).then((res) => res[key]);
  }
}
