import React from "react";
import NavLink from "@/app/components/NavLink";
import styles from "@/styles/modules/home.module.scss";

interface FeedTabsProps {
  onClickTab: (arg: any) => void;
}

export default function FeedTabs({ onClickTab }: FeedTabsProps) {
  return (
    <div className={styles["home-tabs"]}>
      <NavLink
        className={`${styles["tab-active"]} d-flex justify-content-center`}
        href="/home?tab=you"
        onClick={(e) => onClickTab(e)}
      >
        For you
      </NavLink>
      <NavLink
        className={`${styles["tab-active"]} d-flex justify-content-center`}
        href="/home?tab=sugesstion"
        onClick={(e) => onClickTab(e)}
      >
        Suggestion
      </NavLink>
    </div>
  );
}
