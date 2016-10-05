import { TransformStream } from 'whatwg-streams';

const filter = (f: (a: any) => boolean): TransformStream => {
  return new TransformStream({
    transform(chunk: any, done: () => any, enqueue: (chunk: any) => any): any {
      if (f(chunk)) enqueue(chunk);
      done();
    }
  });
};

export { filter };
