const Pusher = require('pusher');
require('dotenv').config();

const appId = process.env.PUSHER_APP_ID;
const key = process.env.PUSHER_KEY;
const secret = process.env.PUSHER_SECRET;
const cluster = process.env.PUSHER_CLUSTER;

if (!appId || !key || !secret || !cluster) {
  console.error('Missing PUSHER_* env vars. Fill .env or export them.');
  process.exit(1);
}

const pusher = new Pusher({
  appId,
  key,
  secret,
  cluster,
  useTLS: true,
});

const channelName = 'admin-notifications';
const eventName = 'admin-notification';
const message = process.argv.slice(2).join(' ') || 'admin notification test';
const payload = {
  message,
  type: 'dev.test.admin_notification',
  ts: new Date().toISOString(),
};

pusher.trigger(channelName, eventName, payload, (err) => {
  if (err) {
    console.error('Trigger error:', err);
    process.exit(1);
  }
  console.log(`Triggered ${eventName} on ${channelName}:`, payload);
  process.exit(0);
});
