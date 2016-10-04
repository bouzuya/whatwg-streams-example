import * as assert from 'power-assert';
import * as sinon from 'sinon';
import beater from 'beater';
import { ReadableStream, WritableStream } from 'whatwg-streams';

const { test } = beater();

const category = 'complete > ';

test(category + 'close() > close()', () => {
  const close = sinon.spy();
  const rs1 = new ReadableStream({
    start(controller) {
      controller.close();
    }
  });
  rs1.pipeTo(new WritableStream({ close }));
  return new Promise((resolve) => setTimeout(resolve)).then(() => {
    assert(close.callCount === 1);
  });
});
