"use client";
import React, { useEffect, useState } from "react";
import Postview from "./Postview";
import { getPosts } from "@/api/newsfeed";
import Link from "next/link";
import styles from "@/styles/modules/interest.module.scss";
import { cleanPath } from "@/utils/Helpers";

export default function FeedPosts(props: {
  feedType: string;
  children: React.ReactNode;
}): JSX.Element {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [take, setTake] = useState<number>(20);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const fetchPosts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response: any = await getPosts(page, take, props.feedType);
      if (response && response.data) {
        setPosts((prev) => [...prev, ...response.data.docs]);
        setTotalPage(response.data.meta.totalPage);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onScrollHandler = () => {
    if (document.documentElement) {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight && !isLoading) {
        setPage(page + 1);
      }
    }
  };

  useEffect(() => {
    fetchPosts(page);
    if (document.documentElement && page < totalPage) {
      window.addEventListener("scroll", onScrollHandler);
    }
    return () => {
      if (document.documentElement) {
        window.removeEventListener("scroll", onScrollHandler);
      }
    };
  }, [page, totalPage, props.feedType]);

  return (
    <>
      {isLoading && (
        <div className="d-flex justify-content-center">
          <div className={styles["dots-3"]}></div>
          <div className={styles["dots-3"]}></div>
        </div>
      )}
      <div>
        {!isLoading && posts?.length === 0 && props.feedType === "for_you" ? (
          <Link href="/home?tab=suggestion">
            <button className="main-btn bg-current text-center text-white fw-600 p-2 w150 rounded-xxl border-0 d-block my-5 mx-auto">
              Explore
            </button>
          </Link>
        ) : (
          posts.map((p) => (
            <div key={p.id}>
              <Postview
                id={p.id}
                user={p.user.firstName + " " + p.user.lastName}
                userId={p.user.userId}
                avatar={
                  p.user?.photo?.id
                    ? cleanPath(p.user?.photo?.path)
                    : "/assets/images/user.png"
                }
                content={p.content}
                assets={p.assets}
                createdAt={p.createdAt}
                like={p.favoriteCount}
                comment={p.commentCount}>
                {props.children}
              </Postview>
            </div>
          ))
        )}
      </div>
    </>
  );
}
