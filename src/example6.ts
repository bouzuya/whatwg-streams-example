import { ReadableStream } from 'whatwg-streams';

// OUTPUT:
//   rs1.locked = false
//   const [rs11, rs12] = rs1.tee();
//   rs1.locked = true
//   rs11.locked = false
//   rs12.locked = false
//   const [rs111, rs112] = rs11.tee();
//   rs11.locked = true
//   rs12.locked = false
//   rs111.locked = false
//   rs112.locked = false
const example6 = (): void => {
  const rs1 = new ReadableStream();
  console.log(`rs1.locked = ${rs1.locked}`);
  console.log('const [rs11, rs12] = rs1.tee();');
  const [rs11, rs12] = rs1.tee();
  console.log(`rs1.locked = ${rs1.locked}`);
  console.log(`rs11.locked = ${rs11.locked}`);
  console.log(`rs12.locked = ${rs12.locked}`);
  console.log('const [rs111, rs112] = rs11.tee();');
  const [rs111, rs112] = rs11.tee();
  console.log(`rs11.locked = ${rs11.locked}`);
  console.log(`rs12.locked = ${rs12.locked}`);
  console.log(`rs111.locked = ${rs111.locked}`);
  console.log(`rs112.locked = ${rs112.locked}`);
};

export { example6 };
