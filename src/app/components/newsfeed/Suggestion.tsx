import React from "react";
import FeedPosts from "./FeedPosts";
import { getPosts } from "@/api/newsfeed/index";
import { FetchComments } from "./FetchComments";

const fetchPosts = async () => {
  try {
    const response: any = await getPosts(1, 20, "suggestion");
    console.log("server suggestion", response, "end");
    return response.data;
  } catch (err) {
    console.log(err);
    return { data: [], meta: { page: 1, totalPage: 1 } };
  }
};
/* eslint-disable react/display-name */
export const Suggestion = async (props: { postIdParams: string }) => {
  const res = await fetchPosts();
  const posts = res?.docs || [];
  const { page, totalPage, take } = res.meta;

  return (
    <div>
      <FeedPosts
        posts={posts}
        page={page}
        totalPage={totalPage}
        take={take}
        feedType="suggestion"
      >
        <FetchComments postId={props.postIdParams} />
      </FeedPosts>
    </div>
  );
};
