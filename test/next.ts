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
    }
  });
  rs1.pipeTo(new WritableStream({ write }));
  return new Promise((resolve) => setTimeout(resolve)).then(() => {
    assert(write.callCount === 1);
    assert(write.getCall(0).args[0] === 123);
  });
});
