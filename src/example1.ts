import { EventEmitter } from 'events';
import {
  ReadableStream, WritableStream
} from 'whatwg-streams';

// OUTPUT:
//   WritableStream:start
//   WritableStream:write:Hello!
//   WritableStream:write:Hello!!
//   WritableStream:write:Hello!!!
//   WritableStream:close
//   All data successfully written!
const example1 = (): void => {
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
  const writableStream = new WritableStream(underlyingSink);
  readableStream.pipeTo(writableStream)
    .then(() => console.log('All data successfully written!'))
    .catch((e: any) => console.error('Something went wrong!', e));
  subject.emit('next', 'Hello!');
  subject.emit('next', 'Hello!!');
  subject.emit('next', 'Hello!!!');
  subject.emit('complete', 'bye.');
};

export { example1 };
