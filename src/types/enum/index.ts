export enum TabEnum {
  ForYou = "for_you",
  Suggestion = "suggestion",
}

export enum TabPnum {
  Posts = "posts",
  Communities = "communities",
  About = "about",
  Rating = "rating",
  Signal = "signal",
  Nft = "nft",
}
export enum CommunityEnum {
  popular = "popular",
  following = "following",
  owned = "owned",
}

export enum CommunityViewEnum {
  posts = "posts",
  members = "members",
  requests = "requests",
}

export enum CommunityJoiningStatus {
  not_join = "",
  pending = "pending_request", // Đang gửi yêu cầu vào nhóm
  joined = "joined", // Đã vào nhóm
  invited = "invited", // Đã gửi lời mời vào nhóm
  rejected = "rejected", // Bị từ chối
  banned = "banned", // Bị ban
}

export enum SignalStationEnum {
  discover = "discover",
  history = "history",
}

export enum ConvertType {
  normal_number = "normal",
  datetime = "datetime",
}

export enum QuerryConnectionType {
  requester = "requester",
  addressee = "addressee",
}

export enum ConnectionStatus {
  pending = "pending_request",
  accepted = "accepted",
}

export enum SearchPageTabs {
  all = "all",
  people = "people",
  community = "community",
  posts = "posts",
}
