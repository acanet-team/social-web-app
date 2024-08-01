// export interface IUser {
//   user: User;
//   userProfile?: UserProfile;
//   brokerProfile?: BrokerProfile;
// }

export interface IUser {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  provider: string;
  isBroker: boolean;
  isProfile: boolean;
  socialId: string;
  photoUrl: string;
  brokerProfileId: string;
  followersCount: number;
  followingsCount: number;
  rating: number;
  coursesEnrolledCount: number;
  role: Role;
  rank: string;
  followed: boolean;
  status: Status;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

interface BrokerProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  user: IUser;
  schoolName: string[];
  companyName: string[];
  socialMedia: string[];
}

interface UserProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  user: IUser;
  nickName: string;
  birthDate: string;
  gender: string;
  location: string;
  shortDesc: string;
  additionalData: AdditionalData;
  brokerProfile: AdditionalData;
}

interface AdditionalData {}

interface Role {
  id: number;
  name: string;
}

interface Status {
  id: number;
  name: string;
}

interface Photo {
  id: string;
  path: string;
  mimetype: string;
  isPublic: boolean;
  isDeleted: boolean;
  ownerId: number;
  courseId: number;
  category: string;
}
