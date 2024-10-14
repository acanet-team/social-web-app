interface Photo {
  id: string;
  path: string;
}

export interface ISearchUserResponse {
  userId: number;
  firstName: string;
  lastName: string;
  nickName: string;
  photo: Photo;
  role: string;
  followersCount: number;
  followStatus: "followed" | "not_follow" | null;
  connectionStatus:
    | "connected"
    | "request_send"
    | "request_received"
    | "not_connected"
    | null;
  connectionRequestId: string;
  type?: "users" | "communities";
}

export interface ISearchCommunityResponse {
  id: string;
  name: string;
  description: string;
  avatar: Photo;
  fee: number;
  membersCount: number;
  communityStatus: string;
  type?: "users" | "communities";
}

export interface IQuickSearchResponse {
  users: ISearchUserResponse[];
  communities: ISearchCommunityResponse[];
}

export type FullSearchItem = ISearchUserResponse | ISearchCommunityResponse;

export type IFullSearchResponse = FullSearchItem[];
