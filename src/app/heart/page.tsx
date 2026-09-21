'use client';

import Header from '@/components/Header/Header';
import './heart.scss';
import ItemBox from '@/components/Item/ItemBox';
import upright_triangle from '../../../public/upright-triangle.svg';
import downright_triangle from '../../../public/downright-triangle.svg';
import Image from 'next/image';

import testRed from '../../../public/test-red.svg';
import testRose from '../../../public/test-rose.svg';
import testWhite from '../../../public/test-white.svg';
import { useState } from 'react';
import Navigation from '@/components/Navigation/Navigation';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getWishList } from '@/util/AxiosMember';
import userStore from '@/store/userInformation';

export default function Heart() {
  const testItem: {
    img: string;
    type: string;
    name: string;
    price: string;
    score: string;
    id: number;
  }[] = [
    {
      img: testRed,
      type: '레드 와인',
      name: '피에스타',
      price: '99,999',
      score: '3.5',
      id: 1,
    },
    {
      img: testRose,
      type: '로제 와인',
      name: '모젤 크리스마스, 로제',
      price: '50,000',
      score: '4.5',
      id: 2,
    },
    {
      img: testWhite,
      type: '화이트 와인',
      name: '마멜랑스 화이트',
      price: '35,000',
      score: '5',
      id: 3,
    },
  ];
  const sortText = ['최근찜한순', '높은평점순', '낮은평점순'];

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [sort, setSort] = useState<string>('최근찜한순');
  const path = usePathname();
  const { user }: any = userStore();
  const Token = user?.token;

  const { data } = useQuery({
    queryKey: ['wishList'],
    queryFn: () => getWishList(Token),
  });

  console.log(data)

  return (
    <div className="main">
      <div className="main-container">
        <Header title="찜한 상품" type="menu" search={true} cart={true} />
        <div className="item-wrap">
          <div className="item-assistant">
            <p className="item-number">{`상품 ${123}`}</p>
            <div className="item-sort">
              <div
                className="sort"
                onClick={() => {
                  setShowAlert(!showAlert);
                }}
              >
                <p>{sort}</p>
                <Image
                  src={
                    showAlert === true ? downright_triangle : upright_triangle
                  }
                  alt="upright triangle"
                />
              </div>
              <div
                className={
                  showAlert === true ? 'item-alert active' : 'item-alert'
                }
              >
                {sortText.map((item, idx) => (
                  <p
                    className={
                      sort == item
                        ? 'item-alert-text active'
                        : 'item-alert-text'
                    }
                    onClick={() => {
                      setSort(item), setShowAlert(false);
                    }}
                    key={idx}
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="item-container">
            {data?.data.wishlist.map((item, idx) => {
              return (
                <div key={item.id} className="item-box-margin">
                  <ItemBox data={item} page={'heart'} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Navigation pathName={path} />
    </div>
  );
}
