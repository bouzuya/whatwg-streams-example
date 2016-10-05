import * as assert from 'power-assert';
import * as sinon from 'sinon';
import beater from 'beater';
import { ReadableStream, WritableStream } from 'whatwg-streams';
import { take } from '../../src/fns/take';

const { test } = beater();

const category = 'fns/take > ';

test(category + 'take(2)', () => {
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
    .pipeThrough(take(2))
    .pipeTo(new WritableStream({ close, write }));
  return new Promise((resolve) => setTimeout(resolve)).then(() => {
    assert(write.callCount === 2);
    assert(write.getCall(0).args[0] === 1);
    assert(write.getCall(1).args[0] === 2);
    assert(close.callCount === 1);
  });
});
