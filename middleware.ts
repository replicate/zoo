import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
  redis: kv,
  // 20 requests from the same IP within a 10 second sliding window
  limiter: Ratelimit.slidingWindow(20, '10s'),
  prefix: `v2/zoo/ratelimit/${process.env.VERCEL_ENV ?? 'local'}`,
});

// Rate limit the /api/predictions/[id] endpoint
export const config = {
  matcher: ['/api/predictions/:path+'],
};

export default async function middleware(request: NextRequest) {
  if (!process.env.VERCEL_ENV || !process.env.KV_REST_API_URL || !process.env.KV_REST_API_URL) {
    console.warn('Skipping ratelimiting middleware');
    return NextResponse.next();
  }

  const ip = request.ip ?? '127.0.0.1';
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);
  const headers = {
    'X-Ratelimit-Hit': String(!success),
    'X-Ratelimit-Limit': String(limit),
    'X-Ratelimit-Remaining': String(remaining),
    'X-Ratelimit-Reset': String(reset),
  }

  return success
    ? NextResponse.next({headers})
    : NextResponse.json({}, { status: 429, headers });
}
