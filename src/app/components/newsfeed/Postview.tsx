"use client";
import Image from "next/image";
import React, { useState } from "react";
import styles from "@/styles/modules/postView.module.scss";
import { likeRequest } from "@/api/newsfeed";
import Comments from "./Comments";

export default function Postview(props: {
  user: string;
  time: string;
  des: string;
  avatar: string;
  postimage: string;
  postvideo: string;
  id: string;
  like: number;
  comment: number;
}) {
  const {
    user,
    time,
    des,
    avatar,
    postimage,
    postvideo,
    id,
    like = 0,
    comment = 0,
  } = props;
  // const [isOpen, toggleOpen] = useState<boolean>(false);
  // const menuClass = `${isOpen ? " show" : ""}`;
  const [openComments, setOpenComments] = useState<boolean>(false);

  const onShowCommentHandler = () => {
    setOpenComments((prevState) => !prevState);
  };

  const onClickLikeHandler = (e: any, id: string) => {
    const likeBtn = e.target;
    let clickTime = 0;
    if (likeBtn) {
      // Update DOM
      likeBtn.classList.toggle("text-dark");
      likeBtn.classList.toggle("bg-transparent");
      likeBtn.classList.toggle("bg-red-gradiant");
      const isLiked = likeBtn.classList.contains("bg-red-gradiant");
      const likeNumber = likeBtn
        .closest(".card-body")
        .querySelector(".like-number");
      try {
        if (isLiked) {
          clickTime = +1;
          likeRequest({ postId: id, action: "favorite" });
        } else {
          clickTime = -1;
          likeRequest({ postId: id, action: "unfavorite" });
        }
        // Update the like number on DOM
        likeNumber.textContent = (
          Number(likeNumber.textContent) + clickTime
        ).toString();
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div
      className={`${styles.post} card w-100 shadow-xss rounded-xxl border-0 p-4 mb-3`}
    >
      <div className="card-body p-0 d-flex">
        <figure className="avatar me-3">
          <Image
            src={`/assets/images/${avatar}`}
            width={45}
            height={45}
            alt="avater"
            className="shadow-sm rounded-circle w45"
          />
        </figure>
        <h4 className="fw-700 text-grey-900 font-xssss mt-1">
          {user}
          <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
            {time}
          </span>
        </h4>
        <div className="ms-auto pointer">
          <i className="ti-more-alt text-grey-900 btn-round-md bg-greylight font-xss"></i>
        </div>
      </div>
      {postvideo ? (
        <div className="card-body p-0 mb-3 rounded-3 overflow-hidden uttam-die">
          <a href="/defaultvideo" className="video-btn">
            <video autoPlay loop className="float-right w-100">
              <source src={`assets/images/${postvideo}`} type="video/mp4" />
            </video>
          </a>
        </div>
      ) : (
        ""
      )}
      <div className="card-body p-0 me-lg-5">
        <p className="fw-500 text-grey-500 lh-26 font-xssss w-100 mb-2">
          {des}
          <a href="/defaultvideo" className="fw-600 text-primary ms-2">
            See more
          </a>
        </p>
      </div>
      {postimage ? (
        <div className="card-body d-block p-0 mb-3">
          <div className="row ps-2 pe-2">
            <div className="col-sm-12 p-1">
              <img
                src={`assets/images/${postimage}`}
                className="rounded-3 w-100"
                alt="post"
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="card-body d-flex p-0">
        <div className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2">
          {/* <i className="feather-thumbs-up text-white bg-primary-gradiant me-1 btn-round-xs font-xss"></i>{' '} */}
          <i
            className="feather-heart text-dark bg-transparent me-2 btn-round-xs font-md"
            onClick={(e) => onClickLikeHandler(e, id)}
          ></i>
          <span className="like-number">
            {props.like > 1000
              ? Math.ceil(props.like / 1000).toFixed(1)
              : props.like}
          </span>
          <span>
            {props.like >= 1000 ? "k" : ""}&nbsp;
            {props.like < 2 ? "Like" : "Likes"}
          </span>
        </div>
        <div
          className="d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss"
          onClick={onShowCommentHandler}
        >
          <i className="feather-message-circle text-dark text-grey-900 btn-round-sm font-lg"></i>
          <span className="d-none-xss">
            {props.comment > 1000
              ? Math.ceil(props.comment / 1000).toFixed(1)
              : props.comment}{" "}
            {props.comment >= 1000 ? "k" : ""}{" "}
            {props.comment < 2 ? "Comment" : "Comments"}
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
        <div
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
        </div>
      </div>
      {/* All comments */}
      {openComments && <Comments />}
    </div>
  );
}
