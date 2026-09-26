'use client';

import './Write.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useRef, useState } from 'react';
import Header from '../Header/Header';
import useInput from '@/hooks/useInput';
import Checkbox from '../Checkbox/Checkbox';

import { inquiries } from '@/util/Axiosinquiry';
import { IInquiry } from '@/types/common';
import userStore from '@/store/userInformation';
import { useMutation } from '@tanstack/react-query';

export default function Write({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle, titleChange] = useInput();
  const [content, setContent] = useState<string>('');
  const [sendAsk, setSendAsk] = useState<boolean>(false);
  const [secret, setSecret] = useState<boolean>(false);
  const { user }: any = userStore();
  const Token = user?.token;

  const contentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 1000) return;

    setContent(e.target.value);
  };

  const sendInquiresMutation = useMutation({
    mutationFn: (inquiryRequest: IInquiry) => inquiries(inquiryRequest, Token),
    onSuccess: (res) => {
      setSendAsk(true);
    },
  });

  const sendWriteAsk = (bool: boolean) => {
    const inquiry: IInquiry = {
      title,
      content,
      itemId: params.itemId,
      secret,
    };

    sendInquiresMutation.mutate(inquiry);
  };

  const successInquiry = () => {
    setSendAsk(false);
    const category = searchParams.get('category');
    const query = category ? `?${new URLSearchParams({ category })}` : '';
    router.push(`/productsDetail/${params.itemId}${query}`);
  };

  return (
    <div className="WriteAsk">
      <Header type="subMenu" title={'문의하기'} />
      <div className="WriteAsk-content">
        <input
          onChange={titleChange}
          placeholder="제목을 적어주세요."
          value={title}
        />
        <div className="textAreaBox">
          <textarea
            maxLength={1000}
            onChange={contentChange}
            placeholder={'여기에 문의 내용을 작성해주세요.'}
          />
          <p>{content.length}/1000</p>
        </div>
        <div className="secret-writeBox">
          <Checkbox title="비밀글로 작성" data={secret} setData={setSecret} />
        </div>
        <footer className="footer">
          <button onClick={() => sendWriteAsk(true)}>작성하기</button>
        </footer>
      </div>
      {sendAsk && (
        <div className="sendCheckBox">
          <div>
            <h1>문의작성이 완료되었어요!</h1>
            <button onClick={successInquiry}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}
