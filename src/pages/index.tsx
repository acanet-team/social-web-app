import { getPosts, getTopBrokers } from "@/api/newsfeed";
import Contacts from "@/components/Contacts";
import CreatePost from "@/components/newsfeed/Createpost";
import FetchBrokers from "@/components/newsfeed/FetchBrokers";
import Posts from "@/components/newsfeed/Posts";
import styles from "@/styles/modules/home.module.scss";
import { TabEnum } from "@/types/enum";
import "bootstrap-icons/font/bootstrap-icons.css";
import type { InferGetServerSidePropsType, NextPageContext } from "next";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { IPost } from "@/api/newsfeed/model";
import { useMediaQuery } from "react-responsive";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CreateSignal from "@/components/newsfeed/CreateSignal";
import GetSignalNewFeed from "@/components/newsfeed/GetSignalNewFeed";
import Friends from "@/components/Friends";
import Link from "next/link";

const TAKE = 10;

const Home = ({
  posts,
  totalPage,
  page,
  topBrokers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [feedPosts, setPosts] = useState<IPost[]>(posts);
  const [curTab, setCurTab] = useState<string>("suggestion");
  const { data: session } = useSession() as any;
  const [isBroker, setIsBroker] = useState<boolean>(false);
  const t = useTranslations("FeedTabs");
  const isTablet = useMediaQuery({ query: "(max-width:1220px)" });
  const tPost = useTranslations("CreatePost");
  const [postType, setPostType] = useState<"post" | "signal">("post");

  const postTypeChangeHandler = (event: SelectChangeEvent) => {
    setPostType(event.target.value as "post" | "signal");
  };

  useEffect(() => {
    if (session) {
      setIsBroker(session.user?.role?.name === "broker" ? true : false);
    }
  }, [session]);

  const onSelectTabHandler = (e: any) => {
    const chosenTab = e.target.textContent;
    if (chosenTab === t("for_you")) {
      setCurTab("for_you");
    } else {
      setCurTab("suggestion");
    }
  };

  return (
    // <RootLayout>
    <div className="" id={styles.home}>
      <div className="middle-sidebar-left">
        <div className="row feed-body">
          <div
            className={`col-xl-8 col-xxl-9 col-lg-8}`}
            style={{ marginBottom: "100px" }}
          >
            <FetchBrokers brokers={topBrokers} />

            {/* Tabs */}
            <div className={styles["home-tabs"]}>
              <div
                className={`${styles["button-tab"]} ${curTab === TabEnum.ForYou ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
                onClick={(e) => onSelectTabHandler(e)}
              >
                {t("for_you")}
              </div>
              <div
                className={`${styles["button-tab"]} ${curTab === TabEnum.Suggestion ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
                onClick={(e) => onSelectTabHandler(e)}
              >
                {t("suggestion")}
              </div>
            </div>

            {/* Signal/Post creation */}
            {curTab === "for_you" && (
              <>
                <div
                  className="card w-100 shadow-xss border-0 mb-3 font-system"
                  style={{ padding: "1.5rem" }}
                >
                  {isBroker && (
                    <Box>
                      <FormControl>
                        <Select
                          labelId="create"
                          id="create"
                          value={postType}
                          onChange={postTypeChangeHandler}
                          sx={{
                            height: "40px",
                            fontSize: "15px",
                            color: "#0707079a",
                            borderRadius: "10px",
                            "& fieldset": {
                              minWidth: "100px",
                              border: "2px solid #eee",
                            },
                          }}
                        >
                          <MenuItem value="post">
                            {tPost("create_Post")}
                          </MenuItem>
                          <MenuItem value="signal">
                            {tPost("create_signal")}
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  )}

                  {postType === "post" ? (
                    <CreatePost
                      userSession={session}
                      groupId=""
                      // updatePostArr={null}
                      updatePostArr={setPosts}
                      tab={curTab}
                    />
                  ) : (
                    <CreateSignal />
                  )}
                </div>
                <div
                  className=" w-100 border-0 mb-3 font-system"
                  style={{ padding: "1.5rem" }}
                >
                  <GetSignalNewFeed />
                </div>
              </>
            )}

            <Posts
              // posts={posts}
              posts={feedPosts}
              setPosts={setPosts}
              feedType={curTab}
              take={TAKE}
              allPage={totalPage}
              curPage={page}
            />
          </div>

          <div className={"col-xl-4 col-xxl-3 col-lg-4 ps-lg-0"}>
            {!isBroker && !isTablet && <Friends />}
          </div>
        </div>
      </div>
    </div>
    // </RootLayout>
  );
};

export default React.memo(Home);

export async function getServerSideProps(context: NextPageContext) {
  const postRes = await getPosts(1, TAKE, "suggestion");
  const brokerRes = await getTopBrokers(1, 20);
  console.log("Brokers: ", brokerRes?.data.docs);
  // const response = await getNotifications(1, 5);
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
      posts: postRes?.data?.docs || [],
      totalPage: postRes?.data?.meta?.totalPage,
      page: postRes?.data?.meta.page,
      topBrokers: brokerRes?.data.docs || [],
    },
  };
}
