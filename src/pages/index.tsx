import Contacts from "@/app/components/Contacts";
import NavLink from "@/app/components/NavLink";
import CreatePost from "@/app/components/newsfeed/Createpost";
import { FetchBrokers } from "@/app/components/newsfeed/FetchBrokers";
import RootLayout from "@/layout/root";
import "@/styles/global.scss";
import styles from "@/styles/modules/home.module.scss";
import type { NextPageContext } from "next";
import React from "react";

const Home = () => {
  return (
    <RootLayout>
      <div className="main-content right-chat-active" id={styles.home}>
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="row feed-body">
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <div className={styles["home-tabs"]}>
                  <NavLink
                    className={`${styles["tab-active"]} d-flex justify-content-center`}
                    href="/home?tab=for_you"
                  >
                    For you
                  </NavLink>
                  <NavLink
                    className={`${styles["tab-active"]} d-flex justify-content-center`}
                    href="/home?tab=suggestion"
                  >
                    Suggestion
                  </NavLink>
                </div>
                <FetchBrokers />
                <CreatePost />
                {/* {searchParams.tab === "suggestion" ? (
                  <Suggestion
                    tab={"suggestion"}
                    postIdParams={searchParams?.comments?.toString() || ""}
                  />
                ) : (
                  <ForYou
                    tab={"for_you"}
                    postIdParams={searchParams?.comments?.toString() || ""}
                  />
                )} */}
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
  // Pass data to the page via props
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
    },
  };
}
