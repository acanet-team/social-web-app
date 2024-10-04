import QuickSearchCard from "@/components/search/QuickSearchCard";
import React from "react";
import styles from "@/styles/modules/search.module.scss";
import type { IQuickSearchResponse } from "@/api/search/model";

/* eslint-disable react/display-name */
export default function (props: {
  searchData: IQuickSearchResponse;
  switchTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { searchData, switchTab } = props;

  return (
    <div className="mt-5">
      <div className="mb-5">
        {searchData?.users?.length > 0 && (
          <div className="mb-3 fw-bold">People</div>
        )}
        {searchData?.users?.length > 0 &&
          searchData?.users?.map((user) => (
            <div key={user.userId}>
              <QuickSearchCard type="user" isFullSearch={false} data={user} />
            </div>
          ))}
        {searchData?.users?.length > 4 && (
          <button
            className={`${styles["search_see-all"]} w-100 mt-2 font-xsss`}
            onClick={() => switchTab("people")}
          >
            See all
          </button>
        )}
      </div>
      <div className="mb-5">
        {searchData?.communities?.length > 0 && (
          <div className="my-3 fw-bold">Communities</div>
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
        {searchData?.communities?.length > 4 && (
          <button
            className={`${styles["search_see-all"]} w-100 mt-2 font-xsss`}
            onClick={() => switchTab("community")}
          >
            See all
          </button>
        )}
      </div>
      {/* <div className="mb-5">
        <div className="mt-3 fw-bold">Posts</div>
        <button className={`${styles["search_see-all"]} w-100 mt-2 font-xsss`}>
          See all
        </button>
      </div> */}
    </div>
  );
}
