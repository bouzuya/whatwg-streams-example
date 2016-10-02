import {
  ReadableStream, WritableStream, Source, Sink
} from 'whatwg-streams';

// OUTPUT:

const newSource = (prefix: string): Source => {
  return {
    start(_controller) {
      console.log(`${prefix}:source:start`);
    },
    pull(_controller) {
      console.log(`${prefix}:source:pull`);
    }
  };
};
const newSink = (): Sink => {
  return {};
};

const delayedReadableStream = (
  source: Source
): Promise<{ rs: ReadableStream; start: Function; }> => {
  const noop = () => void 0;
  const start = typeof source.start === 'undefined' ? noop : source.start;
  const pull = typeof source.pull === 'undefined' ? noop : source.pull;
  const cancel = typeof source.cancel === 'undefined' ? noop : source.cancel;
  return new Promise((resolve) => {
    const rs = new ReadableStream({
      start(controller: any): any {
        return new Promise((startResolve) => {
          setTimeout(() => {
            resolve({
              rs,
              start: () => {
                Promise.resolve(start(controller)).then(startResolve);
              }
            });
          });
        });
      },
      pull(controller: any): any {
        return pull(controller);
      },
      cancel(reason: any): any {
        return cancel(reason);
      }
    });
  });
};

const example5 = (): void => {
  const rs1 = new ReadableStream(newSource('1'));
  rs1.pipeTo(new WritableStream(newSink()));
  console.log('1:ready');

  const rs20 = new ReadableStream(newSource('2'));
  setTimeout(() => {
    rs20.pipeTo(new WritableStream(newSink()));
    console.log('2:ready');
  });

  delayedReadableStream(newSource('3')).then(({ rs, start }) => {
    rs.pipeTo(new WritableStream(newSink()));
    console.log('3:ready');
    start();
  });

  delayedReadableStream(newSource('4')).then(({ rs, start }) => {
    setTimeout(() => {
      rs.pipeTo(new WritableStream(newSink()));
      console.log('4:ready');
      start();
    });
  });
};

export { example5 };
