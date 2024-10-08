import React, { useCallback, useEffect, useState, useTransition } from "react";
import PostCard from "../newsfeed/Postcard";
import DotWaveLoader from "../DotWaveLoader";
import type { IPost } from "@/api/newsfeed/model";
import { getMyPosts } from "@/api/profile";
import { combineUniqueById } from "@/utils/combine-arrs";
import { cleanPath } from "@/utils/Helpers";
import { id } from "ethers/lib/utils";
import type { IPostCommunityInfo, IUserInfo } from "@/api/community/model";
import { useTranslations } from "next-intl";

const TabPostProfile = (props: {
  take: number;
  // totalPages: number;
  // curPage: number;
  role: boolean;
  id: string;
  isConnected: boolean;
  isBroker: boolean;
}) => {
  const t = useTranslations("MyProfile");
  const [myPosts, setMyPosts] = useState<IPost[]>([]);
  const [take, setTake] = useState<number>(props.take);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [hasFetchedInitialData, setHasFetchedInitialData] =
    useState<boolean>(false);

  const fetchPosts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response: any = await getMyPosts(
        page,
        take,
        "owner",
        Number(props.id),
      );
      console.log("postsssss", response);
      // setMyPosts((prev) => [...prev, ...response.data.docs]);
      setMyPosts((prev: IPost[]) => {
        const newPosts: IPost[] = combineUniqueById(
          prev,
          response.data.docs,
        ) as IPost[];
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
    if (document.documentElement && page < totalPage) {
      window.addEventListener("scroll", onScrollHandler);
    }
    return () => {
      if (document.documentElement) {
        window.removeEventListener("scroll", onScrollHandler);
      }
    };
  }, [page, totalPage, isLoading]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  useEffect(() => {
    console.log("useEffect triggered");
    setMyPosts([]);
    fetchPosts();
  }, [props.id]);

  // Avoid fetching data on initial render
  useEffect(() => {
    if (!hasFetchedInitialData) {
      setHasFetchedInitialData(true);
    }
  }, []);

  return (
    <div style={{ marginTop: "40px", paddingBottom: "100px" }}>
      {isLoading && <DotWaveLoader />}
      {props.isConnected || props.isBroker || props.role ? (
        myPosts && myPosts.length > 0 ? (
          myPosts.map((myPost, index) => (
            <div key={index}>
              <PostCard
                groupOwnerId={""}
                community={myPost.community as IPostCommunityInfo}
                postAuthor={myPost.user as IUserInfo}
                postId={myPost.id}
                postType={myPost.postType}
                additionalData={myPost.additionalData}
                content={myPost.content}
                assets={myPost.assets}
                createdAt={myPost.createdAt}
                like={myPost.favoriteCount}
                comment={myPost.commentCount}
                columnsCount={
                  myPost.assets?.length > 3 ? 3 : myPost.assets?.length
                }
                liked={myPost.liked}
                setPostHandler={setMyPosts}
              />
            </div>
          ))
        ) : (
          <div className="mt-5 text-center">{t("No posts found")}</div>
        )
      ) : (
        <div className="mt-5 text-center">{t("titlePostProfileInvestor")}</div>
      )}
    </div>
  );
};

export default TabPostProfile;
