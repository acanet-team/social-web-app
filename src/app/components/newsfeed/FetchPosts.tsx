import React from "react";
import FeedPosts from "./FeedPosts";
import { getPosts } from "@/api/newsfeed/index";
import { FetchComments } from "./FetchComments";

const fetchPosts = async () => {
  try {
    const response: any = await getPosts(1, 20, "for_you");
    console.log(response);
    return response.data;
  } catch (err) {
    console.log(err);
    return { data: [], meta: { page: 1, totalPage: 1 } };
  }
};
/* eslint-disable react/display-name */
export const FetchPosts = React.memo(
  async (props: { postIdParams: string }) => {
    const res = await fetchPosts();
    const posts = res?.data?.docs || [];
    console.log(posts);

    return (
      <div>
        <FeedPosts posts={posts}>
          <FetchComments postId={props.postIdParams} />
        </FeedPosts>
      </div>
    );
  },
);
