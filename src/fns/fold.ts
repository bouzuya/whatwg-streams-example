import { TransformStream } from 'whatwg-streams';

const fold = (f: (a: any, i: any) => any, s: any): TransformStream => {
  let a = s;
  return new TransformStream({
    start(enqueue) {
      enqueue(a);
    },
    transform(chunk: any, done: () => any, enqueue: (chunk: any) => any): any {
      a = f(a, chunk);
      enqueue(a);
      done();
    }
  });
};

export { fold };
