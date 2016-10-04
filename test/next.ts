import * as assert from 'power-assert';
import * as sinon from 'sinon';
import beater from 'beater';
import { ReadableStream, WritableStream } from 'whatwg-streams';

const { test } = beater();

const category = 'next > ';

test(category + 'enqueue() -> write()', () => {
  const write = sinon.spy();
  const rs1 = new ReadableStream({
    start(controller) {
      controller.enqueue(123);
      controller.enqueue(456);
    }
  });
  rs1.pipeTo(new WritableStream({ write }));
  return new Promise((resolve) => setTimeout(resolve)).then(() => {
    assert(write.callCount === 2);
    assert(write.getCall(0).args[0] === 123);
    assert(write.getCall(1).args[0] === 456);
  });
});
