import { TransformStream } from 'whatwg-streams';

const drop = (n: number): TransformStream => {
  let i = 0;
  return new TransformStream({
    transform(chunk: any, done: () => any, enqueue: (chunk: any) => any): any {
      if (i < n) {
        i += 1;
      } else {
        enqueue(chunk);
      }
      done();
    }
  });
};

export { drop };
