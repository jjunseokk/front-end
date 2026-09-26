'use client';

import ProductDetailAddInform from '@/components/ProductDetailAddInform/ProductDetailAddInform';
import Header from '@/components/Header/Header';
import detail from '../../../../public/detail.svg';
import share from '../../../../public/share.svg';
import score from '../../../../public/score-star.svg';
import heart from '../../../../public/heartFill.svg';
import { useState } from 'react';
import './productsDetail.scss';
import Image from 'next/image';
import ProductDetailBuyInform from '@/components/ProductDetailBuyInform/ProductDetailBuyInform';
import ProductDetailReview from '@/components/ProductDetailReview/ProductDetailReview';
import ProductDetailAsk from '@/components/ProductDetailAsk/ProductDetailAsk';
import ProductDetailChange from '@/components/ProductDetailChange/ProductDetailChange';
import { useQuery } from '@tanstack/react-query';
import { getDetail } from '@/util/AxiosItem';

type Props = {
  img?: string;
  type?: string;
  name?: string;
  volume?: string;
  price?: string;
  score?: string;
  page?: string;
  number?: number;
  params?: {
    itemId: string;
  };
};

export default function ProductsDetail({ params }: Props) {
  const [currentInform, setCurrentInform] = useState<string>('상품정보');
  const [show, setShow] = useState<boolean>(false);

  const changeToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setCurrentInform(target.innerText);
  };

  const { data } = useQuery({
    queryKey: ['detail'],
    queryFn: () => getDetail(params.itemId),
  });

  const navList = ['상품정보', '리뷰', '문의', '교환/반품'];

  console.log(currentInform)

  return (
    <main className="detail">
      <Header type="subMenu" title="상세보기" heart={true} cart={true} />

      {/**상품 정보 */}
      <div className="detail-inform">
        <div className="detail-inform-img">
          <Image
            width={393}
            height={393}
            src={data?.data.imageUrl}
            alt="detail"
          />
        </div>
        <section className="detail-inform-introduce">
          <article>
            <p>{data?.data?.name}</p>
            <div>
              <div>
                <Image src={share} alt="share" />
              </div>
            </div>
          </article>
          <p>{data?.data.description}</p>
          <article className="detail-inform-score">
            <div>
              <div>
                <Image src={score} fill alt="score" />
              </div>
              <div>
                <Image src={score} fill alt="score" />
              </div>
              <div>
                <Image src={score} fill alt="score" />
              </div>
              <div>
                <Image src={score} fill alt="score" />
              </div>
              <div>
                <Image src={score} fill alt="score" />
              </div>
            </div>
            <div>
              <span>4.5</span>
              <span>(32)</span>
            </div>
          </article>
          <article className="detail-inform-price">
            <span>{data?.data.price?.toLocaleString()}</span>
            <span>원</span>
          </article>
        </section>
      </div>

      <div onClick={changeToggle} className="ProductDetailToggle">
        {navList.map((nav, index) => {
          return (
            <div
              key={index}
              className={currentInform === nav ? 'highlight' : 'unHighlight'}
            >
              {nav}
            </div>
          );
        })}
      </div>

      {currentInform === '상품정보' && (
        <ProductDetailAddInform
          price={data?.data.price}
          descriptionImageUrl={data?.data.descriptionImageUrl}
        />
      )}
      {currentInform === '리뷰' && <ProductDetailReview />}
      {currentInform === '문의' && <ProductDetailAsk />}
      {currentInform === '교환/반품' && <ProductDetailChange />}

      <div className="ProductDetailBuy">
        <div>
          <div>
            <Image src={heart} fill alt="heart"></Image>
          </div>
          <p>99</p>
        </div>

        <button
          onClick={() => {
            setShow(true);
          }}
        >
          구매하기
        </button>
      </div>
      {show === true ? (
        <ProductDetailBuyInform
          title={data?.data.name}
          img={data?.data.descriptionImageUrl}
          price={data?.data.price}
          setShow={setShow}
          showBuy={show}
          id={Number(params?.itemId)}
          quantity={1}
        />
      ) : null}
    </main>
  );
}
