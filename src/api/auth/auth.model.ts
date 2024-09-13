import type { UserProfile } from "../profile/model";

export interface ISession {
  user: IUser;
  accessToken: string;
  refreshTokenExpires: number;
  tokenExpires: number;
  refreshToken: string;
  needToLogin: boolean;
}

export enum ONBOARDING_STEP {
  PROFILE = "create_profile",
  INTEREST_TOPIC = "select_interest_topic",
  COMPLETE = "onboarding_complete",
}

export interface IUser {
  id: number;
  email: string;
  provider: string;
  socialId: string;
  firstName: string;
  lastName: string;
  photo: Photo;
  role: Role;
  status: Role;
  onboarding_data: OnboardingData;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  fullName: string;
  nickName: string;
  avatar: string;
  isBroker: boolean;
  location: string;
  userProfile: UserProfile;
  wallet_address: string | null;
}

// export interface IUser {
//   id: number;
//   email: string;
//   provider: string;
//   socialId: string;
//   fullName: string;
//   nickName: string;
//   avatar: string;
//   isBroker: boolean;
//   location: string;
//   user: {
//     createdAt: string;
//     updatedAt: string;
//     deletedAt: null;
//     onboarding_data: OnboardingData;
//     photo: Photo;
//     role: Role;
//     status: Role;
//     firstName: string;
//     lastName: string;
//   }
//   userProfile: UserProfile;
//   wallet_address: string | null;
// }

interface OnboardingData {
  step: string;
  time: string;
}

interface Role {
  id: number;
  name: string;
  __entity: string;
}

interface Photo {
  isPublic: boolean;
  isDeleted: boolean;
  id: string;
  path: string;
  mimetype: string;
  ownerId: number;
}
