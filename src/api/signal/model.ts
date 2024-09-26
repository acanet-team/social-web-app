export interface getSignalCardParams {
  page: number | "";
  type: "read" | "unread" | "";
  brokerId: number | "";
  existedSignalIds: string | "";
}

export interface getSignalCardResponse {
  id: string;
  signalPair: string;
  readAt: number;
  owner: {
    userId: number;
    firstName: string;
    lastName: string;
    nickName: string;
    followed: boolean;
    followersCount: string;
    photo: {
      id: string;
      path: string;
    };
  };
  type: string;
  description: string;
  entry: string;
  stop: string;
  target: string;
  expiryAt: number;
  createdAt: number;
  luckyAmount?: number | undefined;
  // These 2 are props
  brokerId?: number;
  curUserId?: number | undefined;
}

export interface ISignalDaily {
  id: string;
  signal_pair: string;
  type: string;
  expiryAt: number;
  owner: {
    uerId: number;
    firstName: string;
    lastName: string;
    nickName: string;
    followed: boolean;
    followersCount: string;
    photo: {
      id: string;
      path: string;
    };
  };
}
