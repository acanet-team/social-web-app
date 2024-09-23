export interface getSignalCardParams {
  page: number | "";
  type: "read" | "unread" | "";
  brokerId: number | "";
  existedSignalIds: string | "";
}

export interface getSignalCardResponse {
  id: string;
  signalPair: string;
  isRead: boolean;
  owner: {
    userId: number;
    firstName: string;
    lastName: string;
    nickName: string;
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
}

export interface cardData {
  id: string;
  signalPair: string;
  readAt: number;
  owner: {
    userId: number;
    firstName: string;
    lastName: string;
    nickName: string;
    photo: {
      id: string;
      path: string;
    };
  };
}
