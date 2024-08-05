import React from "react";
import FeedPosts from "./FeedPosts";
import { FetchComments } from "./FetchComments";

export const ForYou = async (props: { postIdParams: string; tab: string }) => {
  return (
    <div>
      <FeedPosts feedType={props.tab}>
        <FetchComments postId={props.postIdParams} />
      </FeedPosts>
    </div>
  );
};
