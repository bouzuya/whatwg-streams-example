import * as assert from 'power-assert';
import * as sinon from 'sinon';
import beater from 'beater';
import { ReadableStream, WritableStream } from 'whatwg-streams';
import { merge } from '../../src/fns/merge';

const { test } = beater();

const category = 'fns/merge > ';

test(category + 'merge(rs1, rs2)', () => {
  const close = sinon.spy();
  const write = sinon.spy();
  const rs1 = new ReadableStream({
    start(controller) {
      setTimeout(() => controller.enqueue(1), 1);
      setTimeout(() => controller.enqueue(2), 2);
      setTimeout(() => controller.enqueue(3), 3);
      setTimeout(() => controller.close(), 4);
    }
  });
  const rs2 = new ReadableStream({
    start(controller) {
      setTimeout(() => controller.enqueue(4), 5);
      setTimeout(() => controller.enqueue(5), 6);
      setTimeout(() => controller.enqueue(6), 7);
      setTimeout(() => controller.close(), 8);
    }
  });
  merge(rs1, rs2).pipeTo(new WritableStream({ close, write }));
  return new Promise((resolve) => setTimeout(resolve, 10)).then(() => {
    assert(write.callCount === 6);
    assert(write.getCall(0).args[0] === 1);
    assert(write.getCall(1).args[0] === 2);
    assert(write.getCall(2).args[0] === 3);
    assert(write.getCall(3).args[0] === 4);
    assert(write.getCall(4).args[0] === 5);
    assert(write.getCall(5).args[0] === 6);
    assert(close.callCount === 1);
  });
});
