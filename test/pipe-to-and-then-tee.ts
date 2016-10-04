import * as assert from 'power-assert';
import beater from 'beater';
import { ReadableStream, WritableStream } from 'whatwg-streams';

const { test } = beater();

const category = 'pipe-to-and-then-tee > ';

test(category + 'pipeTo()', () => {
  const rs1 = new ReadableStream();
  assert(rs1.locked === false);
  rs1.pipeTo(new WritableStream());
  assert(rs1.locked === true);
});

test(category + 'tee()', () => {
  const rs1 = new ReadableStream();
  assert(rs1.locked === false);
  rs1.tee();
  assert(rs1.locked === true);
});

test(category + 'pipeTo() and then tee()', () => {
  assert.throws(() => {
    const rs1 = new ReadableStream();
    assert(rs1.locked === false);
    rs1.pipeTo(new WritableStream());
    assert(rs1.locked === true);
    rs1.tee(); // throws Error
  }, /This stream has already been locked/);
});
