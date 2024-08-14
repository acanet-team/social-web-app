import styles from "@/styles/modules/home.module.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FetchBrokers } from "@/app/components/newsfeed/FetchBrokers";
import React, { useEffect, useState } from "react";
import Contacts from "@/app/components/Contacts";
import CreatePost from "@/app/components/newsfeed/Createpost";
import RootLayout from "@/layout/root";
import type { InferGetServerSidePropsType, NextPageContext } from "next";
import Posts from "@/app/components/newsfeed/Posts";
import { getPosts } from "@/api/newsfeed";
import { TabEnum } from "@/types/enum";

const TAKE = 5;

const Home = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const posts = data?.data?.docs || [];
  const totalPage = data?.data?.meta.totalPage;
  const page = data?.data?.meta.page;
  const hasNextPage = data?.data?.meta.hasNextPage;
  const [curTab, setCurTab] = useState<string>("suggestion");
  // const [feedPosts, setFeedPosts] = useState<[]>(posts);

  // useEffect(() => {
  //   setFeedPosts(posts);
  // }, [curTab])

  const onSelectTabHandler = (e: any) => {
    const chosenTab = e.target.textContent;
    if (chosenTab === "For you") {
      setCurTab("for_you");
    } else {
      setCurTab("suggestion");
    }
  };
  return (
    <RootLayout>
      <div className="main-content right-chat-active" id={styles.home}>
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="row feed-body">
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <FetchBrokers />
                <div className={`${styles["home-tabs"]} bg-light`}>
                  <div
                    className={`${styles["button-tab"]} ${curTab === TabEnum.ForYou ? styles["tab-active"] : ""} d-flex justify-content-center shadow-md cursor-pointer`}
                    onClick={(e) => onSelectTabHandler(e)}
                  >
                    For you
                  </div>
                  <div
                    className={`${styles["button-tab"]} ${curTab === TabEnum.Suggestion ? styles["tab-active"] : ""} d-flex justify-content-center shadow-md cursor-pointer`}
                    onClick={(e) => onSelectTabHandler(e)}
                  >
                    Suggestion
                  </div>
                </div>
                <CreatePost />
                <Posts
                  posts={posts}
                  feedType={curTab}
                  take={TAKE}
                  allPage={totalPage}
                  curPage={page}
                />
              </div>
              <div className="col-xl-4 col-xxl-3 col-lg-4 ps-lg-0">
                <Contacts />
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default React.memo(Home);

export async function getServerSideProps(context: NextPageContext) {
  try {
    const response = await getPosts(1, TAKE, "suggestion");
    return {
      props: {
        messages: (await import(`@/locales/${context.locale}.json`)).default,
        data: response,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        messages: (await import(`@/locales/${context.locale}.json`)).default,
        data: {
          status: 500,
          message: "error",
          data: {
            docs: [],
            meta: {
              hasNextPage: false,
              hasPreviousPage: false,
              page: 1,
              take: TAKE,
              total: 1,
              totalPage: 1,
            },
          },
        },
      },
    };
  }
}
