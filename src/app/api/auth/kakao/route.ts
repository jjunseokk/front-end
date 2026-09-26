import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== new URL(request.url).origin)
    return NextResponse.json(
      { message: '허용되지 않은 요청입니다.' },
      { status: 403 },
    );
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (
    !token?.kakaoAccessToken ||
    (typeof token.kakaoExpiresAt === 'number' &&
      token.kakaoExpiresAt * 1000 <= Date.now())
  )
    return NextResponse.json(
      { message: '카카오 로그인을 다시 진행해주세요.' },
      { status: 401 },
    );
  let input;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json(
      { message: '올바른 요청이 필요합니다.' },
      { status: 400 },
    );
  }
  if (!input || !['login', 'register'].includes(input.action))
    return NextResponse.json(
      { message: '올바른 요청이 필요합니다.' },
      { status: 400 },
    );
  try {
    const base = (
      process.env.BACKEND_API_URL || 'http://localhost:8080/api'
    ).replace(/\/$/, '');
    const response = await fetch(base + '/auth/kakao/' + input.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: token.kakaoAccessToken,
        ...(input.action === 'register'
          ? { name: input.name, phoneNumber: input.phoneNumber }
          : {}),
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });
    const data = await response.json();
    return NextResponse.json(data, {
      status: response.status,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json(
      {
        message: '로그인 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
      },
      { status: 502 },
    );
  }
}
