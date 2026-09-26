'use client';
import Header from '@/components/Header/Header';
import './login.scss';

import LoginImg from '../../../public/login.svg';
import LoginLogo from '../../../public/loginLogo.svg';
import kakaoBtn from '../../../public/kakaoBtn.svg';
import naverBtn from '../../../public/naverBtn.svg';
import googleBtn from '../../../public/googleBtn.svg';
import Image from 'next/image';
import { MainEventButton } from '@/components/Style/MainEventBtn/MainEventBtn';
import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LogoTitle from '@/components/LogoTitle/LogoTitle';
import { showLogin } from '@/util/AxiosMember';
import { useMutation } from '@tanstack/react-query';
import { ILogin } from '@/types/common';

export default function Login() {
  const [userId, setUserId] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  const [warning, setWarning] = useState<string>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: (loginData: ILogin) => showLogin(loginData),
    onSuccess: (res) => {
      window.localStorage.setItem('token', JSON.stringify(res.data));
      router.push('/main');
    },
    onError: (error: any) => {
      window.localStorage.clear();
      setWarning(error.response.data.message);
    },
  });

  const handleSubmit = () => {
    if (userId && userPassword) {
      loginMutation.mutate({
        loginId: userId,
        password: userPassword,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="login-container">
      <Header type="subMenu" title="" />
      <div className="login-wrap">
        <LogoTitle
          title="img"
          subTitle={
            <p>
              와인 어디서 사지? 고민될 땐<br />
              <span>와인 커머스 '따름'</span>
            </p>
          }
        />
        <input
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
          }}
          onKeyDown={handleKeyPress}
          type="text"
          placeholder="아이디를 입력해주세요."
        />
        <input
          value={userPassword}
          onChange={(e) => {
            setUserPassword(e.target.value);
          }}
          onKeyDown={handleKeyPress}
          type="password"
          placeholder="비밀번호를 입력해주세요."
        />
        {warning ? <p className="warningText">{warning}</p> : null}
        <MainEventButton
          onClick={handleSubmit}
          $width={345}
          $height={41}
          $color={userId && userPassword ? '#FF6135' : '#D9D9D9'}
          disabled={userId && userPassword ? false : true}
        >
          로그인
        </MainEventButton>
        <div className="subBtn">
          <p onClick={() => router.push('/findId')}>아이디 찾기</p>
          <p onClick={() => router.push('/findPassword')}>비밀번호 찾기</p>
          <p
            onClick={() => {
              router.push('/join');
            }}
          >
            회원가입
          </p>
        </div>
        <div className="social-login">
          <p>SNS계정으로 간편하게 로그인하기</p>
          <div>
            <Image
              src={kakaoBtn}
              onClick={() => {
                signIn('kakao', { callbackUrl: '/auth/kakao' });
              }}
              alt="kakao"
            />
            {/* <Image src={naverBtn} alt="naver" /> */}
            {/* <Image src={googleBtn} alt="google" /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
