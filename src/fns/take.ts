import { TransformStream } from 'whatwg-streams';

const take = (n: number): TransformStream => {
  let i = 0;
  return new TransformStream({
    transform(
      chunk: any,
      done: () => any,
      enqueue: (chunk: any) => any,
      close: () => void
    ): any {
      i += 1;
      if (i <= n) {
        enqueue(chunk);
        done();
      } else {
        close();
      }
    }
  });
};

export { take };
