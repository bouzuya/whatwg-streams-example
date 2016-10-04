import { ReadableStream, WritableStream } from 'whatwg-streams';

const newWS = (prefix: string): WritableStream => {
  return new WritableStream({
    write(chunk) {
      console.log(`${prefix}:${chunk}`);
    }
  });
};
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
const example7 = (): void => {
  const rs1 = new ReadableStream({
    start(controller) {
      setTimeout(() => {
        controller.enqueue(1);
        controller.enqueue(2);
        controller.close();
      });
    }
  });
  const [rs11, rs12] = rs1.tee();
  rs12.pipeTo(newWS('rs12'));
  const [rs111, rs112] = rs11.tee();
  rs111.pipeTo(newWS('rs111'));
  rs112.pipeTo(newWS('rs112'));
};

export { example7 };
