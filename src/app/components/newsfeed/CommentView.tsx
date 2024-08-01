import Image from "next/image";
import React from "react";
import styles from "@/styles/modules/commentView.module.scss";

export default function CommentView(props: {
  photo: any;
  nickName: string;
  content: string;
  status: string;
  createdAt: string;
}) {
  const { photo, nickName, content, status, createdAt } = props;
  console.log(createdAt);
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
        {props.status === "failed" && (
          <div className={styles["comment-error__msg"]}>
            <i className="bi bi-exclamation-lg text-danger"></i>
          </div>
        )}
        {/* Post time/error massage */}
        {props.status === "failed" ? <div></div> : ""}
      </div>
    </div>
  );
}
