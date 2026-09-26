export type KakaoUser = {
  name: string;
  nickname: string;
  imageUrl: string | null;
  phoneNumber: string;
  token: string;
};
export type KakaoResult =
  | { needsRegistration: true; profile: { nickname: string; email: string } }
  | { needsRegistration: false; user: KakaoUser };

export async function kakaoAuth(
  action: 'login' | 'register',
  fields?: { name: string; phoneNumber: string },
): Promise<KakaoResult> {
  const response = await fetch('/api/auth/kakao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...fields }),
    cache: 'no-store',
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || '카카오 로그인에 실패했습니다.');
  return result;
}
