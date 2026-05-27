import { Injectable } from '@nestjs/common';
import Pusher from 'pusher';

@Injectable()
export class PusherService {
  private readonly client: Pusher | null;
  private readonly channelName = 'admin-notifications';
  private readonly eventName = 'admin-notification';

  constructor() {
    const appId = process.env.PUSHER_APP_ID;
    const key = process.env.PUSHER_KEY;
    const secret = process.env.PUSHER_SECRET;
    const cluster = process.env.PUSHER_CLUSTER;

    this.client = appId && key && secret && cluster
      ? new Pusher({
          appId,
          key,
          secret,
          cluster,
          useTLS: true,
        })
      : null;
  }

  async notifyAdmin(message: string, data: Record<string, unknown> = {}) {
    if (!this.client) return;

    await this.client.trigger(this.channelName, this.eventName, {
      message,
      ...data,
    });
  }
}