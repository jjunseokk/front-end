'use client';

import './category.scss';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';
import category_all from '../../../public/category_all.svg';
import category_redWine from '../../../public/category_redWine.svg';
import category_whiteWine from '../../../public/category_whiteWine.svg';
import category_roseWine from '../../../public/category_roseWine.svg';
import category_sparklingWine from '../../../public/category_sparklingWine.svg';
import category_dessertWine from '../../../public/category_dessertWine.svg';
import category_nonAlcohol from '../../../public/category_nonAlcohol.svg';
import category_snack from '../../../public/category_snack.svg';
import Image from 'next/image';

export default function Category() {
  const router = useRouter();

  const testBox: { img: string; name: string; id: number }[] = [
    { img: category_all, name: '전체보기', id: 1 },
    { img: category_redWine, name: '레드 와인', id: 2 },
    { img: category_whiteWine, name: '화이트 와인', id: 3 },
    { img: category_roseWine, name: '로제 와인', id: 4 },
    { img: category_sparklingWine, name: '스파클링 와인', id: 5 },
    { img: category_dessertWine, name: '디저트 와인', id: 6 },
    { img: category_nonAlcohol, name: '논알코올', id: 7 },
    { img: category_snack, name: '안주', id: 8 },
  ];

  return (
    <div className="main">
      <div className="main-container">
        <Header title="카테고리" />
        <div className="category-container">
          {testBox?.map((item, idx) => {
            return (
              <div
                key={item.id}
                className="category-itemBox"
                onClick={() => {
                  router.push(`/products/${item.id}`);
                }}
              >
                <Image src={item.img} alt={item.name} />
                <p>{item.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
