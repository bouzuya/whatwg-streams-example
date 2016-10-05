import * as assert from 'power-assert';
import * as sinon from 'sinon';
import beater from 'beater';
import { ReadableStream, WritableStream } from 'whatwg-streams';
import { fold } from '../../src/fns/fold';

const { test } = beater();

const category = 'fns/fold > ';

test(category + 'fold((a, i) => a + i, 3)', () => {
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
    .pipeThrough(fold((a, i) => a + i, 3))
    .pipeTo(new WritableStream({ close, write }));
  return new Promise((resolve) => setTimeout(resolve)).then(() => {
    assert(write.callCount === 4);
    assert(write.getCall(0).args[0] === 3);
    assert(write.getCall(1).args[0] === 4);
    assert(write.getCall(2).args[0] === 6);
    assert(write.getCall(3).args[0] === 9);
    assert(close.callCount === 1);
  });
});
