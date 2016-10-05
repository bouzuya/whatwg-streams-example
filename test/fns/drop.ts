import * as assert from 'power-assert';
import * as sinon from 'sinon';
import beater from 'beater';
import { ReadableStream, WritableStream } from 'whatwg-streams';
import { drop } from '../../src/fns/drop';

const { test } = beater();

const category = 'fns/drop > ';

test(category + 'drop(2)', () => {
  const close = sinon.spy();
  const write = sinon.spy();
  const rs1 = new ReadableStream({
    start(controller) {
      controller.enqueue(1);
      controller.enqueue(2);
      controller.enqueue(3);
      controller.close();
    }
  });
  rs1
    .pipeThrough(drop(2))
    .pipeTo(new WritableStream({ close, write }));
  return new Promise((resolve) => setTimeout(resolve)).then(() => {
    assert(write.callCount === 1);
    assert(write.getCall(0).args[0] === 3);
    assert(close.callCount === 1);
  });
});
