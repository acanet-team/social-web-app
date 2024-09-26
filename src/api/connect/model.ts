export interface IConnect {
  id: string;
  connectionStatus: string;
  requester: {
    userId: number;
    firstName: string;
    lastName: string;
    nickName: string;
    role: string;
    photo: {
      id: string;
      path: string;
    };
  };
  addressee: {
    userId: number;
    firstName: string;
    lastName: string;
    nickName: string;
    role: string;
    photo: {
      id: string;
      path: string;
    };
  };
  connectAt: number;
  createAt: number;
}

export interface IConnectRequest {
  id: string;
  requeterId: number;
  addresseeId: number;
}
