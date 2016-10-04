import * as assert from 'power-assert';
import beater from 'beater';
import { ReadableStream } from 'whatwg-streams';

const { test } = beater();

const category = 'tee-twice > ';

test(category + 'tee()', () => {
  const rs1 = new ReadableStream();
  assert(rs1.locked === false);
  rs1.tee();
  assert(rs1.locked === true);
});

test(category + 'tee() and then tee()', () => {
  const rs1 = new ReadableStream();
  assert(rs1.locked === false);
  const [rs11, rs12] = rs1.tee();
  assert(rs1.locked === true);
  assert(rs11.locked === false);
  assert(rs12.locked === false);
  const [rs111, rs112] = rs11.tee();
  assert(rs1.locked === true);
  assert(rs11.locked === true);
  assert(rs12.locked === false);
  assert(rs111.locked === false);
  assert(rs112.locked === false);
});
