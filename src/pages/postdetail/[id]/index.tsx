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
          // show={openMobileComments}
          // handleClose={handleClose}
          // postId={idParam as string}
          // userId={userId}
          // nickName={
          //   dataPost.user?.nickName ||
          //   dataPost.user?.firstName + dataPost.user?.lastName
          // }
          // avatar={dataPost.user?.photo?.path}
          // content={dataPost.content}
          // assets={dataPost.assets}
          // authorId={dataPost.user?.userId}
          // authorNickname={dataPost.user?.nickName || ""}
          // createdAt={dataPost.createdAt}
          // columnsCount={
          //   dataPost.assets?.length > 3 ? 3 : dataPost.assets?.length
          // }
          // groupAvatar={dataPost.community?.avatar.path || ""}
          // groupName={dataPost.community?.name || ""}
          // groupOwnerId={""}
          // groupId={dataPost.community?.communityId || ""}
          // like={likeNum}
          // comment={commentNum}
          // liked={isLiked}
          // updateLike={updateLikeHandler}
          // updateComments={updateCommentHandler}
          // updateIsLiked={setIsLiked}

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
        // <Modal
        //   fullscreen={fullscreen}
        //   show={openMobileComments}
        //   onHide={handleClose}
        //   centered
        //   size="lg"
        //   className={`${styles["customModal"]} nunito-font`}
        // >
        //   <Modal.Header
        //     closeButton={fullscreen === "sm-down" ? false : true}
        //     className={styles["modal-header"]}
        //     style={{ height: "50px" }}
        //   >
        //     {fullscreen && (
        //       <i
        //         className={`${styles["modal-back__btn"]} bi bi-arrow-left h1 m-0`}
        //         onClick={handleClose}
        //       ></i>
        //     )}
        //     <h2 className="p-0 m-0 fs-4 fw-bold">
        //       {dataPost.user?.nickName ||
        //         dataPost.user?.firstName + dataPost.user?.lastName}
        //       &apos;s post
        //     </h2>
        //   </Modal.Header>
        //   <div className="border-top" />
        //   <Modal.Body className={styles["modal-content"]}>
        //     {/* Post content */}
        //     <div
        //       className={`${styles.post} post-card card w-100 h-100 shadow-xss rounded-3 border-0 p-sm-3 p-1 mb-3`}
        //       ref={commentListMobileRef}
        //     >
        //       <div className="card-body p-0 d-flex">
        //         <figure className="avatar me-3">
        //           {dataPost.community?.avatar.path || "" ? (
        //             <div className="position-relative">
        //               <Image
        //                 src={dataPost.community?.avatar.path || ""}
        //                 width={45}
        //                 height={45}
        //                 alt="avater"
        //                 className="shadow-sm rounded-3 w45"
        //                 style={{ border: "1px solid #ddd" }}
        //               />
        //               <Image
        //                 src={dataPost.user?.photo?.path}
        //                 width={30}
        //                 height={30}
        //                 alt="avater"
        //                 className="shadow-sm rounded-circle position-absolute border-1"
        //                 style={{
        //                   bottom: "-5px",
        //                   right: "-5px",
        //                   border: "1px solid #eee",
        //                 }}
        //               />
        //             </div>
        //           ) : (
        //             <Image
        //               src={dataPost.user?.photo?.path}
        //               width={45}
        //               height={45}
        //               alt="avater"
        //               className="shadow-sm rounded-circle w45"
        //             />
        //           )}
        //         </figure>

        //         <div>
        //           <Link href={`/profile/${dataPost.user?.nickName || ""}`}>
        //             <h4 className="fw-700 text-grey-900 font-xss m-0 mt-1">
        //               @{dataPost.user?.nickName ||
        //                 dataPost.user?.firstName + dataPost.user?.lastName}
        //             </h4>
        //           </Link>
        //           <span className="d-block font-xsss fw-500 mt-1 lh-3 text-grey-500">
        //             {dataPost.createdAt ? TimeSinceDate(dataPost.createdAt) : ""}
        //           </span>
        //         </div>

        //         {userId && (userId === dataPost.user?.userId || userId === groupOwnerId) && (
        //           <div
        //             className="ms-auto pointer position-relative"
        //             onClick={() => setOpenSettings((open) => !open)}
        //             ref={settingsRef}
        //           >
        //             <i className="bi bi-three-dots h1 me-2 position-absolute right-0"></i>
        //             {openSettings && (
        //               <div
        //                 className={`${styles["delete-post__btn"]} font-xsss border-0 py-2 px-3 py-1 rounded-3 cursor-pointer`}
        //                 // onClick={(e) => onDeletePost(e, idParam as string)}
        //               >
        //                 Delete
        //               </div>
        //             )}
        //           </div>
        //         )}
        //       </div>
        //       <div className="card-body p-0 ms-1 mt-2 me-lg-6">
        //         <Box
        //           sx={{
        //             width: "100%",
        //             maxHeight: 500,
        //             overflow: "hidden",
        //           }}
        //         >
        //           <p className="fw-500 lh-26 font-xss w-100 mb-2">
        //             {expandPost
        //               ? dataPost.content
        //               : dataPost.content.length > 150
        //                 ? dataPost.content.substring(0, 150) + "..."
        //                 : dataPost.content}
        //             {dataPost.content.length > 150 && !expandPost ? (
        //               <span
        //                 className={styles["expand-btn"]}
        //                 onClick={() => setExpandPost((open) => !open)}
        //               >
        //                 See more
        //               </span>
        //             ) : (
        //               ""
        //             )}
        //           </p>
        //           <Masonry columns={dataPost.assets?.length > 3 ? 3 : dataPost.assets?.length}>
        //             {dataPost.assets?.slice(0, 5).map(({ path, id }) =>
        //               path ? (
        //                 <div key={id}>
        //                   <img
        //                     srcSet={`${path}?w=162&auto=format&dpr=2 2x`}
        //                     src={`${path}?w=162&auto=format`}
        //                     alt={id}
        //                     loading="lazy"
        //                     style={{
        //                       borderBottomLeftRadius: 4,
        //                       borderBottomRightRadius: 4,
        //                       display: "block",
        //                       width: "100%",
        //                     }}
        //                   />
        //                 </div>
        //               ) : null
        //             )}
        //           </Masonry>
        //         </Box>
        //       </div>

        //       <div className="card-body d-flex p-0 mt-4">
        //         <div className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xsss me-3">
        //           {/* <i className="feather-thumbs-up text-white bg-primary-gradiant me-1 btn-round-xs font-xss"></i>{' '} */}
        //           <i
        //             className={`${isLiked ? "bi-heart-fill" : "bi-heart"} bi h2 m-0 me-2 d-flex align-items-center cursor-pointer`}
        //             onClick={(e) => onClickLikeHandler(e, idParam as string, likeNum)}
        //           ></i>
        //           <span className="like-number">
        //             {likeNum >= 1000
        //               ? Math.round(likeNum / 1000).toFixed(1)
        //               : likeNum}
        //           </span>
        //           <span className="like-thousand">
        //             {likeNum >= 1000 ? "k" : ""}
        //           </span>
        //         </div>
        //         <div
        //           className={`${styles["post-comment"]} d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xsss`}
        //         >
        //           <i className="bi bi-chat h2 m-0 me-2 d-flex align-items-center"></i>
        //           <span className="d-none-xss">
        //             <RoundedNumber
        //               num={commentNum}
        //               unitSingular={tBase("comment")}
        //               unitPlural={tBase("comments")}
        //             />
        //           </span>
        //         </div>
        //       </div>
        //       {/* All comments */}
        //       {commentNum?.length === 0 && (
        //         <div className="text-center pointer align-items-center text-dark lh-26 font-xss">
        //           <span className="d-none-xs font-xss fw-600 text-grey-700">
        //             {tComment("no_comment")}
        //           </span>
        //         </div>
        //       )}
        //       {isMobile && (
        //         <Comments
        //           comments={comments}
        //           page={page}
        //           totalPage={totalPage}
        //           take={take}
        //           postId={postId}
        //           setCommentNum={setCommentNumHandler}
        //           postAuthor={authorId}
        //           ref={childRef}
        //         />
        //       )}
        //     </div>
        //   </Modal.Body>
        // </Modal>
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
