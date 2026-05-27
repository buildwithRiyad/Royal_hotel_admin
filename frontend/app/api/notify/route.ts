import { NextResponse } from 'next/server';
import { getPusherServer } from '@/lib/pusher-server';

type NotifyRequestBody = {
  userId?: number;
  message: string;
  type?: 'success' | 'error' | 'loading' | 'default';
  channel?: 'global_info' | 'user';
};

export async function POST(req: Request) {
  const body = (await req.json()) as NotifyRequestBody;

  if (!body.message) {
    return NextResponse.json({ success: false, message: 'message is required' }, { status: 400 });
  }

  const pusher = getPusherServer();

  if (body.channel === 'global_info') {
    await pusher.trigger('global_info', 'global_info', {
      message: body.message,
      type: body.type ?? 'default',
    });

    return NextResponse.json({ success: true, channel: 'global_info' });
  }

  if (!body.userId) {
    return NextResponse.json({ success: false, message: 'userId is required' }, { status: 400 });
  }

  await pusher.trigger(`notifications-${body.userId}`, 'notification', {
    message: body.message,
    type: body.type ?? 'success',
  });

  return NextResponse.json({ success: true, channel: `notifications-${body.userId}` });
}
