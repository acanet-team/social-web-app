import { cleanPath } from "@/utils/Helpers";
import React, { useEffect, useState } from "react";
import DotWaveLoader from "../DotWaveLoader";
import PostCard from "../newsfeed/Postcard";
import { getCommunityPosts } from "@/api/community";
import { combineUniqueById } from "@/utils/combine-arrs";

export default function CommunityFeed(props: {
  posts: any;
  take: number;
  allPage: number;
  curPage: number;
  groupId: string;
}) {
  const [posts, setPosts] = useState<any[]>(props.posts);
  const [take, setTake] = useState<number>(props.take);
  const [page, setPage] = useState<number>(props.curPage);
  const [totalPage, setTotalPage] = useState<number>(props.allPage);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [hasFetchedInitialData, setHasFetchedInitialData] =
    useState<boolean>(false);

  // useEffect(() => {
  //   // setPosts(prev => [...posts, ...prev]);
  //   setPosts((prev) => {
  //     const newPosts = combineUniqueById(prev, posts);
  //     return newPosts;
  //   });
  // }, [post]);

  const fetchPosts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response: any = await getCommunityPosts(
        1,
        take,
        "community",
        props.groupId,
      );
      console.log("posts", response);
      setPosts((prev) => {
        const newPosts = combineUniqueById(prev, response.data.docs);
        return newPosts;
      });
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
      if (
        scrollTop + clientHeight >= scrollHeight &&
        !isLoading &&
        page < totalPage
      ) {
        setPage((page) => page + 1);
      }
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  useEffect(() => {
    if (hasFetchedInitialData) {
      setPage(1);
      setTotalPage(2);
      setPosts([]);
    }
  }, []);
  // useEffect(() => {
  //   setPage(1);
  //   setTotalPage(2);
  //   setPosts([]);
  // }, [props.feedType]);

  useEffect(() => {
    if (document.documentElement && page < totalPage) {
      window.addEventListener("scroll", onScrollHandler);
    }
    return () => {
      if (document.documentElement) {
        window.removeEventListener("scroll", onScrollHandler);
      }
    };
  }, [page, totalPage, isLoading]);

  // Avoid fetching data on initial render
  useEffect(() => {
    if (!hasFetchedInitialData) {
      setHasFetchedInitialData(true);
    }
  }, []);

  return (
    <>
      <div>
        {posts.map((p) => (
          <div key={p.id}>
            <PostCard
              postId={p.id}
              nickName={
                p.user.nickName || p.user.firstName + " " + p.user.lastName
              }
              author={p.user.userId}
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
              liked={p.liked}
              setPostHandler={setPosts}
            />
          </div>
        ))}
      </div>
      {isLoading && <DotWaveLoader />}
    </>
  );
}
