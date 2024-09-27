import type { UUID } from "crypto";
export type NotificationType =
  | "like_post"
  | "comment_post"
  | "connection"
  | "follow"
  | "community_join_request"
  | "community_join_accept"
  | "community_join_reject"
  | "community_kicked"
  | "connection_accept"
  | "community_creation_failed"
  | "connection_request"
  | "connection_request";
export type Notification = {
  id: string;
  type: NotificationType;
  read_at: number | null;
  notiAt: number | null;
  user: {
    userId: number;
    firstName: string;
    lastName: string;
    nickName: string;
  };
  sourceUser: {
    userId: number;
    firstName: string;
    lastName: string;
    nickName: string;
    photo: {
      id: UUID;
      path: string;
    };
  };
  community: {
    avatar: {
      id: UUID;
      path: string;
    };
    communityId: string;
    name: string;
  } | null;
  additionalData: {
    post_id: string;
    comment_id?: string;
    community_id: string | UUID;
    notificationCount: number;
    connection_id: string;
  };
  createdAt: number;
};
