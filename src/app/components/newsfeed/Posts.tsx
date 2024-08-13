"use client";
import React, { useEffect, useRef, useState } from "react";
import { getPosts } from "@/api/newsfeed";
import Link from "next/link";
import { cleanPath } from "@/utils/Helpers";
import PostView from "./Postview";
import { useTranslations } from "next-intl";
import DotWaveLoader from "../DotWaveLoader";

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
  // const [hasNextPage, setHasNextPage] = useState<Boolean>(props.hasNextPage);
  const [isFirstRender, setIsFirstRender] = useState<Boolean>(true);
  const t = useTranslations("Post");

  const fetchPosts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response: any = await getPosts(page, take, props.feedType);
      console.log(response);
      if (response && response.data.docs.length > 0) {
        setPosts((prev) => [...prev, ...response.data.docs]);
        setTotalPage(response.data.meta.totalPage);
        // setPage(response.data.meta.page);
        // setHasNextPage(response.data.meta.hasNextPage);
      } else {
        setPosts([]);
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
      if (scrollTop + clientHeight >= scrollHeight) {
        console.log("bbbb");
        setPage((page) => page + 1);
      }
    }
  };

  useEffect(() => {
    // if (setIsFirstRender && page === 1 && props.feedType === "suggestion") {
    //   setIsFirstRender(false);
    //   return;
    // }
    fetchPosts(page);
  }, [page, props.feedType]);

  useEffect(() => {
    setPage(1);
    setTotalPage(2);
  }, [props.feedType]);

  useEffect(() => {
    if (document.documentElement && page < totalPage) {
      // console.log("total pages", totalPage);
      // console.log("page", page);
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
        {!isLoading && posts?.length === 0 && props.feedType === "for_you" ? (
          <Link href="/home?tab=suggestion">
            <div className="text-center pointer align-items-center fw-600 text-grey-900 text-dark lh-26 font-xss mt-5">
              <span className="d-none-xs">{t("No_Posts_Found")}</span>
            </div>
            <button className="main-btn bg-current text-center text-white fw-600 p-2 w150 rounded-xxl border-0 d-block mb-5 mx-auto">
              {t("Explore_More")}
            </button>
          </Link>
        ) : (
          posts.map((p) => (
            <div key={p.id}>
              <PostView
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
                comment={p.commentCount}
                columnsCount={p.assets.length > 3 ? 3 : p.assets.length}
              />
            </div>
          ))
        )}
      </div>
      {isLoading && <DotWaveLoader />}
    </>
  );
}
