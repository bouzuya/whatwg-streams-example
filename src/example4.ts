import { EventEmitter } from 'events';
import {
  ReadableStream, TransformStream
} from 'whatwg-streams';

// OUTPUT:
//   rs1.locked (before)  : false
//   rs1.locked (after)   : true
//   rs20.locked (before) : false
//   rs20.locked (after)  : true
//   rs21.locked (before) : false
//   rs22.locked (before) : false
//   rs21.locked (after)  : true
//   rs22.locked (after)  : true
const filter = (f: (a: any) => boolean): TransformStream => {
  return new TransformStream({
    transform(chunk: any, done: () => any, enqueue: (chunk: any) => any): any {
      if (f(chunk)) enqueue(chunk);
      done();
    }
  });
};

const fromEventEmitter = (
  subject: { on: (event: string, listener: Function) => void; }
): ReadableStream => {
  const underlyingSource = {
    start(controller: any): any {
      subject.on('next', (value: any) => {
        controller.enqueue(value);
      });
      subject.on('complete', () => {
        controller.close();
      });
      subject.on('error', (error: any) => {
        controller.error(error);
      });
    }
  };
  const readableStream = new ReadableStream(underlyingSource);
  return readableStream;
};

const example4 = (): void => {
  const subject = new EventEmitter();
  const rs1 = fromEventEmitter(subject);
  console.log(`rs1.locked (before)  : ${rs1.locked}`);
  rs1.pipeThrough(filter((chunk) => chunk % 2 !== 0));
  console.log(`rs1.locked (after)   : ${rs1.locked}`);

  const subject2 = new EventEmitter();
  const rs20 = fromEventEmitter(subject2);
  console.log(`rs20.locked (before) : ${rs20.locked}`);
  const [rs21, rs22] = rs20.tee();
  console.log(`rs20.locked (after)  : ${rs20.locked}`);
  console.log(`rs21.locked (before) : ${rs21.locked}`);
  console.log(`rs22.locked (before) : ${rs22.locked}`);
  rs21.pipeThrough(filter((chunk) => chunk % 2 !== 0));
  rs22.pipeThrough(filter((chunk) => chunk % 2 !== 0));
  console.log(`rs21.locked (after)  : ${rs21.locked}`);
  console.log(`rs22.locked (after)  : ${rs22.locked}`);
};

export { example4 };
