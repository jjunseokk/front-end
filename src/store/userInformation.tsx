import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userState } from '@/types/storeType';

const userStore = create(
  persist<userState>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'ttarum',
    },
  ),
);

export default userStore;
