export interface User {
  id: number;
  email: string;
  provider: string;
  socialId: string;
  firstName: string;
  lastName: string;
  photo: {
    isPublic: boolean;
    isDeleted: boolean;
    id: string;
    path: string;
    mimetype: string;
    ownerId: number;
    category: string;
  };
  role: {
    id: number;
    name: string;
    __entity: string;
  };
  status: {
    id: number;
    name: string;
    __entity: string;
  };
  onboarding_data: {
    step: string;
    time: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
export interface UserProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  nickName: string;
  birthDate: string;
  gender: string;
  location: string;
  shortDesc: string;
  additionalData: Record<string, any>;
  brokerProfile: BrokerProfile | null;
}

export interface BrokerProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  summary: string | null;
  location: string | null;
  user: User;
  school: School[];
  company: Company[];
  socialMedia: SocialMedia[];
  licenses: License[];
  skills: Skill[];
  servicesOffer: ServiceOffer[];
  rank: {
    id: string;
    name: string;
  };
}

export interface School {
  id: string;
  logo: string;
  name: string;
  startDate: string;
  endDate: string;
  isGraduated: boolean;
}

export interface Company {
  id: string;
  logo: string;
  name: string;
  startDate: string;
  endDate: string;
  isWorking: boolean;
}
export interface SocialMedia {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  mediaUrl: string;
}
export interface License {
  id: string;
  credentialID: string;
  licenseType: string;
  licenseState: string;
  licenseIssuer: string;
  licenseStatus: string;
  licenseIssueDate: string;
  licenseExpirationDate: string;
  shortDesc: string;
  additionalData: Record<string, any>;
}
export interface Skill {
  // interestTopicId: string;
  // topicName: string;
}

export interface ServiceOffer {}

export interface Rank {
  id: string;
  name: string;
}
