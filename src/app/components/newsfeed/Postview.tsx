"use client";
import React, { useInsertionEffect, useState } from "react";
import styles from "@/styles/modules/postView.module.scss";
import { likeRequest } from "@/api/newsfeed";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { TimeSinceDate } from "@/utils/time-since-date";
import Masonry from "react-responsive-masonry";
import Image from "next/image";
import path from "path";

export default function PostCard(props: {
  id: number;
  user: string;
  userId: string;
  avatar: string;
  content: string;
  assets: Array<{ id: string; path: string }>;
  like: number;
  comment: number;
  children: React.ReactNode;
  createdAt: string;
}) {
  const {
    id,
    user,
    avatar,
    content,
    assets,
    like = 0,
    comment = 0,
    createdAt,
    children,
  } = props;
  const [expandPost, setExpandPost] = useState<boolean>(false);
  const [openComments, setOpenComments] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

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

  const onClickSetting = () => {};
  return (
    <div
      className={`${styles.post} card w-100 shadow-xss rounded-xxl border-0 p-4 mb-3`}
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
      {/* {postvideo ? (
        <div className="card-body p-0 mb-3 rounded-3 overflow-hidden uttam-die">
          <a href="/defaultvideo" className="video-btn">
            <video autoPlay loop className="float-right w-100">
              <source src={`assets/images/${postvideo}`} type="video/mp4" />
            </video>
          </a>
        </div>
      ) : (
        ""
      )} */}
      <div className="card-body p-0 ms-1 me-lg-6">
        <p className="fw-500 text-grey-500 lh-26 font-xsss w-100 mb-2">
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
        <Masonry
          columnsCount={assets.length > 1 ? undefined : 1}
          gutter="0px"
          style={{}}
        >
          {assets.slice(0, 5).map(({ path, id }) => (
            <img key={id} src={path} className={styles["post-image"]} />
          ))}
        </Masonry>
      </div>
      <div className="card-body d-flex p-0 mt-2">
        <div className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-3">
          {/* <i className="feather-thumbs-up text-white bg-primary-gradiant me-1 btn-round-xs font-xss"></i>{' '} */}
          <i
            className="bi bi-heart h2 m-0 me-2 d-flex align-items-center"
            onClick={(e) => onClickLikeHandler(e, id, like)}
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
          onClick={() => onShowCommentHandler(id.toString())}
        >
          <i className="bi bi-chat h2 m-0 me-2 d-flex align-items-center"></i>
          <span className="d-none-xss">
            {comment > 1000 ? Math.round(comment / 1000).toFixed(1) : comment}
            {comment >= 1000 ? "k" : ""} {comment < 2 ? "Comment" : "Comments"}
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
      {openComments && children}
    </div>
  );
}
