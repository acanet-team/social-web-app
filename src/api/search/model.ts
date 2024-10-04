interface Photo {
  id: string;
  path: string;
}

export interface ISearchUserResponse {
  userId: number;
  firstName: string;
  lastName: string;
  photo: Photo;
  role: string;
  followersCount: number;
  follow_status: "followed" | "not_follow" | null;
  connection_status:
    | "connected"
    | "request_send"
    | "request_received"
    | "not_connected"
    | null;
  connectionRequestId: string;
  type?: "user" | "community";
}

export interface ISearchCommunityResponse {
  id: string;
  name: string;
  description: string;
  avatar: Photo;
  fee: number;
  membersCount: number;
  communityStatus: string;
  type?: "user" | "community";
}

export interface IQuickSearchResponse {
  users: ISearchUserResponse[];
  communities: ISearchCommunityResponse[];
}

export type FullSearchItem = ISearchUserResponse | ISearchCommunityResponse;

export type IFullSearchResponse = FullSearchItem[];
