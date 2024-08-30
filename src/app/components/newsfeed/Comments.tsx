"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "@/styles/modules/comments.module.scss";
import CommentView from "./CommentView";
import useAuthStore from "@/store/auth";
import Image from "next/image";
import WaveLoader from "../WaveLoader";
import { postComment, getComments, deleteComment } from "@/api/newsfeed";
import AlertModal from "../AlertModal";
import { combineUniqueById } from "@/utils/combine-arrs";
import { useSession } from "next-auth/react";

/* eslint-disable react/display-name */
export const Comments = (props: {
  comments: any[];
  page: number;
  totalPage: number;
  take: number;
  postId: string;
  postAuthor: number;
  setCommentNum: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [comments, setComments] = useState<any[]>(props.comments);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalPage, setTotalPage] = useState<number>(props.totalPage);
  const [page, setPage] = useState<number>(props.page);
  const [commentId, setCommentId] = useState<string>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>({});
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const commentListRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession() as any;

  useEffect(() => {
    if (session) {
      setUserInfo(session);
      // console.log("info", session);
    }
  }, [session]);

  // Fetch comments ---------------------
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response: any = await getComments(page, props.take, props.postId);
      setComments((prevState) => {
        const newCommentArr = combineUniqueById(prevState, response.data.docs);
        return newCommentArr;
      });
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
      const { scrollTop, scrollHeight, clientHeight } = commentListRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setPage((prevState) => prevState + 1);
      }
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchComments();
    }
  }, [page]);

  useEffect(() => {
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
    if (e.key === "Enter" && e.shiftKey == false) {
      e.preventDefault();
      onPostCommentHandler();
    }
  };

  const onPostCommentHandler = async () => {
    const content = commentRef?.current?.value;
    // const randomKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    let newComment = {
      id: null,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      content: content,
      childrenCount: 0,
      createBy: {
        id: userInfo?.user?.id,
        firstName: session?.user?.firstName,
        lastName: session?.user?.lastName,
        photo: {
          path: userInfo?.user?.photo?.path || "/assets/images/user.png",
        },
        role: {
          id: 0,
          name: "investor",
        },
        refCode: "string",
        nickName: userInfo?.user?.userProfile?.nickName,
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
        const res: any = await postComment(values);
        newComment.id = res.data.id;
        console.log("res id", res.data.id);
        console.log("id", newComment.id);
        setComments((prevState) => [newComment, ...prevState]);
        props.setCommentNum((prevState: number) => prevState + 1);
        // Scroll to top of the comment section
        if (commentListRef.current) {
          commentListRef.current.scrollTop = 0;
        }
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
    try {
      if (commentId) {
        // Calling api
        console.log(commentId);
        await deleteComment(commentId);
        props.setCommentNum((prevState) => prevState - 1);
        // Remove comment from DOM
        setComments((prevState) =>
          prevState.filter((comment) => comment.id !== commentId),
        );
      }
    } catch (err) {
      console.log(err);
    }
    // Delete comment from DOM
  }, [commentId]);

  return (
    <div className={`${styles["comment-container"]} pt-4 mt-3 font-xsss`}>
      <div
        className={`${styles["comment-content__container"]} text-white overflow-auto pb-3`}
        ref={commentListRef}
      >
        {comments?.length === 0 && (
          <div className="text-center pointer align-items-center text-dark lh-26 font-xss">
            <span className="d-none-xs font-xsss fw-600 text-grey-700">
              No comment found.
            </span>
          </div>
        )}
        {comments?.length > 0 &&
          comments.map((comment, index) => (
            <CommentView
              key={comment.id}
              commentId={comment.id}
              photo={comment.createBy.photo?.path}
              nickName={comment.createBy.nickName}
              content={comment.content}
              status={comment.status}
              createdAt={comment.createdAt}
              createdBy={comment.createBy?.id}
              postAuthor={props.postAuthor}
              onClickDelete={() => onChooseDelete(comment.id)}
              userSession={session}
            />
          ))}
      </div>
      {isLoading && <WaveLoader />}
      <div className="d-flex gap-2 align-items-center w-100 mt-3">
        <Image
          src={userInfo?.user?.photo?.path || "/assets/images/user.png"}
          width={35}
          height={35}
          className="rounded-circle"
          alt={""}
        />
        <div
          className={`${styles["comment-input"]} d-flex align-items-center w-100 rounded-3 bg-light`}
        >
          <textarea
            id="comment"
            className="py-2 ps-2 rounded-3 border-none bg-light"
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
            disabled={isLoading}
          >
            <i className="bi bi-send text-dark h2 me-2"></i>
          </button>
        </div>
      </div>

      {/* Delete modal */}
      {showModal && (
        <AlertModal
          message="Are you sure you want to proceed?"
          onCancel={handleCancel}
          onOk={onProceedDelete}
        />
      )}
    </div>
  );
};
