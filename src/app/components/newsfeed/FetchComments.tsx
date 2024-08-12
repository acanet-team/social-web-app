import { getComments } from "@/api/newsfeed";
import React, { useEffect, useState } from "react";
import { Comments } from "./Comments";

export default function FetchComments(props: { postId: string }): JSX.Element {
  const [comments, setComments] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [take, setTake] = useState<number>(5);

  // Function to fetch comments
  const fetchComments = async () => {
    try {
      const response: any = await getComments(page, take, props.postId);

      // Update the comments state with the fetched data
      setComments((prevState) =>
        response.data.docs
          ? [...prevState, ...response.data.docs]
          : [...prevState, ...response.data.data]
      );

      setTotalPage(response.data.meta.totalPage);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch comments initially and on page changes
  useEffect(() => {
    fetchComments();
    console.log("FetchComments useEffect");
    
  }, [props.postId]); // Dependency array is updated to include page

  return (
    <>
      <div>
        <Comments
          comments={comments}
          page={page}
          totalPage={totalPage}
          take={take}
          postId={props.postId}
        />
      </div>
    </>
  );
}
