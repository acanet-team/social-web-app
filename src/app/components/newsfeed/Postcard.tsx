"use client";
import React, { useEffect, useState } from "react";
import styles from "@/styles/modules/postView.module.scss";
import { getComments, likeRequest } from "@/api/newsfeed";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { TimeSinceDate } from "@/utils/time-since-date";
import Image from "next/image";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import { Comments } from "./Comments";
import DotWaveLoader from "../DotWaveLoader";

export default function PostCard(props: {
  postId: number;
  user: string;
  userId: number;
  avatar: string;
  content: string;
  assets: Array<{ id: string; path: string }>;
  like: number;
  comment: number;
  createdAt: string;
  columnsCount: number;
}) {
  const {
    postId,
    user,
    avatar,
    content,
    assets,
    userId,
    like = 0,
    comment = 0,
    createdAt,
    columnsCount = 1,
  } = props;
  const [expandPost, setExpandPost] = useState<boolean>(false);
  const [openComments, setOpenComments] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [commentNum, setCommentNum] = useState<number>(comment || 0);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  // Comment states
  const [comments, setComments] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [take, setTake] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to fetch comments
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response: any = await getComments(page, take, postId);

      // Update the comments state with the fetched data
      // setComments((prevState) => [...prevState, ...response.data.docs]);
      setComments(response.data.docs);
      console.log("comment array", response.data.docs);
      setTotalPage(response.data.meta.totalPage);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch comments again every time user opens the comment section
    if (openComments) {
      fetchComments();
    }
  }, [postId, openComments]);

  const onShowCommentHandler = (id: string) => {
    setOpenComments((open) => !open);
    const updatedSearchParams = new URLSearchParams(searchParams ?? "");
    if (id) {
      updatedSearchParams.set("comments", id);
    } else {
      updatedSearchParams.delete("comments");
    }

    startTransition(() => {
      router.replace(`${pathname}?${updatedSearchParams.toString()}`, {
        scroll: false,
      });
    });
  };

  const onClickLikeHandler = (e: any, id: number, like: number) => {
    const likeBtn = e.target;
    let clickTime = 0;
    if (likeBtn) {
      // Update DOM
      likeBtn.classList.toggle("bi-heart");
      likeBtn.classList.toggle("bi-heart-fill");
      const isLiked = likeBtn.classList.contains("bi-heart-fill");
      const likeNumEl = likeBtn
        .closest(".card-body")
        .querySelector(".like-number");
      const likeThousandEl = likeBtn
        .closest(".card-body")
        .querySelector(".like-thousand");
      try {
        if (isLiked) {
          clickTime = +1;
          // Calling api
          likeRequest({ postId: id, action: "favorite" });
        } else {
          clickTime = 0;
          likeRequest({ postId: id, action: "unfavorite" });
        }
        // Update the like number on DOM
        const newLikeNum = like + clickTime;
        likeNumEl.textContent = (
          newLikeNum >= 1000
            ? Math.round(newLikeNum / 1000).toFixed(1)
            : newLikeNum
        ).toString();
        likeThousandEl.textContent = newLikeNum >= 1000 ? "k" : "";
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div
      className={`${styles.post} card w-100 shadow-xss rounded-xxl border-0 p-3 mb-3`}
    >
      <div className="card-body p-0 d-flex">
        <figure className="avatar me-3">
          <Image
            src={avatar}
            width={45}
            height={45}
            alt="avater"
            className="shadow-sm rounded-circle w45"
          />
        </figure>
        <h4 className="fw-700 text-grey-900 font-xsss mt-1">
          {user}
          <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
            {createdAt ? TimeSinceDate(createdAt) : ""}
          </span>
        </h4>
        <div
          className="ms-auto pointer"
          onClick={() => setOpenSettings((open) => !open)}
        >
          <i className="bi bi-three-dots h1"></i>
        </div>
      </div>
      <div className="card-body p-0 ms-1 me-lg-6">
        <Box
          sx={{
            width: "100%",
            maxHeight: 500,
            overflow: "hidden",
          }}
        >
          <p className="fw-500 lh-26 font-xsss w-100 mb-2">
            {expandPost
              ? content
              : content.length > 150
                ? content.substring(0, 150) + "..."
                : content}
            {content.length > 150 && !expandPost ? (
              <span
                className={styles["expand-btn"]}
                onClick={() => setExpandPost((open) => !open)}
              >
                See more
              </span>
            ) : (
              ""
            )}
          </p>
          <Masonry columns={columnsCount}>
            {assets.slice(0, 5).map(({ path, id }) =>
              path ? (
                <div key={id}>
                  <img
                    srcSet={`${path}?w=162&auto=format&dpr=2 2x`}
                    src={`${path}?w=162&auto=format`}
                    alt={id}
                    loading="lazy"
                    style={{
                      borderBottomLeftRadius: 4,
                      borderBottomRightRadius: 4,
                      display: "block",
                      width: "100%",
                    }}
                  />
                </div>
              ) : null,
            )}
          </Masonry>
        </Box>
      </div>

      <div className="card-body d-flex p-0 mt-2">
        <div className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-3">
          {/* <i className="feather-thumbs-up text-white bg-primary-gradiant me-1 btn-round-xs font-xss"></i>{' '} */}
          <i
            className="bi bi-heart h2 m-0 me-2 d-flex align-items-center cursor-pointer"
            onClick={(e) => onClickLikeHandler(e, postId, like)}
          ></i>
          <span className="like-number">
            {like >= 1000 ? Math.round(like / 1000).toFixed(1) : like}
          </span>
          <span className="like-thousand">{like >= 1000 ? "k" : ""}</span>
          &nbsp;
          {like < 2 ? "Like" : "Likes"}
        </div>
        <div
          className={`${styles["post-comment"]} d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss`}
          onClick={() => onShowCommentHandler(postId.toString())}
        >
          <i className="bi bi-chat h2 m-0 me-2 d-flex align-items-center"></i>
          <span className="d-none-xss">
            {/* {comment > 1000 ? Math.round(comment / 1000).toFixed(1) : comment}
            {comment >= 1000 ? "k" : ""} {comment < 2 ? "Comment" : "Comments"} */}
            {commentNum > 1000
              ? Math.round(commentNum / 1000).toFixed(1)
              : commentNum}
            {commentNum >= 1000 ? "k" : ""}{" "}
            {commentNum < 2 ? "Comment" : "Comments"}
          </span>
        </div>
        <div
          className="pointer ms-auto d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss"
          // id={`dropdownMenu${props.id}`}
          // data-bs-toggle="dropdown"
          // aria-expanded="false"
          // onClick={() => toggleOpen((prevState) => !prevState)}
        >
          <i className="feather-share-2 text-grey-900 text-dark btn-round-sm font-lg"></i>
          <span className="d-none-xs">Share</span>
        </div>

        {/* <div
          className="dropdown-menu dropdown-menu-end p-4 rounded-xxl border-0 shadow-lg right-0"
          aria-labelledby={`dropdownMenu${props.id}`}
        >
          <h4 className="fw-700 font-xss text-grey-900 d-flex align-items-center">
            Share{" "}
            <i className="feather-x ms-auto font-xssss btn-round-xs bg-greylight text-grey-900 me-2"></i>
          </h4>
          <div className="card-body p-0 d-flex">
            <ul className="d-flex align-items-center justify-content-between mt-2">
              <li className="me-1">
                <span className="btn-round-lg pointer bg-facebook">
                  <i className="font-xs ti-facebook text-white"></i>
                </span>
              </li>
              <li className="me-1">
                <span className="btn-round-lg pointer bg-twiiter">
                  <i className="font-xs ti-twitter-alt text-white"></i>
                </span>
              </li>
              <li className="me-1">
                <span className="btn-round-lg pointer bg-linkedin">
                  <i className="font-xs ti-linkedin text-white"></i>
                </span>
              </li>
              <li className="me-1">
                <span className="btn-round-lg pointer bg-instagram">
                  <i className="font-xs ti-instagram text-white"></i>
                </span>
              </li>
              <li>
                <span className="btn-round-lg pointer bg-pinterest">
                  <i className="font-xs ti-pinterest text-white"></i>
                </span>
              </li>
            </ul>
          </div>
          <div className="card-body p-0 d-flex">
            <ul className="d-flex align-items-center justify-content-between mt-2">
              <li className="me-1">
                <span className="btn-round-lg pointer bg-tumblr">
                  <i className="font-xs ti-tumblr text-white"></i>
                </span>
              </li>
              <li className="me-1">
                <span className="btn-round-lg pointer bg-youtube">
                  <i className="font-xs ti-youtube text-white"></i>
                </span>
              </li>
              <li className="me-1">
                <span className="btn-round-lg pointer bg-flicker">
                  <i className="font-xs ti-flickr text-white"></i>
                </span>
              </li>
              <li className="me-1">
                <span className="btn-round-lg pointer bg-black">
                  <i className="font-xs ti-vimeo-alt text-white"></i>
                </span>
              </li>
              <li>
                <span className="btn-round-lg pointer bg-whatsup">
                  <i className="font-xs feather-phone text-white"></i>
                </span>
              </li>
            </ul>
          </div>
          <h4 className="fw-700 font-xssss mt-4 text-grey-500 d-flex align-items-center mb-3">
            Copy Link
          </h4>
          <i className="feather-copy position-absolute right-35 mt-3 font-xs text-grey-500"></i>
          <input
            type="text"
            placeholder="https://socia.be/1rGxjoJKVF0"
            className="bg-grey text-grey-500 font-xssss border-0 lh-32 p-2 font-xssss fw-600 rounded-3 w-100 theme-dark-bg"
          />
        </div> */}
      </div>
      {/* All comments */}
      {isLoading && <DotWaveLoader />}
      {openComments && !isLoading && (
        <Comments
          comments={comments}
          page={page}
          totalPage={totalPage}
          take={take}
          postId={postId}
          setCommentNum={setCommentNum}
          postAuthor={userId}
        />
      )}
    </div>
  );
}
