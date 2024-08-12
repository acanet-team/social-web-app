"use client";
import React, { useEffect, useState } from "react";
import { getPosts } from "@/api/newsfeed";
import Link from "next/link";
import { cleanPath } from "@/utils/Helpers";
import PostCard from "./Postview";
import { useTranslations } from "next-intl";
import DotWaveLoader from "../DotWaveLoader";

export default function FeedPosts(props: {
  feedType: string;
  children?: React.ReactNode;
}): JSX.Element {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [take, setTake] = useState<number>(20);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const t = useTranslations("Post");

  const fetchPosts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response: any = await getPosts(page, take, props.feedType);
      if (response && response.data.docs.length > 0) {
        setPosts((prev) => [...prev, ...response.data.docs]);
        setTotalPage(response.data.meta.totalPage);
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
      if (scrollTop + clientHeight >= scrollHeight && !isLoading) {
        setPage(page + 1);
      }
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page, props.feedType]);

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
      {isLoading && <DotWaveLoader />}
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
              <PostCard
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
                columnsCount={p.assets.length > 3 ? 3 : p.assets.length}>
                {props.children}
              </PostCard>
            </div>
          ))
        )}
      </div>
    </>
  );
}
