import React, { useEffect, useRef, useState } from 'react';
import './ProductDetailReview.scss';
import reviewPicture from '../../../public/productDetail-review.svg';
import reviewPicture2 from '../../../public/productDetail-review2.svg';
import reviewPicture3 from '../../../public/productDetail-review3.svg';
import upright_triangle from '../../../public/upright-triangle.svg';
import downright_triangle from '../../../public/downright-triangle.svg';
import reviewScore from '../../../public/score-star.svg';
import fillReviewScore from '../../../public/fillStar.svg';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { readReview } from '@/util/AxiosReview';
import userStore from '@/store/userInformation';
import { useParams } from 'next/navigation';

export default function ProductDetailReview() {
  const { user }: any = userStore();
  const Token = user?.token;
  const { itemId } = useParams();
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

  const { data, status } = useQuery({
    queryKey: ['review', Token],
    queryFn: () => readReview(Number(itemId), Token, page, size),
    enabled: !!Token,
  });

  console.log(data);

  const reviews = (Array.isArray(data) ? data : []).map((item) => ({
    ...item,
    imageUrls: Array.isArray(item.imageUrls)
      ? item.imageUrls
          .filter(
            (image) =>
              typeof image?.imageUrl === 'string' &&
              image.imageUrl.trim().length > 0,
          )
          .sort((a, b) => a.order - b.order)
          .map((image) => image.imageUrl)
      : [],
  }));
  const photoReviews = reviews.filter((item) => item.imageUrls.length > 0);

  const dropdownRef = useRef(null);
  const [isReviewToggle, setIsReviewToggle] = useState<boolean>(false);
  const [currentToggle, setCurrentToggle] = useState<string>('최근등록순');
  const toggleList: string[] = [
    '최근등록순',
    '추천순',
    '높은평점순',
    '낮은평점순',
  ];

  const changeReviewSequence = (list: string) => {
    setCurrentToggle(list);
  };

  useEffect(() => {
    const handleSortModal = (e: Event | React.MouseEvent) => {
      if (
        isReviewToggle &&
        (!dropdownRef.current ||
          !dropdownRef.current!.contains(e.target as Node))
      )
        setIsReviewToggle(false);
    };

    document.addEventListener('mousedown', handleSortModal);
    return () => {
      document.removeEventListener('mousedown', handleSortModal);
    };
  }, [dropdownRef, isReviewToggle, window]);

  return (
    <div className="ProductDetailReview">
      <div className="picture-review">
        <div>
          <h1>사진 후기</h1>
          <div>
            {photoReviews.slice(0, 4).map((item, index) => {
              const picture = (
                <Image
                  key={item.id}
                  src={item.imageUrls[0]}
                  alt="리뷰 사진"
                  width={84}
                  height={83}
                  style={{ objectFit: 'cover' }}
                />
              );

              return index === 3 && photoReviews.length > 4 ? (
                <div key={item.id} className="addReview">
                  {picture}
                  <div>+ 더보기</div>
                </div>
              ) : (
                picture
              );
            })}
          </div>
        </div>
      </div>

      <div className="ProductDetailReview-comments">
        <div className="length-sort">
          <div className="count_review">총 {reviews.length}개</div>
          <div
            className="sort"
            onClick={() => setIsReviewToggle((pre) => !pre)}
          >
            <span>{currentToggle}</span>
            <Image
              src={isReviewToggle ? downright_triangle : upright_triangle}
              alt="comment toggle icon"
            />
          </div>
          {isReviewToggle && (
            <div
              className="sort-modal"
              onClick={() => setIsReviewToggle((pre) => !pre)}
              ref={dropdownRef}
            >
              {toggleList.map((list, index) => {
                return (
                  <p
                    key={index}
                    onClick={() => changeReviewSequence(list)}
                    className={
                      currentToggle === list ? 'highlight' : 'unHighlight'
                    }
                  >
                    {list}
                  </p>
                );
              })}
            </div>
          )}
        </div>
        {reviews.map((item) => {
          return (
            <div key={item.id} className="ProductDetailReview-comment">
              <div>
                <Image src={reviewPicture} alt="profile" />
                <p>{item.nickname}</p>
              </div>
              <div>
                <div className="comment-score">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Image
                      key={index}
                      src={index < item.rating ? fillReviewScore : reviewScore}
                      alt={index < item.rating ? '채워진 별' : '빈 별'}
                    />
                  ))}
                </div>
                <div className="comment-review">
                  {item.content}

                  {item.imageUrls.length > 0 && (
                    <div className="comment-review-picture">
                      {item.imageUrls
                        .slice(0, expandedReviews[item.id] ? undefined : 2)
                        .map((imageUrl, index) => (
                          <div className="review-photo" key={`${item.id}-${index}`}>
                            <Image src={imageUrl} alt={`리뷰 사진 ${index + 1}`}
                              width={83} height={83} style={{ objectFit: 'cover' }} />
                            {index === 1 && item.imageUrls.length > 2 && !expandedReviews[item.id] && (
                              <button type="button" className="review-photo-more"
                                aria-expanded={false}
                                aria-label={`리뷰 사진 ${item.imageUrls.length - 2}장 더보기`}
                                onClick={() => setExpandedReviews((previous) => ({
                                  ...previous, [item.id]: true,
                                }))}>
                                + 더보기
                              </button>
                            )}
                          </div>
                        ))}
                      {expandedReviews[item.id] && item.imageUrls.length > 2 && (
                        <button className="review-photo-skip" type="button" aria-expanded={true}
                          onClick={() => setExpandedReviews((previous) => ({
                            ...previous, [item.id]: false,
                          }))}>
                          - 접기
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <span>{item.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
