/* eslint-disable @typescript-eslint/no-require-imports */
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

(async () => {
  try {
    await pusher.trigger('tsting', 'testing', { message: 'Test from script' });
    console.log('testing event sent');
  } catch (err) {
    console.error('failed to send testing event', err);
    process.exitCode = 1;
  }
})();
