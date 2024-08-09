import type { T } from "vitest/dist/reporters-yx5ZTtEV.js";
import { Photo, Role } from "../onboard/model";

export interface likeParams {
  postId: string;
  action: "favorite" | "unfavorite";
}

interface CreateBy {
  id: number;
  firstName: string;
  lastName: string;
  photo: Photo;
  role: Role;
  refCode: string;
  nickName: string;
}

export interface Comment {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  content: string;
  childrenCount: number;
  createBy: CreateBy;
  post: {};
  parent: string;
  children: string[];
}
export type CommentResponse<T> = {
  status: number;
  message: string;
  data: {
    data?: Comment[];
    docs?: Comment[];
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
