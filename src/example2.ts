import { EventEmitter } from 'events';
import {
  ReadableStream, TransformStream, WritableStream
} from 'whatwg-streams';

// OUTPUT:
//   WritableStream:start
//   WritableStream:write:2!
//   WritableStream:write:4!
//   WritableStream:write:6!
//   WritableStream:close
const example2 = (): void => {
  const subject = new EventEmitter();
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
  const underlyingSink = {
    start(): any {
      console.log('WritableStream:start');
    },
    write(chunk: any): any {
      console.log(`WritableStream:write:${chunk}`);
    },
    close(): any {
      console.log('WritableStream:close');
    }
  };
  const doubleTransformStream = new TransformStream({
    transform(chunk: any, done: () => any, enqueue: (chunk: any) => any): any {
      enqueue(chunk * 2);
      done();
    }
  });
  const bangTransformStream = new TransformStream({
    transform(chunk: any, done: () => any, enqueue: (chunk: any) => any): any {
      enqueue(chunk + '!');
      done();
    }
  });
  const writableStream = new WritableStream(underlyingSink);
  readableStream
    .pipeThrough(doubleTransformStream)
    .pipeThrough(bangTransformStream)
    .pipeTo(writableStream);
  subject.emit('next', 1);
  subject.emit('next', 2);
  subject.emit('next', 3);
  subject.emit('complete');
};

export { example2 };
