import type { Meta } from "../model";

export interface GetCommunitiesParams {
  page: number;
  take: number;
  type: string | "";
  brokerId: number | "";
  search: string | "";
  feeType: string | "";
}

export interface GetACommunityParams<ICommunity> {
  data: ICommunity;
}

export interface PostCreateCommunityParams {
  name: string;
  description: string;
  fee: string;
  avatar: File | null;
  coverImage: File | null;
}

export interface CreateCommunityResponse<ICommunity> {
  status: number;
  message: string;
  data: ICommunity;
  // {
  //   id: string;
  //   name: string;
  //   avatar_id: string;
  //   cover_image_id: string;
  //   description: string;
  //   fee: number;
  // };
}

interface Photo {
  id: string;
  path: string;
}

interface Owner {
  userId: number;
  firstName: string;
  lastName: string;
  nickName: string;
  photo: Photo;
}

export interface ICommunity {
  id: string;
  owner: Owner;
  name: string;
  description: string;
  avatar: Photo;
  coverImage: Photo;
  fee: number;
  membersCount: number;
  communityStatus: string;
}

export interface GetCommunityResponse<ICommunity> {
  data: {
    docs: ICommunity[];
    meta: Meta;
  };
}
