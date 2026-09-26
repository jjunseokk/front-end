import {
  IAddress,
  IUser,
  ILogin,
  IWish,
  ICart,
  ICheckEmail,
  IFindEmail,
  IEmail,
} from '@/types/common';
import AxiosConfig from './AxiosConfig';

// 회원가입
const showJoin = (user: IUser) => {
  return AxiosConfig.post('/members/register', user).then((res) => res);
};

// 회원가입 이메일 인증
const showMailCertification = (emailAddress: IEmail) => {
  return AxiosConfig.post(`/members/mail/send`, emailAddress);
};

// 회원가입 이메일 인증 확인
const SuccessCertification = (emailAddress: ICheckEmail) => {
  return AxiosConfig.post(`/members/mail/check`, emailAddress);
};

// 아이디 찾기 이메일 인증
const showFindMailCertification = (emailAddress: IFindEmail) => {
  return AxiosConfig.post(`/members/mail/send/find-id`, emailAddress);
};

// 아이디 찾기 이메일 인증 확인
const SuccessFindCertification = (emailAddress: ICheckEmail) => {
  console.log(emailAddress);
  return AxiosConfig.post(`/members/mail/check/find-id`, emailAddress);
};

// 로그인
const showLogin = (login: ILogin) => {
  return AxiosConfig.post('/auth/login', login).then((res) => res);
};

// 회원탈퇴
const showSecession = (Token: string) => {
  return AxiosConfig.delete('/members/withdraw', {
    headers: { Authorization: `Bearer ${Token}` },
  }).then((res) => res.data);
};

// 제품 찜하기
const addWishItem = (wish: IWish, Token: string) => {
  return AxiosConfig.post(`/members/wish-item`, wish, {
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  }).then((res) => res);
};

export const removeWishItem = (itemId: number, Token: string) =>
  AxiosConfig.delete('/members/wish-item', {
    params: { itemId },
    headers: { Authorization: `Bearer ${Token}` },
  });

// 찜목록
const getWishList = (Token: string) => {
  return AxiosConfig.get('/members/wish-item', {
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  });
};

// 프로필 이미지 업데이트
const updateImage = (allData): any => {
  const formData = new FormData();
  if (allData[0]) {
    formData.append('image', allData[0]);
  }
  return AxiosConfig.post('/members/profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${allData[1]}`,
    },
  }).then((res) => res);
};

// 장바구니 추가
const addCart = (cartValue: any, Token: string): any => {
  return AxiosConfig.post(`/members/carts`, cartValue, {
    headers: { Authorization: `Bearer ${Token}` },
  }).then((res) => res);
};

// 장바구니 조회
const getCart = (Token: string) => {
  return AxiosConfig.get(`/members/carts`, {
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  }).then((res) => res);
};

// 장바구니 삭제
const deleteCart = (itemIdList: ICart, Token: string) => {
  const data = {
    itemIdList: itemIdList,
  };
  const headers = {
    Authorization: `Bearer ${Token}`,
  };
  return AxiosConfig.delete('/members/carts', {
    data: data?.itemIdList,
    headers: headers,
  });
};

// 배송지 조회
const getAddress = (Token: string) => {
  return AxiosConfig.get('/members/address', {
    headers: {
      Authorization: `Bearer ${Token}`,
      'Content-Type': 'application/json',
    },
  }).then((res) => res.data);
};

// 배송지 추가
const addAddress = (address: IAddress, Token: string) => {
  return AxiosConfig.post('/members/address', address, {
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  }).then((res) => res);
};

// 배송지 수정
const updateAddress = (addressId: number, address: IAddress, Token: string) => {
  return AxiosConfig.post(`/members/address/${addressId}`, address, {
    headers: { Authorization: `Bearer ${Token}` },
  }).then((res) => res);
};

// 배송지 삭제
const deleteAddress = (addressId: number, Token: string) => {
  return AxiosConfig.delete(`/members/address/${addressId}`, {
    headers: { Authorization: `Bearer ${Token}` },
  }).then((res) => res);
};

// 쿠폰 리스트
const getCouponList = (Token: string) => {
  return AxiosConfig.get('/members/coupons', {
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  });
};

export {
  showJoin,
  showMailCertification,
  SuccessCertification,
  showFindMailCertification,
  SuccessFindCertification,
  showSecession,
  showLogin,
  addWishItem,
  getWishList,
  updateImage,
  addCart,
  deleteCart,
  getCart,
  getAddress,
  addAddress,
  updateAddress,
  deleteAddress,
  getCouponList,
};
