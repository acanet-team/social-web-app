import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "@/styles/modules/commentView.module.scss";
import { TimeSinceDate } from "@/utils/time-since-date";
import { useSession } from "next-auth/react";

export default async function CommentView(props: {
  id: string;
  photo: any;
  nickName: string;
  content: string;
  status: string;
  postAuthor: number;
  createdAt: string;
  createdBy: number;
  onClickDelete: (id: string) => void;
}) {
  const {
    id,
    photo,
    nickName,
    content,
    status,
    createdAt,
    createdBy,
    postAuthor,
    onClickDelete,
  } = props;
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const timePassed = TimeSinceDate(createdAt);
  const [userId, setUserId] = useState<number>();
  // const { data: session } = useSession() as any;
  // console.log(session);

  console.log("delete", userId, createdBy, postAuthor);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("userInfo") || "{}").user
      ?.id;
    setUserId(userId);
  }, []);

  const onClickSettings = () => {
    setOpenSettings((open) => !open);
  };

  return (
    <div className={`d-flex gap-2 align-items-center`}>
      <Image
        src={photo ? photo : "/assets/images/user.png"}
        width={35}
        height={35}
        className="rounded-circle"
        alt={""}
      />
      <div className="d-flex flex-column">
        <div
          className={`${status === "failed" ? styles["comment-failed"] : ""} ${styles["content-container"]} rounded-xxl d-flex flex-column`}
        >
          <div className="fw-bolder">{nickName}</div>
          <div style={{ wordBreak: "break-word" }}>{content}</div>
          {/* Error mark */}
          {status === "failed" && (
            <div className={styles["comment-error__mark"]}>
              <i className="bi bi-exclamation-lg text-danger"></i>
            </div>
          )}
        </div>
        {/* Post time/error massage */}
        {status === "failed" ? (
          <div className={`${styles["comment-msg"]} text-danger`}>
            Failed to send the message
          </div>
        ) : (
          <div className={styles["comment-msg"]}>{timePassed}</div>
        )}
      </div>

      {/* Delete button */}
      {userId && (userId === createdBy || userId === postAuthor) && (
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
      )}
    </div>
  );
}
