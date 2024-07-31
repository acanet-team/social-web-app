"use client";

import React, { useEffect, useState } from "react";

import Appfooter from "@/app/components/Appfooter";
import CreatePost from "@/app/components/Createpost";
import Memberslider from "@/app/components/Memberslider";
import Friendsilder from "@/app/components/Friendsilder";
import Storyslider from "@/app/components/TopBrokers";
import Postview from "@/app/components/Postview";
import Load from "@/app/components/Load";
import styles from "@/styles/modules/home.module.scss";
import NavLink from "@/app/components/NavLink";
import Layout from "../layout";
import Link from "next/link";
import Contacts from "@/app/components/Contacts";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { getUserInfoRequest } from "@/api/user";
import { useAccessTokenStore } from "@/store/accessToken";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";

export default function Home() {
  const [posts, setPosts] = useState<Object[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [userInfo, setUserInfo] = useState<any>({});
  const { data: session } = useSession() as any;
  const setAccessToken = useAccessTokenStore((s: any) => s.setAccessToken);
  const router = useRouter();

  const onClickForYouHandler = () => {
    console.log("fetching for-you feed");
    // setPosts()
  };
  const onClickSuggestionHandler = () => {
    console.log("fetching suggestion feed");
    // setPosts()
  };
  const tCreatePost = useTranslations("CreatePost");
  useEffect(() => {
    if (session) {
      setAccessToken(session.token);
      if (!session.isProfile) {
        router.push("/home");
        setUserInfo(session.user);
      } else {
        router.push("/");
      }
    }
  }, [session, setAccessToken]);

  return (
    <Layout>
      <ToastContainer />
      <div className="main-content right-chat-active" id={styles.home}>
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="row feed-body">
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <div className={styles["home-tabs"]}>
                  <NavLink
                    className={`${styles["tab-active"]} d-flex justify-content-center`}
                    href="/home?tab=you"
                    onClick={onClickForYouHandler}>
                    For you
                  </NavLink>
                  <NavLink
                    className={`${styles["tab-active"]} d-flex justify-content-center`}
                    href="/home?tab=sugesstion"
                    onClick={onClickSuggestionHandler}>
                    Suggestion
                  </NavLink>
                </div>
                <Storyslider />
                <CreatePost
                  placeholder={tCreatePost("Whats_on_your_mind")}
                  avatarUrl={userInfo?.photo?.path}
                  liveVideo={tCreatePost("live_Video")}
                  photoVideo={tCreatePost("Photo_Video")}
                  createPost={tCreatePost("create_Post")}
                />
                <Postview
                  id="32"
                  postvideo=""
                  postimage="post.png"
                  avater="user.png"
                  user="Surfiya Zakir"
                  time="22 min ago"
                  des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus."
                />
                <Postview
                  id="31"
                  postvideo=""
                  postimage="post.png"
                  avater="user.png"
                  user="David Goria"
                  time="22 min ago"
                  des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus."
                />
                <Postview
                  id="33"
                  postvideo=""
                  postimage="post.png"
                  avater="user.png"
                  user="Anthony Daugloi"
                  time="2 hour ago"
                  des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus."
                />
                <Memberslider />
                <Postview
                  id="35"
                  postvideo=""
                  postimage="post.png"
                  avater="user.png"
                  user="Victor Exrixon"
                  time="3 hour ago"
                  des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus."
                />
                <Friendsilder />
                <Postview
                  id="36"
                  postvideo=""
                  postimage="post.png"
                  avater="user.png"
                  user="Victor Exrixon"
                  time="12 hour ago"
                  des="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus."
                />
                <Load />
              </div>
              <div className="col-xl-4 col-xxl-3 col-lg-4 ps-lg-0">
                <Contacts />
                {/* <Group /> */}
                {/* <Events />
                <Profilephoto /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Popupchat /> */}
      <Appfooter />
    </Layout>
  );
}
