"use client";
import React, { useEffect, useRef, useState } from "react";
import Postview from "./Postview";
import { getPosts } from "@/api/newsfeed";
import Link from "next/link";
import styles from "@/styles/modules/interest.module.scss";
import WaveLoader from "../WaveLoader";

export default function FeedPosts(props: {
  posts: any[];
  page: number;
  totalPage: number;
  take: number;
  feedType: string;
  children: React.ReactNode;
}): JSX.Element {
  const [posts, setPosts] = useState<any[]>(props.posts || []);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(props.totalPage || 1);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  console.log("client", props.posts);
  console.log("client", props.page);
  const fetchPosts = async (page = props.page || 1) => {
    try {
      setIsLoading(true);
      const response: any = await getPosts(page, props.take, props.feedType);
      // console.log(response);
      setPosts((prevState) => [...prevState, ...response.data.docs]);
      setTotalPage(response.data.meta.totalPage);
      console.log("feed posts", response.data);
      return response.data;
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Inifite scrolling
  // const onScrollHandler = () => {
  //   if (document.documentElement) {
  //     const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  //     if (scrollTop + clientHeight >= scrollHeight && !isLoading) {
  //         setPage((prevState) => prevState + 1);
  //         fetchPosts();
  //     }
  //   }
  // };

  const onScrollHandler = () => {
    if (document.documentElement) {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight && !isLoading) {
        console.log("Page", props.page);
        setPage((page) => page++);
        console.log("Pag", page);
        Promise.all([fetchPosts(page)]);
      }
    }
  };

  // useEffect(() => {
  //   const currentList = document.documentElement;
  //   if (currentList && page < totalPage) {
  //     currentList.addEventListener("scroll", onScrollHandler);
  //   }
  //   return () => {
  //     if (currentList) {
  //       currentList.removeEventListener("scroll", onScrollHandler);
  //     }
  //   };
  // }, [page, totalPage]);
  useEffect(() => {
    if (document.documentElement && page < totalPage) {
      window.addEventListener("scroll", onScrollHandler);
    }
    return () => {
      if (document.documentElement) {
        window.removeEventListener("scroll", onScrollHandler);
      }
    };
  }, [page, totalPage]);

  return (
    <>
      <div>
        {posts?.length === 0 && props.feedType === "for_you" && (
          <Link href="/home?tab=suggestion">
            <button className="main-btn bg-current text-center text-white fw-600 p-2 w150 rounded-xxl border-0 d-block my-5 mx-auto">
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
                userId={p.user.userId}
                // avatar={p.user?.photo?.id ? p.user?.photo?.path : '/assets/images/user.png'}
                avatar={"/assets/images/user.png"}
                content={p.content}
                assets={p.assets}
                createdAt={p.createdAt}
                like={p.favoriteCount}
                comment={p.commentCount}
              >
                {props.children}
              </Postview>
            </div>
          ))}
      </div>
      {isLoading && (
        <div className="d-flex justify-content-center">
          <div className={styles["dots-3"]}></div>
          <div className={styles["dots-3"]}></div>
        </div>
      )}
    </>
  );
}
