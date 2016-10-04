import * as assert from 'power-assert';
import * as sinon from 'sinon';
import beater from 'beater';
import { ReadableStream, WritableStream } from 'whatwg-streams';

const { test } = beater();

const category = 'error > ';

test(category + 'error() -> abort()', () => {
  const abort = sinon.spy();
  const rs1 = new ReadableStream({
    start(controller) {
      controller.error(new Error('ERROR!'));
    }
  });
  rs1.pipeTo(new WritableStream({ abort }));
  return new Promise((resolve) => setTimeout(resolve)).then(() => {
    assert(abort.callCount === 1);
    assert(abort.getCall(0).args[0].message === 'ERROR!');
  });
});
