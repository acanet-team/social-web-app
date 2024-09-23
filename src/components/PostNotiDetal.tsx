// import type { IPost, ResponseDto } from "@/api/newsfeed/model";
// import { getDetailPost } from "@/api/notification";
// import PostModal from "@/components/newsfeed/PostModal";

// import type { NextPageContext, InferGetServerSidePropsType } from "next";
// import { useSession } from "next-auth/react";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import Modal from "react-bootstrap/esm/Modal";
// import styles from "@/styles/modules/postModal.module.scss";
// import Image from "next/image";
// import Link from "next/link";
// import { TimeSinceDate } from "@/utils/time-since-date";
// import { Box } from "@mui/material";
// import Masonry from "@mui/lab/Masonry";
// import RoundedNumber from "@/components/RoundedNumber";
// import Comments from "@/components/newsfeed/Comments";
// import { likeRequest } from "@/api/newsfeed";
// import { useTranslations } from "next-intl";
// import { useMediaQuery } from "react-responsive";

// const PostNotiDetail = (props: {
//   id: string;
//   resetPostId: React.Dispatch<React.SetStateAction<void>>;
// }) => {
//   const { id, resetPostId } = props;
//   const [dataPost, setDataPost] = useState<IPost>();
//   const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
//   const [openComments, setOpenComments] = useState<boolean>(false);
//   const [openMobileComments, setOpenMobileComments] = useState<boolean>(true);
//   const { data: session } = useSession() as any;
//   const [userId, setUserId] = useState<number>();
//   const [feedPosts, setPosts] = useState<IPost[]>();
//   const [isLiked, setIsLiked] = useState<boolean>(dataPost?.liked || false);
//   const [likeNum, setLikeNum] = useState<number>(dataPost?.favoriteCount || 0);
//   const [commentNum, setCommentNum] = useState<number>(
//     dataPost?.commentCount || 0,
//   );

//   const handleClose = useCallback(() => {
//     if (isMobile) {
//       setOpenMobileComments(false);
//     } else {
//       setOpenComments((open) => !open);
//     }
//     resetPostId();
//   }, []);

//   useEffect(() => {
//     if (session) {
//       setUserId(session.user?.id);
//     }
//   }, [session]);

//   const updateLikeHandler = useCallback((action: string) => {
//     if (action === "add") {
//       setLikeNum((prevState: number) => prevState + 1);
//     } else {
//       setLikeNum((prevState: number) => prevState - 1);
//     }
//   }, []);

//   const updateCommentHandler = useCallback((action: string) => {
//     if (action === "add") {
//       setCommentNum((prevState: number) => prevState + 1);
//     } else {
//       setCommentNum((prevState: number) => prevState - 1);
//     }
//   }, []);

//   useEffect(() => {
//     const getDataDetailPost = async () => {
//       if (id) {
//         try {
//           const res = await getDetailPost(id as string);
//           setDataPost(res.data);
//           setLikeNum(res.data.favoriteCount);
//           setCommentNum(res.data.commentCount);
//           setIsLiked(res.data.liked);
//         } catch (error) {
//           console.error("Failed to fetch post details", error);
//         }
//       } else {
//         console.error("No id provided in params");
//       }
//     };

//     getDataDetailPost();
//   }, [id]);

//   return (
//     <>
//       {dataPost && (
//         <PostModal
//           show={openMobileComments}
//           handleClose={handleClose}
//           postId={id}
//           userId={userId}
//           nickName={
//             dataPost.user?.nickName ||
//             dataPost.user?.firstName + dataPost.user?.lastName
//           }
//           avatar={dataPost.user?.photo?.path || "/assets/images/user.png"}
//           content={dataPost.content}
//           assets={dataPost.assets}
//           authorId={dataPost.user?.userId}
//           authorNickname={dataPost.user?.nickName || ""}
//           createdAt={dataPost.createdAt}
//           columnsCount={
//             dataPost.assets?.length > 3 ? 3 : dataPost.assets?.length
//           }
//           groupAvatar={dataPost.community?.avatar?.path || ""}
//           groupName={dataPost.community?.name || ""}
//           groupOwnerId={""}
//           groupId={dataPost.community?.communityId || ""}
//           like={likeNum}
//           comment={commentNum}
//           liked={isLiked}
//           updateLike={updateLikeHandler}
//           updateComments={updateCommentHandler}
//           updateIsLiked={setIsLiked}
//           // setPostHandler={setPosts}
//         />
//       )}
//     </>
//   );
// };

