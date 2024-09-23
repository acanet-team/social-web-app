export interface joinGroupValueParams {
  communityId: string;
  hashTransaction: string;
  network: string;
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
