import React, { Fragment, useState } from 'react';
import './ProductDetailAsk.scss';
import noAsk from '../../../public/productDetail-noAsk.svg';
import Image from 'next/image';
import secret from '../../../public/productDetail-secret.svg';
import search from '../../../public/productDetail-search.svg';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getInquiriesList } from '@/util/Axiosinquiry';

const ProductDetailAsk = () => {
  const itemId = Number(useParams().itemId as string);
  const { data, status } = useQuery({
    queryKey: ['inquiriesList'],
    queryFn: () => getInquiriesList(itemId, 0, 10),
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const [askLists, setAskLists] = useState(data);

  return (
    <div className="ProductDetailAsk">
      <div className="ask-button">
        <button
          onClick={() => {
            const category = searchParams.get('category');
            const query = category ? `?${new URLSearchParams({ category })}` : '';
            router.push(`/productsDetail/${itemId}/writeAsk${query}`);
          }}
        >
          상품 문의하기
        </button>
      </div>
      <div className="ask-lists">
        {data?.length === 0 ? (
          <div className="no-ask">
            <Image src={noAsk} alt="no-list" />
            <p>등록된 상품문의가 없습니다.</p>
          </div>
        ) : (
          <div className="ask-lists-box">
            {data?.map((askList) => {
              const date = new Date(askList.createdAt);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const formattedDate = `${year}-${month}-${day}`;
              return (
                <Fragment key={askList.id}>
                  <div className="ask-list">
                    {askList.secretInquiry ? (
                      <div className="secretBox">
                        <h1 className="secret">비밀글입니다.</h1>
                        <Image src={secret} alt="secret" />
                      </div>
                    ) : (
                      <div>
                        <h1>{askList.title}</h1>
                      </div>
                    )}
                    <div>
                      <span
                        className={
                          askList.hasAnswer ? 'highlight' : 'unhighlight'
                        }
                      >
                        {askList.hasAnswer ? '답변완료' : '답변대기'} |
                      </span>
                      <span className="nickname">{askList?.memberName}</span>
                      <span>| {formattedDate}</span>
                    </div>
                  </div>
                  {askList.open ? (
                    <div className="detailContent">
                      <Image src={search} alt="detailContentIcon" />
                      <p>{formattedDate}</p>
                    </div>
                  ) : null}
                </Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailAsk;
