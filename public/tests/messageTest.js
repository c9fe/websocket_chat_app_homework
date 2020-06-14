import {sleep} from './helpers.js';

export default async function run() {
  const TOTAL = 100;
  const MESSAGE_CONTENT = 'Hello there you have a wonderful beautiful day.'
  let received = 0;
  let resolve;

  console.log('Running message tests');

  const testSocket = new WebSocket(`ws://${location.host}`);

  const p = new Promise(res => resolve = res);

  testSocket.onmessage = m => {
    m = JSON.parse(m.data);
    if( m.message == MESSAGE_CONTENT ) {
      received++;
      if ( received == TOTAL ) {
        resolve();
      }
    }
  };

  console.log(`Sending ${TOTAL} messages...`);

  testSocket.onopen = async () => {
    // add new members
    for( let i = 0; i < TOTAL; i++ ) {
      newMessage(); 
      await sleep(10);
    }
  };

  await Promise.race([sleep(10000), p]);

  testSocket.close();

  await sleep(1000);

  console.assert(received == TOTAL, `Expected ${TOTAL} messages, but ${received} received.`);

  console.log('Completed message tests');


  return received == TOTAL;

  function newMessage() {
    testSocket.send(JSON.stringify({message:MESSAGE_CONTENT}));
  }
}