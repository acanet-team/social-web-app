import type { IPost, ResponseDto } from "@/api/newsfeed/model";
import { getDetailPost } from "@/api/notification";
import PostModal from "@/components/newsfeed/PostModal";

import type { NextPageContext, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/esm/Modal";
import styles from "@/styles/modules/postModal.module.scss";
import Image from "next/image";
import Link from "next/link";
import { TimeSinceDate } from "@/utils/time-since-date";
import { Box } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import RoundedNumber from "@/components/RoundedNumber";
import Comments from "@/components/newsfeed/Comments";
import { likeRequest } from "@/api/newsfeed";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "react-responsive";
import type { IPostCommunityInfo } from "@/api/community/model";

const DetailPost = ({
  idParam,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [dataPost, setDataPost] = useState<IPost>();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [openComments, setOpenComments] = useState<boolean>(false);
  const [openMobileComments, setOpenMobileComments] = useState<boolean>(true);
  const { data: session } = useSession() as any;
  const [userId, setUserId] = useState<number>();
  const [feedPosts, setPosts] = useState<IPost[]>();
  const [isLiked, setIsLiked] = useState<boolean>(
    (dataPost && dataPost.liked) || false,
  );
  const [likeNum, setLikeNum] = useState<number>(
    (dataPost && dataPost.favoriteCount) || 0,
  );
  const [commentNum, setCommentNum] = useState<number>(
    dataPost?.commentCount || 0,
  );

  const handleClose = useCallback(() => {
    if (isMobile) {
      setOpenMobileComments(false);
    } else {
      setOpenComments((open) => !open);
    }
  }, []);

  useEffect(() => {
    if (session) {
      setUserId(session.user?.id);
    }
  }, [session]);

  const updateLikeHandler = useCallback((action: string) => {
    if (action === "add") {
      setLikeNum((prevState: number) => prevState + 1);
    } else {
      setLikeNum((prevState: number) => prevState - 1);
    }
  }, []);

  const updateCommentHandler = useCallback((action: string) => {
    if (action === "add") {
      setCommentNum((prevState: number) => prevState + 1);
    } else {
      setCommentNum((prevState: number) => prevState - 1);
    }
  }, []);

  // const [fullscreen, setFullscreen] = useState(
  //   window.innerWidth <= 768 ? "sm-down" : undefined
  // );
  // const commentListMobileRef = useRef<any>(null);
  // const childRef = useRef<any>(null);
  // const [openSettings, setOpenSettings] = useState<boolean>(false);
  // const settingsRef = useRef<HTMLDivElement>(null);
  // const [expandPost, setExpandPost] = useState<boolean>(false);
  // const tBase = useTranslations("Base");

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (isMobile && commentListMobileRef.current) {
  //       const { scrollTop, scrollHeight, clientHeight } =
  //         commentListMobileRef.current;
  //       if (scrollTop + clientHeight >= scrollHeight) {
  //         childRef.current.fetchMobileComments();
  //       }
  //     }
  //   };

  //   const div = commentListMobileRef.current;
  //   if (div) {
  //     div.addEventListener("scroll", handleScroll);
  //   }

  //   return () => {
  //     if (div) {
  //       div.removeEventListener("scroll", handleScroll);
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     if (
  //       settingsRef.current &&
  //       !settingsRef.current.contains(event.target as Node)
  //     ) {
  //       setOpenSettings(false);
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [settingsRef]);

  // // const onDeletePost = async (e: any, postId: string) => {
  // //   try {
  // //     // Calling api;
  // //     await deletePost(postId);
  // //     setPostHandler((prev) => prev.filter((post) => post.id !== postId));
  // //     throwToast("Post was successfully deleted", "success");
  // //   } catch (err) {
  // //     console.log(err);
  // //   }
  // // };

  // const onClickLikeHandler = (e: any, id: string, like: number) => {
  //   const likeBtn = e.target;
  //   if (likeBtn) {
  //     try {
  //       if (isLiked) {
  //         setLikeNum((prev) => prev - 1);
  //         updateLikeHandler("remove");
  //         setIsLiked(false);
  //         setIsLiked(false);
  //         likeRequest({ postId: id, action: "unfavorite" });
  //       } else {
  //         setLikeNum((prev) => prev + 1);
  //         updateLikeHandler("add");
  //         setIsLiked(true);
  //         setIsLiked(true);
  //         likeRequest({ postId: id, action: "favorite" });
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // };

  useEffect(() => {
    const getDataDetailPost = async () => {
      if (idParam) {
        try {
          const res = await getDetailPost(idParam as string);
          console.log("detaillll", res);
          setDataPost(res.data);
        } catch (error) {
          console.error("Failed to fetch post details", error);
        }
      } else {
        console.error("No id provided in params");
      }
    };

    getDataDetailPost();
  }, [idParam]);

  return (
    <>
      {dataPost && (
        <PostModal
          groupOwnerId=""
          show={openMobileComments}
          curUser={userId}
          postAuthor={dataPost.user}
          community={dataPost.community as IPostCommunityInfo}
          postId={idParam as string}
          content={dataPost.content}
          assets={dataPost.assets}
          createdAt={dataPost.createdAt}
          columnsCount={
            dataPost.assets?.length > 3 ? 3 : dataPost.assets?.length
          }
          like={likeNum}
          comment={commentNum}
          liked={isLiked}
          handleClose={handleClose}
          updateLike={updateLikeHandler}
          updateComments={updateCommentHandler}
          updateIsLiked={setIsLiked}
          // setPostHandler={setDataPost}
        />
      )}
    </>
  );
};

export default DetailPost;
export async function getServerSideProps(context: NextPageContext) {
  const { id } = context.query;
  if (!id) {
    return {
      notFound: true,
    };
  }
  // const res = await getDetailNotis(id as string);
  // console.log("detaillll", res);
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
      idParam: id,
      // res: res,
    },
  };
}
