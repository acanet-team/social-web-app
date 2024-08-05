import React from "react";
import FeedPosts from "./FeedPosts";
import { getPosts } from "@/api/newsfeed/index";
import { FetchComments } from "./FetchComments";

export const Suggestion = async (props: { postIdParams: string }) => {
  return (
    <div>
      <FeedPosts feedType="suggestion">
        <FetchComments postId={props.postIdParams} />
      </FeedPosts>
    </div>
  );
};
