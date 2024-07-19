import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      nickName: null,
      isFirstLogin: true,
      isBroker: false,
      user: {
        id: null,
        email: null,
        provider: null,
        socialId: null,
        firstName: null,
        lastName: null,
        photo: null,
        role: 'investor',
        status: 'active',
        referBy: null,
        refCode: null,
        phone: null,
        location: null,
      },
      login: (state: any, session: any) =>
        set(() => ({
          isLoggedIn: true,
          nickName: session?.nickName,
          isFirstLogin: session?.isFirstLogin,
          isBroker: session?.isBroker,
          user: {
            ...state?.user,
            id: session?.user?.id,
            email: session?.user?.email,
            provider: session?.user?.provider,
            socialId: session?.user?.socialId,
            firstName: session?.user?.firstName,
            lastName: session?.user?.lastName,
            photo: session?.user?.photo?.path,
            role: session?.user?.id,
            status: 'active',
            referBy: session?.user?.referBy,
            refCode: session?.user?.refCode,
            phone: session?.user?.phone,
          },
        })),
      logout: () =>
        set(() => {
          localStorage.removeItem('user-auth');
          return { isLoggedIn: false, user: null };
        }),
      createProfile: (state: any, values: any) =>
        set(() => ({
          ...state,
          nickName: values.nickName,
          isBroker: values.isBroker,
          user: {
            ...state.user,
            location: values.location,
            email: values.email,
          },
        })),
    }),
    {
      name: 'user-auth',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useAuthStore;
