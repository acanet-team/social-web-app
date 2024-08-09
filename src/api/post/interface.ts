import type { IUserInfo, Photo } from "../onboard/model";

export type ResponseDto<T> = {
  status: number;
  message: string;
  data: {
    data?: T[];
    docs?: T[];
    meta: {
      page: number;
      take: number;
      total: number;
      totalPage: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  };
};

export interface IPost {
  id: string;
  content: string;
  favoriteCount: number;
  commentCount: number;
  assets: Photo[];
  createBy: IUserInfo;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}