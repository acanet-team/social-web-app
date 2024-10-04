import httpClient from "..";
import type { ResponseDto } from "../newsfeed/model";
import type { sellNFTParams } from "./model";
import type { Post } from "@/types";

export const onSellNFT = (values: sellNFTParams) => {
  return httpClient.post<sellNFTParams, ResponseDto<Post>>(
    `/v1/post/sell-nft`,
    values,
  );
};
