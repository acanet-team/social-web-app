import React from "react";
import Image from "next/image";
import type { NextPageContext } from "next";
import type { ICommunity } from "@/api/community/model";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CommunityHeader(props: {
  community: ICommunity;
  setCurTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { community, setCurTab } = props;
  const coverImage = community.coverImage?.path;
  const avatar = community.avatar?.path;
  const t = useTranslations("CommunityTabs");

  const onSelectTabHandler = (e: any) => {
    const chosenTab = e.target.textContent;
    if (chosenTab === t("posts")) {
      setCurTab("posts");
    } else if (chosenTab === t("members")) {
      setCurTab("members");
    } else {
      setCurTab("requests");
    }
  };

  return (
    <div className="card w-100 border-0 p-0 bg-white shadow-xss rounded-xxl">
      <div className="card-body h250 p-0 overflow-hidden mb-3">
        <Image
          src={coverImage ? coverImage : "/assets/images/u-bg.jpg"}
          width={1200}
          height={250}
          alt="avater"
          priority={true}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="card-body p-0 position-relative">
        <figure
          className="avatar position-absolute w100 z-index-1"
          style={{ top: "-40%", left: "30px" }}
        >
          <Image
            src={avatar ? avatar : "/assets/images/user.png"}
            alt="avatar"
            width={100}
            height={100}
            priority={true}
            className="float-right p-1 bg-white rounded-xxl w-100"
            style={{ objectFit: "cover" }}
          />
        </figure>
        <h4 className="fw-700 font-sm" style={{ margin: "60px 0 0 30px" }}>
          {community.name}
          <div className="fw-500 font-xsss text-grey-600 mt-2 mb-3 d-block">
            <span className="me-2">
              {community.fee > 0 ? "Paid Community" : "Free Community"}
            </span>{" "}
            |{" "}
            <span className="ms-2">
              {community.membersCount.toLocaleString()}{" "}
              {community.membersCount > 1 ? "members" : "member"}
            </span>
          </div>
        </h4>

        <div className="d-flex align-items-center justify-content-center position-absolute-md right-15 top-0 me-2">
          <i className="bi bi-pencil ms-2 cursor-pointer"></i>
        </div>
      </div>

      {/* Tabs */}
      <div className="card-body d-block w-100 shadow-none mb-0 p-0 border-top-xs">
        <ul
          className="nav nav-tabs h55 d-flex product-info-tab border-bottom-0 ps-4"
          id="pills-tab"
          role="tablist"
        >
          <li className="active list-inline-item me-5">
            <Link
              className="fw-700 font-xsss text-grey-500 pt-3 pb-3 ls-1 d-inline-block active"
              href=""
              data-toggle="tab"
              onClick={onSelectTabHandler}
            >
              {t("posts")}
            </Link>
          </li>
          <li className="list-inline-item me-5">
            <Link
              className="fw-700 font-xsss text-grey-500 pt-3 pb-3 ls-1 d-inline-block"
              href=""
              data-toggle="tab"
              onClick={onSelectTabHandler}
            >
              {t("members")}
            </Link>
          </li>
          <li className="list-inline-item me-5">
            <Link
              className="fw-700 font-xsss text-grey-500 pt-3 pb-3 ls-1 d-inline-block"
              href=""
              data-toggle="tab"
              onClick={onSelectTabHandler}
            >
              {t("requests")}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {},
  };
}
