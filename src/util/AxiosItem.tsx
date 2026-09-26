import { ICategory, ISearch } from '@/types/common';
import AxiosConfig from './AxiosConfig';
import userStore from '@/store/userInformation';

const getItem = (url: string) => {
  const user = userStore.getState().user as unknown as { token?: string } | null;
  return AxiosConfig.get(url, {
    headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
  });
};

// 와인 리스트
const getWineList = (): any => {
  return getItem(`/items/list`);
};

// 인기검색어 조회
const getPopularList = () =>
  getItem('/items/popular-list').then((res) => res.data);

// 카테고리별 제품 조회
const getCategory = (categoryData: ICategory): any => {
  if (categoryData.category === '0') {
    return getItem(
      `/items/list?query=&page=${categoryData?.page}&size=${categoryData?.size}`,
    );
  }
  return getItem(
    `/items/category/${categoryData?.category}?page=${categoryData?.page}&size=${categoryData?.size}`,
  );
};

// 특정 제품의 상세정보
const getDetail = (itemId: string) => {
  return getItem(`/items/${itemId}`);
};

// 가격대가 비슷한 술 조회
const getSimilarPrice = (price: number) => {
  return getItem(`/items/similar-price?price=${price}`);
};

// 이름으로 검색
const getSearchItem = (SearchData: ISearch) => {
  return getItem(
    `/items/list?query=${SearchData?.decode === '' ? null : SearchData?.decode}&page=${SearchData?.pageParam}`,
  );
};

// 카테고리 인기상품
const getPopularCategory = (category: string) => {
  return getItem(`/items/popular-in-category/${category}`);
};

export {
  getCategory,
  getPopularList,
  getDetail,
  getSimilarPrice,
  getSearchItem,
  getPopularCategory,
  getWineList
};
