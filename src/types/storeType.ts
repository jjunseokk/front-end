import type { KakaoUser } from '@/util/KakaoAuth';
export interface userState {
  user: KakaoUser | null;
  setUser: (newUserId: KakaoUser | null) => void;
}

export interface AddressState {
  address: [];
  setAddress: (address: []) => void;
}
