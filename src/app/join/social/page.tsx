'use client';
import './social.scss';
import Header from '@/components/Header/Header';
import { useSession } from 'next-auth/react';
import { JoinInput } from '@/components/Style/JoinInput/JoinInput';
import { MainEventButton } from '@/components/Style/MainEventBtn/MainEventBtn';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LogoTitle from '@/components/LogoTitle/LogoTitle';
import { kakaoAuth, KakaoUser } from '@/util/KakaoAuth';
import userStore from '@/store/userInformation';

export default function Social() {
  const router = useRouter();
  const { status } = useSession();
  const [profile, setProfile] = useState<{
    nickname: string;
    email: string;
  } | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const formattedPhoneNumber = phone
    .replace(/^(\d{3})(\d)/, '$1-$2')
    .replace(/^(\d{3}-\d{4})(\d)/, '$1-$2');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const busy = useRef(false);
  const valid =
    !!profile && name.trim().length > 0 && /^01[016789]\d{7,8}$/.test(phone);

  const finishLogin = (user: KakaoUser) => {
    localStorage.setItem('token', JSON.stringify(user));
    userStore.getState().setUser(user);
    router.replace('/main');
  };

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
        if (result.needsRegistration === true) setProfile(result.profile);
        else {
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

  const handleSubmit = async () => {
    if (!valid || busy.current) return;
    busy.current = true;
    setSubmitting(true);
    setError('');
    try {
      const result = await kakaoAuth('register', {
        name: name.trim(),
        phoneNumber: phone,
      });
      if (result.needsRegistration === false) finishLogin(result.user);
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : '가입에 실패했습니다.',
      );
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div className="social-container">
      <Header title="" type="subMenu" />
      <div className="social-wrap">
        <LogoTitle
          title="회원가입"
          subTitle={
            <p>
              <span>'따름'</span> 회원이 되어 주실래요?
            </p>
          }
        />
        {error && <p role="alert">{error}</p>}
        {!profile ? (
          error ? (
            <Link href="/login">로그인 화면으로 돌아가기</Link>
          ) : (
            <p role="status">카카오 정보를 확인하고 있어요.</p>
          )
        ) : (
          <form
            className="join-form"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <label htmlFor="social-name">이름</label>
            <JoinInput
              id="social-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={45}
              placeholder="이름을 입력해주세요."
              width={345}
            />
            <label htmlFor="social-email">이메일</label>
            <JoinInput
              id="social-email"
              type="email"
              readOnly
              value={profile.email}
              width={345}
            />
            <label htmlFor="social-nickname">닉네임</label>
            <JoinInput
              id="social-nickname"
              readOnly
              value={profile.nickname}
              width={345}
            />
            <label htmlFor="social-phone">휴대전화</label>
            <JoinInput
              id="social-phone"
              type="tel"
              value={formattedPhoneNumber}
              onChange={(event) =>
                setPhone(event.target.value.replace(/\D/g, '').slice(0, 11))
              }
              maxLength={13}
              placeholder="휴대전화 번호를 입력해주세요."
              width={345}
            />
            <MainEventButton
              type="submit"
              $width={345}
              $height={41}
              $color={valid && !submitting ? '#FF6135' : '#D9D9D9'}
              disabled={!valid || submitting}
            >
              {submitting ? '가입 중...' : '회원가입'}
            </MainEventButton>
          </form>
        )}
      </div>
    </div>
  );
}
