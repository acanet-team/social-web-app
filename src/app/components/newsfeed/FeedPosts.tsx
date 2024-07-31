import React from "react";
import Postview from "./Postview";

export default function FeedPosts() {
  return (
    <div>
      <Postview
        id="32"
        postvideo=""
        postimage="post.png"
        avatar="user.png"
        user="Surfiya Zakir"
        time="22 min ago"
        like={1}
        comment={0}
        des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus."
      />
      <Postview
        id="31"
        postvideo=""
        postimage="post.png"
        avatar="user.png"
        user="David Goria"
        time="22 min ago"
        like={43}
        comment={24}
        des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus."
      />
      <Postview
        id="33"
        postvideo=""
        postimage="post.png"
        avatar="user.png"
        user="Anthony Daugloi"
        time="2 hour ago"
        like={43}
        comment={24}
        des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus."
      />
      <Postview
        id="35"
        postvideo=""
        postimage="post.png"
        avatar="user.png"
        user="Victor Exrixon"
        time="3 hour ago"
        like={43}
        comment={24}
        des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus."
      />
      <Postview
        id="36"
        postvideo=""
        postimage="post.png"
        avatar="user.png"
        user="Victor Exrixon"
        time="12 hour ago"
        like={43}
        comment={24}
        des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus."
      />
    </div>
  );
}
