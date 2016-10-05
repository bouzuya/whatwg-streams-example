import * as assert from 'power-assert';
import * as sinon from 'sinon';
import beater from 'beater';
import { ReadableStream, WritableStream } from 'whatwg-streams';
import { filter } from '../../src/fns/filter';

const { test } = beater();

const category = 'fns/filter > ';

test(category + 'filter((i) => i % 2 === 0)', () => {
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
    .pipeThrough(filter((i) => i % 2 === 0))
    .pipeTo(new WritableStream({ close, write }));
  return new Promise((resolve) => setTimeout(resolve)).then(() => {
    assert(write.callCount === 1);
    assert(write.getCall(0).args[0] === 2);
    assert(close.callCount === 1);
  });
});
