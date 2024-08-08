"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "@/styles/modules/comments.module.scss";
import CommentView from "./CommentView";
import useAuthStore from "@/store/auth";
import Image from "next/image";
import WaveLoader from "../WaveLoader";
import { postComment, getComments, deleteComment } from "@/api/newsfeed";
import CustomModal from "../Modal";

/* eslint-disable react/display-name */
export const Comments = React.memo(
  (props: {
    comments: any[];
    page: number;
    totalPage: number;
    take: number;
    postId: string;
  }) => {
    const [comments, setComments] = useState<any[]>(props.comments);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalPage, setTotalPage] = useState<number>(props.totalPage);
    const [page, setPage] = useState<number>(1);
    const [commentId, setCommentId] = useState<string>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const commentRef = useRef<HTMLTextAreaElement>(null);
    const commentListRef = useRef<HTMLDivElement>(null);
    const session = useAuthStore((state) => state.session);
    const avatar = session?.user?.photo || "/assets/images/user.png";
    const nickName = session.user.nickName || "Me";
    const [userInfo, setUserInfo] = useState<any>(session.user);
  
    // Fetch comments ---------------------
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const response: any = await getComments(page, props.take, props.postId);
        // console.log(response);
        setComments((prevState) =>
          response.data.docs
            ? [...prevState, ...response.data.docs]
            : [...prevState, ...response.data.data]
        );
        setTotalPage(response.data.meta.totalPage);
        return response.data;
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    const onScrollHandler = () => {
      if (commentListRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          commentListRef.current;
        if (scrollTop + clientHeight === scrollHeight && !isLoading) {
          setPage((prevState) => prevState + 1);
          fetchComments();
        }
      }
    };

    useEffect(() => {
      setUserInfo(JSON.parse(localStorage.getItem("userInfo")!));
      const currentList = commentListRef.current;
      if (currentList && page < totalPage) {
        currentList.addEventListener("scroll", onScrollHandler);
      }
      return () => {
        if (currentList) {
          currentList.removeEventListener("scroll", onScrollHandler);
        }
      };
    }, [page, totalPage]);

    // Post a comment ---------------------
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

      if (content) {
        try {
          const values = { content: content, postId: props.postId };
          setIsLoading(true);
          // Call api to post the comment
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

    // Delete a comment --------------------
    const handleCancel = useCallback(() => {
      setShowModal(false);
    }, []);

    const onChooseDelete = useCallback((id: string) => {
      setShowModal(true);
      setCommentId(id);
    }, []);

    const onProceedDelete = useCallback(async () => {
      setShowModal(false);
      // Call server to delete comment
      try {
        if (commentId) {
          await deleteComment(commentId);
          // Remove comment from DOM
          setComments((prevState) =>
            prevState.filter((comment) => comment.id !== commentId)
          );
        }
      } catch (err) {
        console.log(err);
      }
      // Delete comment from DOM
    }, [commentId]);

    return (
      <div className={`${styles["comment-container"]} pt-4 mt-4 font-xsss`}>
        <div
          className={`${styles["comment-content__container"]} text-white flex-column overflow-auto ${comments.length > 0 ? styles["min-vh-10"] : ""}`}
          ref={commentListRef}>
          {comments?.length === 0 && (
            <div className="text-center pointer align-items-center fw-600 text-grey-900 text-dark lh-26 font-xss">
              <span className="d-none-xs">No comment found.</span>
            </div>
          )}
          {comments?.length > 0 &&
            comments.map((comment, index) => (
              <CommentView
                key={comment.id}
                id={comment.id}
                photo={comment.createBy}
                nickName={comment.createBy.nickName}
                content={comment.content}
                status={comment.status}
                createdAt={comment.createdAt}
                isLast={index === comments.length - 1}
                onClickDelete={onChooseDelete}
              />
            ))}
        </div>
        {isLoading && <WaveLoader />}
        <div className="d-flex gap-2 align-items-center w-100 mt-3">
          <Image
            // src={avatar}
            src={"/assets/images/user.png"}
            width={35}
            height={35}
            className="rounded-circle"
            alt={nickName ?? ""}
          />
          <div
            className={`${styles["comment-input"]} d-flex align-items-center w-100 rounded-xxl bg-light`}>
            <textarea
              id="comment"
              className="py-2 ps-2 rounded-xxl border-none bg-light"
              placeholder="Write a comment"
              name="comment"
              rows={1}
              ref={commentRef}
              onKeyDown={(e) => onEnterPress(e)}
            />
            <button
              type="submit"
              onClick={onPostCommentHandler}
              className="border-0 bg-transparent"
              disabled={isLoading}>
              <i className="bi bi-send text-dark h2 me-2"></i>
            </button>
          </div>
        </div>

        {/* Delete modal */}
        {showModal && (
          <CustomModal
            message="Are you sure you want to proceed?"
            onCancel={handleCancel}
            onOk={onProceedDelete}
          />
        )}
      </div>
    );
  }
);
