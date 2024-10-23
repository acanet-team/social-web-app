import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SearchPageTabs } from "@/types";
import type { InferGetServerSidePropsType, NextPageContext } from "next";
import styles from "@/styles/modules/search.module.scss";
import SearchAll from "../SearchAll";
import type { IQuickSearchResponse } from "@/api/search/model";
import { quickSearch } from "@/api/search";
import SearchFullByType from "../SearchFullByType";
import { useRouter } from "next/router";
// import { useSearchParams } from "next/navigation";

export default function Search({
  keyword,
  searchResults,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const tSearch = useTranslations("Search");
  const [curTab, setCurTab] = useState<string>("all");
  const router = useRouter();
  const currentTab = router.query?.tab || "all";

  const onSelectTabHandler = (e: any) => {
    const chosenTab = e.target.textContent;
    let newTab = "all";
    if (chosenTab === tSearch("community_tab")) {
      newTab = "community";
    } else if (chosenTab === tSearch("people_tab")) {
      newTab = "people";
    } else if (chosenTab === tSearch("posts_tab")) {
      newTab = "posts";
    } else {
      newTab = "all";
    }
    router.push(
      {
        pathname: `/search/${router.query.keyword}`,
        query: { tab: newTab },
      },
      undefined,
      { shallow: true },
    );
    setCurTab(newTab);
  };

  // Map which tab to show based on search params
  useEffect(() => {
    console.log("tab", currentTab);
    if (currentTab === "community") {
      setCurTab("community");
    } else if (currentTab === "people") {
      setCurTab("people");
    } else if (currentTab === "posts") {
      setCurTab("posts");
    } else {
      setCurTab("all");
    }
  }, [currentTab]);

  return (
    <div>
      <div className="middle-sidebar-left">
        <div className="row feed-body">
          <div
            className={`col-xl-8 col-xxl-9 col-lg-8`}
            style={{ marginBottom: "100px" }}
          >
            <div className="fw-bold">
              {tSearch("search_result_title")} &quot;{keyword}&quot;
            </div>
            {/* Tabs */}
            <div className={styles["search-tabs"]}>
              <div
                className={`${styles["button-tab"]} ${styles["text-dark-mode"]} ${curTab === SearchPageTabs.all ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
                onClick={(e) => onSelectTabHandler(e)}
              >
                {tSearch("all_tab")}
              </div>
              <div
                className={`${styles["button-tab"]} ${styles["text-dark-mode"]} ${curTab === SearchPageTabs.people ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
                onClick={(e) => onSelectTabHandler(e)}
              >
                {tSearch("people_tab")}
              </div>
              <div
                className={`${styles["button-tab"]} ${styles["text-dark-mode"]} ${curTab === SearchPageTabs.community ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
                onClick={(e) => onSelectTabHandler(e)}
              >
                {tSearch("community_tab")}
              </div>
              {/* <div
                className={`${styles["button-tab"]} ${styles["text-dark-mode"]} ${curTab === SearchPageTabs.posts ? styles["tab-active"] : ""} d-flex justify-content-center cursor-pointer`}
                onClick={(e) => onSelectTabHandler(e)}
              >
                {tSearch("posts_tab")}
              </div> */}
            </div>

            {/* Search results */}
            {curTab === "all" && (
              <SearchAll
                switchTab={setCurTab}
                searchData={searchResults}
                keyword={keyword}
              />
            )}
            {curTab !== "all" && (
              <SearchFullByType tab={curTab} keyword={keyword} />
            )}
          </div>

          <div className={"col-xl-4 col-xxl-3 col-lg-4 ps-lg-0"}></div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const { query } = context;
  const { keyword } = query;
  if (!keyword) {
    return;
  }
  // Call quickSearch api & send keyword to fetch search results
  const res = await quickSearch(keyword.toString(), 3);

  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
      keyword: keyword as string,
      searchResults: (res?.data as IQuickSearchResponse) || [],
    },
  };
}
