'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { kakaoAuth } from '@/util/KakaoAuth';
import userStore from '@/store/userInformation';

export default function KakaoCallback() {
  const { status } = useSession();
  const router = useRouter();
  const [error, setError] = useState('');
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }
    if (status !== 'authenticated') return;
    let cancelled = false;
    kakaoAuth('login')
      .then((result) => {
        if (cancelled) return;
        if (result.needsRegistration === true) {
          router.replace('/join/social');
        } else {
          localStorage.setItem('token', JSON.stringify(result.user));
          userStore.getState().setUser(result.user);
          router.replace('/main');
        }
      })
      .catch((reason) => {
        if (!cancelled) setError(reason.message);
      });
    return () => {
      cancelled = true;
    };
  }, [status, router]);
  return (
    <main style={{ padding: 24 }}>
      {error ? (
        <>
          <p role="alert">{error}</p>
          <Link href="/login">로그인 화면으로 돌아가기</Link>
        </>
      ) : (
        <p role="status">카카오 로그인 정보를 확인하고 있어요.</p>
      )}
    </main>
  );
}
