// import React from "react";
// import FeedPosts from "./FeedPosts";
// import { getPosts } from "@/api/newsfeed/index";
// import { FetchComments } from "./FetchComments";

// const fetchPosts = async () => {
//   try {
//     const response: any = await getPosts(1, 20, "for_you");
//     console.log("for you", response);
//     return response.data;
//   } catch (err) {
//     console.log(err);
//     return { data: [], meta: { page: 1, totalPage: 1 } };
//   }
// };
// /* eslint-disable react/display-name */
// export const ForYou = async (props: { postIdParams: string }) => {
//   const res = await fetchPosts();
//   const posts = res?.docs || [];
//   const { page, totalPage, take } = res.meta;
//   // console.log(posts);

//   return (
//     <div>
//       <FeedPosts
//         posts={posts}
//         page={page}
//         totalPage={totalPage}
//         take={take}
//         feedType="for_you"
//       >
//         <FetchComments postId={props.postIdParams} />
//       </FeedPosts>
//     </div>
//   );
// };

import React from "react";
import FeedPosts from "./FeedPosts";
import { getPosts } from "@/api/newsfeed/index";
import { FetchComments } from "./FetchComments";

const fetchPosts = async (tab: string) => {
  try {
    const response: any = await getPosts(1, 20, tab);
    console.log(tab, response);
    return response.data;
  } catch (err) {
    console.log(err);
    return { data: [], meta: { page: 1, totalPage: 1 } };
  }
};
/* eslint-disable react/display-name */
export const ForYou = async (props: { postIdParams: string; tab: string }) => {
  const res = await fetchPosts(props.tab);
  const posts = res?.docs || [];
  const { page, totalPage, take } = res.meta;
  // console.log(posts);

  return (
    <div>
      <FeedPosts
        posts={posts}
        page={page}
        totalPage={totalPage}
        take={take}
        feedType={props.tab}
      >
        <FetchComments postId={props.postIdParams} />
      </FeedPosts>
    </div>
  );
};
