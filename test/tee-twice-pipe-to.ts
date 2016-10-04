import * as assert from 'power-assert';
import * as sinon from 'sinon';
import beater from 'beater';
import { ReadableStream, WritableStream } from 'whatwg-streams';

const { test } = beater();

const category = 'tee-twice-pipe-to > ';

test(category + 'tee() and then tee() and pipeTo()', () => {
  const rs12write = sinon.spy();
  const rs111write = sinon.spy();
  const rs112write = sinon.spy();
  const rs1 = new ReadableStream({
    start(controller) {
      controller.enqueue('chunk1');
      controller.close();
    }
  });
  const [rs11, rs12] = rs1.tee();
  rs12.pipeTo(new WritableStream({ write: rs12write }));
  const [rs111, rs112] = rs11.tee();
  rs111.pipeTo(new WritableStream({ write: rs111write }));
  rs112.pipeTo(new WritableStream({ write: rs112write }));
  return new Promise((resolve) => {
    setTimeout(() => resolve());
  }).then(() => {
    assert(rs1.locked === true);
    assert(rs11.locked === true);
    assert(rs12write.callCount === 1);
    assert(rs12write.getCall(0).args[0] === 'chunk1');
    assert(rs111write.callCount === 1);
    assert(rs111write.getCall(0).args[0] === 'chunk1');
    assert(rs112write.callCount === 1);
    assert(rs112write.getCall(0).args[0] === 'chunk1');
  });
});
