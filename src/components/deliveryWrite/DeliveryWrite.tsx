'use client';
import Header from '@/components/Header/Header';
import './DeliveryWrite.scss';

import { useRouter } from 'next/navigation';
import InputText from '@/components/InputText/InputText';
import { useState } from 'react';
import { MainEventButton } from '@/components/Style/MainEventBtn/MainEventBtn';
import Checkbox from '../Checkbox/Checkbox';

const DeliveryWrite = ({ isEdit }: { isEdit: boolean }) => {
  const router = useRouter();

  const [alias, setAlias] = useState('');
  const [receiver, setReceiver] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [phone, setPhone] = useState('');
  const [defaultDelivery, setDefaultDelivery] = useState<boolean>(false); // 이곳에는 API 데이터가 들어가야 함.

  const handlePhoneChange = (e) => {
    const formattedPhoneNumber = e.target.value
      .replace(/[^0-9]/g, '')
      .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    setPhone(formattedPhoneNumber);
  };

  const inputDataArr = [
    {
      data: alias,
      setData: setAlias,
      title: '별칭',
      placeholder: '별칭을 입력해주세요.',
    },
    {
      data: receiver,
      setData: setReceiver,
      title: '받는 사람',
      placeholder: '받는 사람을 입력해주세요.',
    },
    {
      data: address,
      setData: setAddress,
      title: '주소',
      placeholder: '우편 번호를 입력해주세요.',
      type: 'search',
    },
    {
      data: addressDetail,
      setData: setAddressDetail,
      title: '상세 주소',
      placeholder: '상세 주소를 입력해주세요.',
    },
    {
      data: phone,
      setData: setPhone,
      title: '휴대폰 번호',
      placeholder: '휴대폰 번호를 입력해주세요.',
      onChange: handlePhoneChange,
    },
  ];

  return (
    <div className="deliveryAdd_container">
      <Header title={isEdit ? '배송지 수정' : '배송지 추가'} type="subMenu" />
      <div className="deliveryAdd_wrapper">
        {inputDataArr.map((inputData) => (
          <InputText
            key={inputData.title}
            data={inputData.data}
            setData={inputData.setData}
            title={inputData.title}
            placeholder={inputData.placeholder}
            type={inputData.type}
            onChange={inputData.onChange}
          />
        ))}
        <Checkbox
          title="기본 배송지로 선택"
          data={defaultDelivery}
          setData={setDefaultDelivery}
        />
        <MainEventButton width={345} height={41} color={'#ff6135'}>
          저장
        </MainEventButton>
      </div>
    </div>
  );
};

export default DeliveryWrite;
