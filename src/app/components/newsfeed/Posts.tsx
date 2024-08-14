"use client";
import React, { useEffect, useRef, useState } from "react";
import { getPosts } from "@/api/newsfeed";
import { cleanPath } from "@/utils/Helpers";
import PostCard from "./Postcard";
import { useTranslations } from "next-intl";
import DotWaveLoader from "../DotWaveLoader";
import { usePostStore } from "@/store/newFeed";

export default function Posts(props: {
  posts: any;
  feedType: string;
  take: number;
  allPage: number;
  curPage: number;
}): JSX.Element {
  const [posts, setPosts] = useState<any[]>(props.posts);
  const [take, setTake] = useState<number>(props.take);
  const [page, setPage] = useState<number>(props.curPage);
  const [totalPage, setTotalPage] = useState<number>(props.allPage);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const t = useTranslations("Post");
  const post = usePostStore((state) => state.posts);

  useEffect(() => {
    setPosts((prev) => [...post, ...prev]);
  }, [post]);
  const fetchPosts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response: any = await getPosts(page, take, props.feedType);
      console.log(response);
      setPosts((prev) => [...prev, ...response.data.docs]);
      setTotalPage(response.data.meta.totalPage);
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
      if (scrollTop + clientHeight >= scrollHeight) {
        console.log("bbbb");
        setPage((page) => page + 1);
      }
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page, props.feedType]);

  useEffect(() => {
    setPage(1);
    setTotalPage(2);
    setPosts([]);
  }, [props.feedType]);

  useEffect(() => {
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
      <div>
        {!isLoading && posts?.length === 0 && props.feedType === "for_you" ? (
          <div>
            <div className="text-center pointer align-items-center lh-26 font-xss mt-5 mb-3">
              <span className="d-none-xs fw-600 text-grey-700">
                {t("No_Posts_Found")}
              </span>
            </div>
            <button
              className="main-btn bg-current text-center text-white fw-600 p-2 w150 rounded-xxl border-0 d-block mb-5 mx-auto"
              onClick={() => (window.location.href = "/")}
            >
              {t("Explore_More")}
            </button>
          </div>
        ) : (
          posts.map((p) => (
            <div key={p.id}>
              <PostCard
                id={p.id}
                user={p.user?.firstName + " " + p.user?.lastName}
                userId={p.user?.userId}
                avatar={
                  p.user?.photo?.id
                    ? cleanPath(p.user?.photo?.path)
                    : "/assets/images/user.png"
                }
                content={p.content}
                assets={p?.assets}
                createdAt={p.createdAt}
                like={p.favoriteCount}
                comment={p.commentCount}
                columnsCount={p.assets?.length > 3 ? 3 : p.assets?.length}
              />
            </div>
          ))
        )}
      </div>
      {isLoading && <DotWaveLoader />}
    </>
  );
}
