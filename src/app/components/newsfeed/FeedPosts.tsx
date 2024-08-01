"use client";
import React, { useState } from "react";
import Postview from "./Postview";
import { posts } from "@/app/fakeData/posts";

export default function FeedPosts(props: {
  posts: any[];
  children: React.ReactNode;
}): JSX.Element {
  // const [posts, setPosts] = useState<any[]>(props.posts);

  return (
    <div>
      {posts?.length > 0 &&
        posts.map((p) => (
          <div key={p.id}>
            <Postview
              id={p.id}
              postvideo={p.postvideo}
              postimage={p.postimage}
              avatar={p.avatar ? p.avatar : "/assets/images/user.png"}
              user={p.user}
              time={p.time}
              like={p.like}
              comment={p.comment}
              des={p.des}
            >
              {props.children}
            </Postview>
          </div>
        ))}
    </div>
  );
}
