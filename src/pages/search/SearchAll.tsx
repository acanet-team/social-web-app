import QuickSearchCard from "@/components/search/QuickSearchCard";
import React from "react";
import styles from "@/styles/modules/search.module.scss";
import type { IQuickSearchResponse } from "@/api/search/model";
import { useTranslations } from "next-intl";

/* eslint-disable react/display-name */
export default function (props: {
  searchData: IQuickSearchResponse;
  switchTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { searchData, switchTab } = props;
  const tSearch = useTranslations("Search");

  return (
    <div className="mt-5">
      {searchData?.users?.length === 0 &&
        searchData?.communities?.length === 0 && (
          <div className={`${styles["text-dark-mode"]} mt-5 text-center`}>
            {tSearch("search_no_result")}
          </div>
        )}
      <div className="mb-5">
        {searchData?.users?.length > 0 && (
          <div className={`${styles["text-dark-mode"]} mb-3 fw-bold`}>
            {tSearch("people_tab")}
          </div>
        )}
        {searchData?.users?.length > 0 &&
          searchData?.users?.map((user) => (
            <div key={user.userId}>
              <QuickSearchCard type="user" isFullSearch={false} data={user} />
            </div>
          ))}
        {searchData?.users?.length !== 0 && (
          <button
            className={`${styles["search_see-all"]} ${styles["text-dark-mode"]} w-100 mt-2 font-xsss`}
            onClick={() => switchTab("people")}
          >
            {tSearch("see_all")}
          </button>
        )}
      </div>
      <div className="mb-5">
        {searchData?.communities?.length > 0 && (
          <div className={`${styles["text-dark-mode"]} my-3 fw-bold`}>
            {tSearch("communities")}
          </div>
        )}
        {searchData?.communities?.length > 0 &&
          searchData?.communities?.map((community) => (
            <div key={community.id}>
              <QuickSearchCard
                type="community"
                isFullSearch={true}
                data={community}
              />
            </div>
          ))}
        {searchData?.communities?.length !== 0 && (
          <button
            className={`${styles["search_see-all"]} ${styles["text-dark-mode"]} w-100 mt-2 font-xsss`}
            onClick={() => switchTab("community")}
          >
            {tSearch("see_all")}
          </button>
        )}
      </div>
      {/* <div className="mb-5">
        <div className="mt-3 fw-bold">{tSearch('posts_tab')}</div>
        <button className={`${styles["search_see-all"]} w-100 mt-2 font-xsss`}>
           {tSearch('see_all')}
        </button>
      </div> */}
    </div>
  );
}
