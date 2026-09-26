'use client';

import './order.scss';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header/Header';
import Image from 'next/image';

import downArrow from '../../../public/grayDownArrow.svg';
import upArrow from '../../../public/grayUpArrow.svg';
import checked from '../../../public/checked.svg';
import check from '../../../public/check.svg';
import check_on from '../../../public/check_on.svg';
import { MainEventButton } from '@/components/Style/MainEventBtn/MainEventBtn';
import { useRouter } from 'next/navigation';
import PersonalInformation from '@/components/AgreementPage/PersonalInformation';
import TermsInformation from '@/components/AgreementPage/TermsInformation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { showOrders } from '@/util/AxiosOrder';
import userStore from '@/store/userInformation';
import { getAddress, getCouponList } from '@/util/AxiosMember';
import userAddress from '@/store/userAddress';
import { IOrder } from '@/types/common';

type queryData = {
  id: number;
  img: string;
  price: number;
  quantity:number;
  itemName: string;
  categoryName: string;
}[];

type coupon = {
  couponStrategy: 'PERCENTAGE' | 'ABSOLUTE';
  value: number;
  text: string;
  couponId: number;
}[];

const Order = () => {
  const router = useRouter();
  const [getUrl, setGetUrl] = useState<queryData>();
  const [showOrderedItem, setShowOrderedItem] = useState<boolean>(false);
  const [getPayment, setGetPayment] = useState<string>('card');
  const [rememberPayment, setRememberPayment] = useState<boolean>(false);
  const [agreeTreatment, setAgreeTreatment] = useState<boolean>(false);
  const [agreeCollection, setAgreeCollection] = useState<boolean>(false);
  const [selectRequest, setSelectRequest] = useState<string>('배송 요청사항');
  const [deliveryRequest, setDeliveryRequest] = useState<string>('');
  const [showDeliveryPopup, setShowDeliveryPopup] = useState<boolean>(false);
  const [showCouponPopup, setShowCouponPopup] = useState<boolean>(false);
  const [getCoupon, setGetCoupon] = useState<coupon>([]);
  const [phone, setPhone] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [showPersonalInformation, setShowPersonalInformation] =
    useState<boolean>(false);
  const [showTermsInformation, setShowTermsInformation] =
    useState<boolean>(false);

  const { user }: any = userStore();
  const { address }: any = userAddress();
  const Token = user?.token;
  const couponId = getCoupon?.map((value) => value.couponId);
  const couponName = getCoupon?.map((value) => value.text);
  const { data: AddressList, isLoading } = useQuery({
    queryKey: ['getAddress'],
    queryFn: () => getAddress(Token),
  });

  const { data: coupon } = useQuery({
    queryKey: ['getCouponList'],
    queryFn: () => getCouponList(Token),
  });

  const items = getUrl?.map((value) => ({
    itemId: value.id,
    quantity: value.quantity,
  }));
  const totalAmount = getUrl?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  ) ?? 0;

  const selectedCoupon = getCoupon[0];
  const discountAmount = !selectedCoupon
    ? 0
    : Math.min(
        totalAmount,
        selectedCoupon.couponStrategy === 'PERCENTAGE'
          ? Math.floor((totalAmount * selectedCoupon.value) / 100)
          : selectedCoupon.value,
      );
  // 서버의 totalPrice는 배송비를 제외한 상품 금액입니다.
  const totalPrice = totalAmount - discountAmount;
  const deliveryFee = totalPrice >= 100000 ? 0 : 3000;
  const paymentAmount = totalPrice + deliveryFee;

  const handleContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 50) return;

    setDeliveryRequest(e.target.value);
  };

  const orderData = {
    comment: selectRequest === '기타' ? deliveryRequest : selectRequest,
    phoneNumber: address.length === 0 ? phone : address.phoneNumber,
    address:
      address.length === 0
        ? deliveryAddress
        : `${address.address}, ${address.detailAddress}`,
    recipient: address.length === 0 ? recipient : address.recipient,
    couponId: couponId.length === 0 ? null : Number(couponId),
    totalPrice,
    orderItems: items,
  };

  const orderMutation = useMutation({
    mutationFn: (orderData: IOrder) => showOrders(orderData, Token),
    onSuccess: (res) => {
      if (res.data) {
        router.push(`/successOrder?id=${res.data}`);
      }
    },
  });

  const handleOrder = () => {
    orderMutation.mutate(orderData);
  };

  useEffect(() => {
    if (isLoading === false) {
      AddressList?.map((value) => {
        if (value.isDefault) {
          setPhone(value.phoneNumber);
          setDeliveryAddress(`${value.address}, ${value.detailAddress}`);
          setRecipient(value.recipient);
        }
      });
    }
  }, [isLoading]);

  useEffect(() => {
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);
    const itemDataString = urlParams.get('item');

    const parsedItemData = JSON.parse(itemDataString);

    setGetUrl(parsedItemData);
  }, []);

  return (
    <div className="order_class">
      <Header title="주문/결제" type="subMenu" />

      <div className="delivery_select_area">
        <div>
          <button>기본</button>
          <button>최근</button>
        </div>
        <button
          onClick={() => {
            router.push('/order/deliveryList');
          }}
        >
          배송지 목록
        </button>
      </div>
      <div className="order_wrap">
        {/* 배송 */}
        <div className="delivery_address">
          {address.length === 0 ? (
            <>
              {AddressList?.length === 0 ? (
                <>
                  <div>
                    <button
                      onClick={() => {
                        router.push('/order/newDelivery');
                      }}
                    >
                      배송지 추가하기
                    </button>
                  </div>
                </>
              ) : (
                AddressList?.map((address) => {
                  return (
                    <React.Fragment key={address.addressId}>
                      {address.isDefault && (
                        <>
                          <div>
                            <h1>{address.addressAlias}</h1>
                            <p>기본 배송지</p>
                          </div>
                          <p>
                            {address.recipient} ∙ {address.phoneNumber}
                          </p>
                          <p>
                            {address.address}, {address.detailAddress}
                          </p>
                        </>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </>
          ) : (
            <>
              <div>
                <h1>{address.addressAlias}</h1>
                {address.isDefault && <p>기본 배송지</p>}
              </div>
              <p>
                {address.recipient} ∙ {address.phoneNumber}
              </p>
              <p>{address.address}</p>
            </>
          )}
          <div
            className="requestOption"
            onClick={() => {
              setShowDeliveryPopup(true);
            }}
          >
            <p>{selectRequest === '기타' ? '배송 요청사항' : selectRequest}</p>
            <Image src={downArrow} alt="downArrow" />
          </div>
          {selectRequest === '기타' ? (
            <div>
              <textarea
                value={deliveryRequest}
                maxLength={50}
                onChange={handleContent}
                placeholder="배송메모를 입력해주세요."
              />
              <span>{deliveryRequest.length}/50</span>
            </div>
          ) : null}
        </div>
        <div className="coupon">
          <p>쿠폰</p>
          <div
            onClick={() => {
              setShowCouponPopup(true);
            }}
            className="requestOption"
          >
            <p>
              {getCoupon.length === 0
                ? `사용가능 쿠폰 ${coupon?.data.length}장 / 전체 ${coupon?.data.length}장`
                : couponName}
            </p>
            <Image src={downArrow} alt="downArrow" />
          </div>
        </div>

        {/* 주문 상품 */}
        <div className="ordered_product">
          <div className={showOrderedItem == true ? 'title active' : 'title'}>
            <p>주문상품</p>
            <div>
              <span>{getUrl?.length}개</span>
              <Image
                onClick={() => {
                  setShowOrderedItem(!showOrderedItem);
                }}
                src={showOrderedItem == true ? upArrow : downArrow}
                alt="upArrow"
              />
            </div>
          </div>
          {showOrderedItem == true
            ? getUrl?.map((value, index) => {
                return (
                  <div key={value.id} className="ordered_item">
                    <div>
                      <p>{value.itemName}</p>
                      <p>수량 {value.quantity}개</p>
                    </div>
                  </div>
                );
              })
            : null}
        </div>

        {/* 결제금액 */}
        <div className="total_amount">
          <p>결제금액</p>
          <div>
            <p>주문금액</p>
            <p>{totalAmount?.toLocaleString()} 원</p>
          </div>
          <div>
            <p>배송비</p>
            <p>{deliveryFee.toLocaleString()} 원</p>
          </div>
          <div>
            <p>쿠폰할인</p>
            <p>
              {discountAmount.toLocaleString()}
              원
            </p>
          </div>
          <div>
            <p>총 결제 금액</p>
            <p>
              {paymentAmount.toLocaleString()}
              원
            </p>
          </div>
        </div>

        {/* 결제 방식 */}
        <div className="payment">
          <p>결제방식</p>
          <div>
            <div
              onClick={() => {
                setGetPayment('card');
              }}
              className={
                getPayment == 'card'
                  ? 'select_itemBox active'
                  : 'select_itemBox'
              }
            >
              <Image src={checked} alt="checked" />
            </div>
            <p>일반결제</p>
          </div>
          <div>
            <div
              onClick={() => {
                setGetPayment('account');
              }}
              className={
                getPayment == 'account'
                  ? 'select_itemBox active'
                  : 'select_itemBox'
              }
            >
              <Image src={checked} alt="checked" />
            </div>
            <p>계좌 간편결제</p>
          </div>
          <div>
            <Image
              onClick={() => {
                setRememberPayment(!rememberPayment);
              }}
              src={rememberPayment === true ? check_on : check}
              alt="check"
            />
            <p>이 결제수단을 다음에도 사용하기</p>
          </div>
        </div>

        {/* 동의 */}
        <div className="agreement">
          <div>
            <div>
              <Image
                onClick={() => {
                  setAgreeTreatment(!agreeTreatment);
                }}
                src={agreeTreatment === true ? check_on : check}
                alt="check"
              />
              <p>개인정보 취급 위탁 동의</p>
            </div>
            <p
              onClick={() => {
                setShowPersonalInformation(true);
                window.scrollTo(0, 0);
              }}
            >
              보기
            </p>
          </div>
          <div>
            <div>
              <Image
                onClick={() => {
                  setAgreeCollection(!agreeCollection);
                }}
                src={agreeCollection === true ? check_on : check}
                alt="check"
              />
              <p>개인정보 수집 및 이용 동의</p>
            </div>
            <p
              onClick={() => {
                setShowTermsInformation(true);
                window.scrollTo(0, 0);
              }}
            >
              보기
            </p>
          </div>
          <MainEventButton
            onClick={handleOrder}
            disabled={
              (address.length === 0 && AddressList?.length === 0) ||
              agreeTreatment == false ||
              agreeCollection == false
                ? true
                : false
            }
            $width={345}
            $height={41}
            $color={
              (address.length === 0 && AddressList?.length === 0) ||
              agreeTreatment == false ||
              agreeCollection == false
                ? '#999999'
                : '#FF6135'
            }
          >
            결제하기
          </MainEventButton>
        </div>
      </div>

      {showDeliveryPopup === true ? (
        <div className="delivery_popup">
          <div>
            <p
              onClick={() => {
                setSelectRequest('문 앞에 놔주세요.');
                setShowDeliveryPopup(false);
              }}
            >
              문 앞에 놔주세요.
            </p>
            <p
              onClick={() => {
                setSelectRequest('택배함에 놔주세요.');
                setShowDeliveryPopup(false);
              }}
            >
              택배함에 놔주세요.
            </p>
            <p
              onClick={() => {
                setSelectRequest('경비실에 맡겨주세요.');
                setShowDeliveryPopup(false);
              }}
            >
              경비실에 맡겨주세요.
            </p>
            <p
              onClick={() => {
                setSelectRequest('기타');
                setShowDeliveryPopup(false);
              }}
            >
              기타
            </p>
          </div>
        </div>
      ) : null}

      {showCouponPopup === true ? (
        <div className="coupon_popup">
          <div>
            <div
              onClick={() => {
                setGetCoupon([]);
                setShowCouponPopup(false);
              }}
            >
              <p>쿠폰 적용 안함</p>
            </div>
            {coupon?.data.map((value) => {
              return (
                <div
                  key={value.id}
                  onClick={() => {
                    setGetCoupon([
                      {
                        couponStrategy: value.couponStrategy,
                        value: value.value,
                        text: value.name,
                        couponId: value.id,
                      },
                    ]);
                    setShowCouponPopup(false);
                  }}
                >
                  <p>{value.name}</p>
                  <p>
                    * 발급 후 3개월 이내에 사용하지 않으면 사라지는 쿠폰이에요.
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      <PersonalInformation
        show={showPersonalInformation}
        setShow={setShowPersonalInformation}
      />
      <TermsInformation
        show={showTermsInformation}
        setShow={setShowTermsInformation}
      />
    </div>
  );
};

export default Order;
