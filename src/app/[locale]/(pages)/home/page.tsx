import Appfooter from "@/app/components/Appfooter";
import NavLink from "@/app/components/NavLink";
import styles from "@/styles/modules/home.module.scss";
import Layout from "../layout";
import { FetchBrokers } from "@/app/components/newsfeed/FetchBrokers";
import { ForYou } from "@/app/components/newsfeed/ForYou";
import React from "react";
import Contacts from "@/app/components/Contacts";
import { Suggestion } from "@/app/components/newsfeed/Suggestion";
import CreatePost from "@/app/components/newsfeed/Createpost";

const Home = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  }) => {
  return (
    <Layout>
      <div className="main-content right-chat-active" id={styles.home}>
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="row feed-body">
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <div className={styles["home-tabs"]}>
                  <NavLink
                    className={`${styles["tab-active"]} d-flex justify-content-center`}
                    href="/home?tab=for_you">
                    For you
                  </NavLink>
                  <NavLink
                    className={`${styles["tab-active"]} d-flex justify-content-center`}
                    href="/home?tab=suggestion">
                    Suggestion
                  </NavLink>
                </div>
                <FetchBrokers />
                <CreatePost />
                {searchParams.tab === "suggestion" ? (
                  <Suggestion
                    tab={"suggestion"}
                    postIdParams={searchParams?.comments?.toString() || ""}
                  />
                ) : (
                  <ForYou
                    tab={"for_you"}
                    postIdParams={searchParams?.comments?.toString() || ""}
                  />
                )}
              </div>
              <div className="col-xl-4 col-xxl-3 col-lg-4 ps-lg-0">
                <Contacts />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Appfooter />
    </Layout>
  );
};

export default React.memo(Home);
