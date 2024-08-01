"use client";
import React, { useRef, useState } from "react";
import styles from "@/styles/modules/comments.module.scss";
import CommentView from "./CommentView";
import useAuthStore from "@/store/auth";
import Image from "next/image";
import { postComment } from "@/api/newsfeed";
import WaveLoader from "../WaveLoader";
import { ReactDOM } from "@spotlightjs/spotlight";
import { comment } from "postcss";

export default function Comments(props: {
  comments: any[];
  page: number;
  totalPage: number;
  take: number;
  postId: string;
}) {
  const [comments, setComments] = useState<any[]>(props.comments);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const commentListRef = useRef<HTMLDivElement>(null);
  const session = useAuthStore((state) => state.session);
  const avatar = session.user.photo || "/assets/images/user.png";
  const nickName = session.user.nickName || "Me";
  console.log(comments);

  const onEnterPress = (e: any) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      onPostCommentHandler();
    }
  };
  const onPostCommentHandler = async () => {
    const content = commentRef?.current?.value;
    const randomKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    let newComment = {
      id: randomKey,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      content: content,
      childrenCount: 0,
      createBy: {
        id: 0,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        photo: {
          path: avatar,
        },
        role: {
          id: 0,
          name: "investor",
        },
        refCode: "string",
        nickName: nickName,
      },
      post: {},
      parent: "string",
      children: ["string"],
    };
    console.log(content);
    if (content) {
      try {
        const values = { content: content, postId: props.postId };
        setIsLoading(true);
        await postComment(values);
        setComments((prevState) => [newComment, ...prevState]);
      } catch (err) {
        setComments((prevState) => [
          { ...newComment, status: "failed" },
          ...prevState,
        ]);
        console.log(err);
      } finally {
        setIsLoading(false);
        if (commentRef.current) {
          commentRef.current.value = "";
        }
      }
    }
  };

  return (
    <div className={`${styles["comment-container"]} pt-4 mt-4 font-xsss`}>
      <div
        className="text-white d-flex flex-column gap-2 overflow-auto"
        ref={commentListRef}
      >
        {comments?.length === 0 && (
          <div className="text-center">No comment found.</div>
        )}
        {comments?.length > 0 &&
          comments.map((comment) => (
            <CommentView
              key={comment.id}
              photo={comment.createBy}
              nickName={comment.createBy.nickName}
              content={comment.content}
              status={comment.status}
              createdAt={comment.createdAt}
            />
          ))}
      </div>
      {isLoading && <WaveLoader />}
      <div className="d-flex gap-2 align-items-center w-100">
        <Image
          src={avatar}
          width={35}
          height={35}
          className="rounded-circle"
          alt={nickName ?? ""}
        />
        <div
          className={`${styles["comment-input"]} d-flex align-items-center w-100 mt-3 rounded-xxl bg-light`}
        >
          <textarea
            id="comment"
            className="p-3 rounded-xxl border-none bg-light"
            placeholder="Write a comment"
            name="comment"
            rows={2}
            ref={commentRef}
          />
          <button
            onClick={onPostCommentHandler}
            onKeyDown={(e) => onEnterPress(e)}
            className="border-0 bg-transparent"
            disabled={isLoading}
          >
            <i className="bi bi-send text-dark h2 m-0 pe-3"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