// export default PostNotiDetail;

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

const PostNotiDetail = (props: {
  id: string;
  resetPostId: React.Dispatch<React.SetStateAction<void>>;
}) => {
  const { id, resetPostId } = props;
  const [dataPost, setDataPost] = useState<IPost>();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [openComments, setOpenComments] = useState<boolean>(false);
  const [openMobileComments, setOpenMobileComments] = useState<boolean>(true);
  const { data: session } = useSession() as any;
  const [userId, setUserId] = useState<number>();
  const [feedPosts, setPosts] = useState<IPost[]>();
  const [isLiked, setIsLiked] = useState<boolean>(dataPost?.liked || false);
  const [likeNum, setLikeNum] = useState<number>(dataPost?.favoriteCount || 0);
  const [commentNum, setCommentNum] = useState<number>(
    dataPost?.commentCount || 0,
  );

  const handleClose = useCallback(() => {
    if (isMobile) {
      setOpenMobileComments(false);
    } else {
      setOpenComments((open) => !open);
    }
    resetPostId();
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

  useEffect(() => {
    const getDataDetailPost = async () => {
      if (id) {
        try {
          const res = await getDetailPost(id as string);
          setDataPost(res.data);
          setLikeNum(res.data.favoriteCount);
          setCommentNum(res.data.commentCount);
          setIsLiked(res.data.liked);
        } catch (error) {
          console.error("Failed to fetch post details", error);
        }
      } else {
        console.error("No id provided in params");
      }
    };

    getDataDetailPost();
  }, [id]);

  return (
    <>
      {dataPost && (
        <PostModal
          // show={openMobileComments}
          // handleClose={handleClose}
          // postId={id}
          // userId={userId}
          // nickName={
          //   dataPost.user?.nickName ||
          //   dataPost.user?.firstName + dataPost.user?.lastName
          // }
          // avatar={dataPost.user?.photo?.path || "/assets/images/user.png"}
          // content={dataPost.content}
          // assets={dataPost.assets}
          // authorId={dataPost.user?.userId}
          // authorNickname={dataPost.user?.nickName || ""}
          // createdAt={dataPost.createdAt}
          // columnsCount={
          //   dataPost.assets?.length > 3 ? 3 : dataPost.assets?.length
          // }
          // groupAvatar={dataPost.community?.avatar?.path || ""}
          // groupName={dataPost.community?.name || ""}
          // groupOwnerId={""}
          // groupId={dataPost.community?.communityId || ""}
          // like={likeNum}
          // comment={commentNum}
          // liked={isLiked}
          // updateLike={updateLikeHandler}
          // updateComments={updateCommentHandler}
          // updateIsLiked={setIsLiked}

          show={openMobileComments}
          handleClose={handleClose}
          postId={id}
          curUser={userId}
          postAuthor={dataPost.user}
          community={dataPost.community as IPostCommunityInfo}
          content={dataPost.content}
          assets={dataPost.assets}
          createdAt={dataPost.createdAt}
          columnsCount={
            dataPost.assets?.length > 3 ? 3 : dataPost.assets?.length
          }
          like={likeNum}
          comment={commentNum}
          liked={isLiked}
          updateLike={updateLikeHandler}
          updateComments={updateCommentHandler}
          updateIsLiked={setIsLiked}
          groupOwnerId=""
        />
      )}
    </>
  );
};

export default PostNotiDetail;
