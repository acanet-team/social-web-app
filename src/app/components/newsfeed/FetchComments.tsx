import { getComments } from "@/api/newsfeed";
import { commentArr } from "@/app/fakeData/comments";
import React from "react";
import { Comments } from "./Comments";

const fetchComments = async (postId: string) => {
  try {
    const response = await getComments(1, 20, postId);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
    return {
      data: [],
      meta: {
        page: 1,
        totalPage: 1,
        take: 20,
        hasPreviousPage: false,
        hasNextPage: false,
        total: 1,
      },
    };
  }
};

/* eslint-disable react/display-name */
export const FetchComments = React.memo(async (props: { postId: string }) => {
  console.log("postId", props.postId, "end");
  const response = await fetchComments(props.postId);
  // const comments = response.data ?? response.docs ?? [];
  const comments: any[] = commentArr;
  const page = response.meta.page;
  const totalPage = response.meta.totalPage;
  const take = response.meta.take;

  return (
    <div>
      <Comments
        comments={comments}
        page={page}
        totalPage={totalPage}
        take={take}
        postId={props.postId}
      />
    </div>
  );
});
