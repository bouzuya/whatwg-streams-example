import { EventEmitter } from 'events';
import {
  ReadableStream, TransformStream, WritableStream
} from 'whatwg-streams';

// OUTPUT:
//   WritableStream:start
//   WritableStream:write:1
//   WritableStream:write:9
//   WritableStream:write:25
//   WritableStream:close

const filter = (f: (a: any) => boolean): TransformStream => {
  return new TransformStream({
    transform(chunk: any, done: () => any, enqueue: (chunk: any) => any): any {
      if (f(chunk)) enqueue(chunk);
      done();
    }
  });
};

const map = (f: (a: any) => any): TransformStream => {
  return new TransformStream({
    transform(chunk: any, done: () => any, enqueue: (chunk: any) => any): any {
      enqueue(f(chunk));
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

const toConsole = (): WritableStream => {
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
  const writableStream = new WritableStream(underlyingSink);
  return writableStream;
};

const example3 = (): void => {
  const subject = new EventEmitter();
  const readableStream = fromEventEmitter(subject);
  const writableStream = toConsole();
  readableStream
    .pipeThrough(filter((chunk) => chunk % 2 !== 0))
    .pipeThrough(map((chunk) => chunk * chunk))
    .pipeTo(writableStream);
  [1, 2, 3, 4, 5].forEach((i) => {
    subject.emit('next', i);
  });
  subject.emit('complete');
};

export { example3 };
