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
  isTracking: boolean;
  luckyAmount?: number | undefined;
  readsCount: number | null;
  signalAccuracy: string | null;
  // These 2 are props
  brokerId?: number;
  curUserId?: number | undefined;
}

export interface ISignalDaily {
  id: string;
  signalPair: string;
  type: string;
  expiryAt: number;
  signalAccuracy: string | null;
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

export interface symbolEntryPriceResponse {
  data: {
    price: number;
  };
  message: string;
  statis: 200;
}

export interface createSignalParams {
  signalPair: string;
  type: string;
  expiryAt: number;
  entry: string;
  target: string;
  stop: string;
  description: string;
}

export interface createSignalResponse {
  id: string;
  signal_pair: string;
  expiry_at: number;
  entry: number;
  target: number;
  stop: number;
  owner_id: number;
  desctiption: string | null;
  createdAt: number;
}
