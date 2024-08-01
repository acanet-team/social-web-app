import { create } from "zustand";

export interface IUserSessionStore {
  session: {
    token: string | null;
    user: {
      isBroker: boolean;
      isProfile: boolean;
      nickName: string | null;
      id: number | null;
      email: string | null;
      firstName: string | null;
      lastName: string | null;
      photo: string | null;
      role: string | null;
      status: string | null;
      createdAt: string | null;
      updatedAt: string | null;
      deletedAt: string | null;
      gender: string | null;
      location: string | null;
    };
  };
  createProfile: (session: any) => void;
  updateProfile: (values: any) => void;
  logout: () => void;
}

const useAuthStore = create<IUserSessionStore>((set) => ({
  session: {
    token: null,
    user: {
      isBroker: false,
      isProfile: false,
      nickName: null,
      id: null,
      email: null,
      firstName: null,
      lastName: null,
      photo: null,
      role: null,
      status: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
      gender: null,
      location: null,
      phone: null,
    },
  },
  createProfile: (session: any) =>
    set((state) => {
      return {
        session: {
          ...state.session,
          token: session.token,
          user: {
            ...state.session.user,
            id: session.user.id,
            email: session.user.email,
            photo: session.user.photo?.path,
            firstName: session.user.firstName,
            lastName: session.user.lastName,
            isBroker: session.user.isBroker,
            isProfile: session.user.isProfile,
            createdAt: session.user.createdAt,
            role: session.user.role?.name,
            status: session.user.status?.name,
          },
        },
      };
    }),
  updateProfile: (values: any) =>
    set((state) => ({
      session: {
        ...state.session,
        user: {
          ...state.session.user,
          nickName: values.nickName,
          location: values.location,
        },
      },
    })),
  logout: () => set(() => ({})),
}));

export default useAuthStore;
