"use client";
import Image from "next/image";
import React, { useState } from "react";
import styles from "@/styles/modules/commentView.module.scss";
import { TimeSinceDate } from "@/utils/time-since-date";

export default function CommentView(props: {
  isLast: boolean;
  id: string;
  photo: any;
  nickName: string;
  content: string;
  status: string;
  createdAt: string;
  onClickDelete: (id: string) => void;
}) {
  const {
    isLast,
    id,
    photo,
    nickName,
    content,
    status,
    createdAt,
    onClickDelete,
  } = props;
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const timePassed = TimeSinceDate(createdAt);

  const onClickSettings = () => {
    setOpenSettings((open) => !open);
  };

  return (
    <div className={`d-flex gap-2 align-items-center ${isLast ? "" : "mb-4"}`}>
      <Image
        src={photo?.path ? photo?.path : "/assets/images/user.png"}
        width={35}
        height={35}
        className="rounded-circle"
        alt={photo.category ?? ""}
      />

      <div
        className={`${status === "failed" ? styles["comment-failed"] : ""} ${styles["content-container"]} rounded-xxl d-flex flex-column`}>
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
        onClick={onClickSettings}>
        <i className="bi bi-three-dots-vertical"></i>
        {openSettings && (
          <button
            className={`${styles["delete-comment__btn"]} border-0 px-2 py-1 rounded-3`}
            onClick={() => onClickDelete(id)}>
            Delete
          </button>
        )}
      </button>
    </div>
  );
}
