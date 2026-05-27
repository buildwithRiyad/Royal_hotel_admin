import Pusher from 'pusher-js';

let pusher: Pusher | null = null;

export const getPusherClient = () => {
  if (!pusher && typeof window !== 'undefined') {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!key || !cluster) {
      return null;
    }

    pusher = new Pusher(key, {
      cluster,
      forceTLS: true,
    });
  }
  return pusher;
};
