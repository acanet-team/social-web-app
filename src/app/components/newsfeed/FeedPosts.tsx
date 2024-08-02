"use client";
import React, { useEffect, useRef, useState } from "react";
import Postview from "./Postview";
import { fakePosts } from "@/app/fakeData/posts";
import { getPosts } from "@/api/newsfeed";
import Link from "next/link";
import WaveLoader from "../WaveLoader";

export default function FeedPosts(props: {
  posts: any[];
  page: number;
  totalPage: number;
  take: number;
  feedType: string;
  children: React.ReactNode;
}): JSX.Element {
  const list = useRef<HTMLDivElement>(null);
  // const [posts, setPosts] = useState<any[]>(props.posts || []);
  const [posts, setPosts] = useState<any[]>(fakePosts);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(props.totalPage);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response: any = await getPosts(
        props.page,
        props.take,
        props.feedType,
      );
      // console.log(response);
      setPosts((prevState) => [...prevState, ...response.data.docs]);
      setTotalPage(response.data.meta.totalPage);
      return response.data;
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Inifite scrolling
  const onScrollHandler = () => {
    if (list.current) {
      const { scrollTop, scrollHeight, clientHeight } = list.current;
      if (scrollTop + clientHeight === scrollHeight && !isLoading) {
        setPage((prevState) => prevState + 1);
        fetchPosts();
      }
    }
  };

  useEffect(() => {
    const currentList = list.current;
    if (currentList && page < totalPage) {
      currentList.addEventListener("scroll", onScrollHandler);
    }
    return () => {
      if (currentList) {
        currentList.removeEventListener("scroll", onScrollHandler);
      }
    };
  }, [page, totalPage]);

  return (
    <div ref={list}>
      {isLoading && <WaveLoader />}
      {posts?.length === 0 && props.feedType === "for_you" && (
        <Link href="/home?tab=suggestion">
          <button className="main-btn bg-current text-center text-white fw-600 p-2 w150 rounded-xxl border-0 d-block mt-5 mx-auto">
            Explore
          </button>
        </Link>
      )}
      {posts?.length > 0 &&
        posts.map((p) => (
          <div key={p.id}>
            <Postview
              id={p.id}
              user={p.user.firstName + " " + p.user.lastName}
              avatar={p.user.photo.path || "/assets/images/user.png"}
              content={p.content}
              assets={p.assets}
              createdAt={p.time}
              like={p.favoriteCount}
              comment={p.commentCount}
              // des={p.des}
            >
              {props.children}
            </Postview>
          </div>
        ))}
    </div>
  );
}
