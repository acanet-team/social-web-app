"use client";
import Image from "next/image";
import React, { useState } from "react";
import styles from "@/styles/modules/commentView.module.scss";

export default function CommentView(props: {
  id: string;
  photo: any;
  nickName: string;
  content: string;
  status: string;
  createdAt: string;
  onClickDelete: (id: string) => void;
}) {
  const { id, photo, nickName, content, status, createdAt, onClickDelete } =
    props;
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const postDate = new Date(createdAt);
  const timeSincePostDate = new Date().getTime() - postDate.getTime();

  // Calculate the time passed in different units
  const minutes = Math.floor(timeSincePostDate / (1000 * 60));
  const hours = Math.floor(timeSincePostDate / (1000 * 60 * 60));
  const days = Math.floor(timeSincePostDate / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(timeSincePostDate / (1000 * 60 * 60 * 24 * 7));

  // Determine the most appropriate unit to display
  let timePassed;
  if (weeks > 0) {
    timePassed = `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (days > 0) {
    timePassed = `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    timePassed = `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    timePassed = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  const onClickSettings = () => {
    setOpenSettings((open) => !open);
  };

  return (
    <div className="d-flex gap-2 align-items-center">
      <Image
        src={photo?.path ? photo?.path : "/assets/images/user.png"}
        width={35}
        height={35}
        className="rounded-circle"
        alt={photo.category}
      />

      <div
        className={`${status === "failed" ? styles["comment-failed"] : ""} ${styles["content-container"]} rounded-xxl d-flex flex-column`}
      >
        <div className="fw-bolder">{nickName}</div>
        <div>{content}</div>
        {/* Error mark */}
        {status === "failed" && (
          <div className={styles["comment-error__mark"]}>
            <i className="bi bi-exclamation-lg text-danger"></i>
          </div>
        )}
        {/* Post time/error massage */}
        {status === "failed" ? (
          <div className={styles["comment-msg"]}>
            Failed to send the message
          </div>
        ) : (
          <div className={styles["comment-msg"]}>{timePassed}</div>
        )}
      </div>

      {/* Delete button */}
      <button
        className={`${styles["comment-settings"]} bg-transparent border-0`}
        onClick={onClickSettings}
      >
        <i className="bi bi-three-dots-vertical"></i>
        {openSettings && (
          <button
            className={`${styles["delete-comment__btn"]} border-0 px-2 py-1 rounded-3`}
            onClick={() => onClickDelete(id)}
          >
            Delete
          </button>
        )}
      </button>
    </div>
  );
}
