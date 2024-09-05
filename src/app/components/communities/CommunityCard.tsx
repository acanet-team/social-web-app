import React, { useState } from "react";
import Image from "next/image";
import { CommunityJoiningStatus } from "@/types/enum";
import Link from "next/link";
import { joinCommunity } from "@/api/community";
import { useTranslations } from "next-intl";
import styles from "@/styles/modules/communities.module.scss";

export default function CommunityCard(props: {
  groupId: string;
  name: string;
  coverImg: string;
  avatar: string;
  firstName: string;
  lastName: string;
  nickName: string;
  membersCount: number;
  communityStatus: string;
  communityType: string;
  description: string;
  fee: number;
  isBroker: boolean;
  onEditGroupHandler: (arg: string) => void;
}) {
  const {
    groupId,
    name,
    coverImg,
    avatar,
    firstName,
    lastName,
    nickName,
    membersCount,
    communityStatus,
    communityType,
    description,
    fee,
    isBroker,
    onEditGroupHandler,
  } = props;
  const t = useTranslations("Community");
  const tBase = useTranslations("Base");
  const [joiningStatus, setJoiningStatus] = useState(communityStatus);
  const onJoinCommunityHandler = async (e: any, groupId: string) => {
    try {
      // Calling api
      const res = await joinCommunity({ communityId: groupId });
      console.log("to join", res);
      setJoiningStatus("pending_request");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="card d-block border-0 shadow-md h-100 rounded-3 overflow-hidden">
      <div
        className="card-body position-relative h100 bg-image-cover bg-image-center"
        style={{
          backgroundImage: `url(${
            coverImg ? coverImg : `/assets/images/e-1.jpg`
          })`,
        }}
      ></div>
      <div className="card-body d-block w-100 pl-10 pe-4 py-0 text-left position-relative">
        <figure
          className="avatar position-absolute w75 z-index-1 left-15"
          style={{ marginTop: `-40px` }}
        >
          <Image
            src={avatar ? avatar : `/assets/images/user.png`}
            alt="avatar"
            width={75}
            height={75}
            className="float-right p-1 bg-white rounded-circle"
            style={{ objectFit: "cover" }}
          />
        </figure>
        <div className="clearfix"></div>
        <div className="mt-2 d-flex justify-content-between align-items-center">
          <div className="me-3 e-sm-2 d-flex flex-column align-items-between">
            <h4 className="fw-700 font-xss mt-2 mb-1">
              {firstName + " " + lastName}
            </h4>
            <div className="fw-500 font-xsss text-grey-500 mt-0 mb-1 lh-3">
              @{nickName}
            </div>
            <div className="fw-500 font-xsss fst-italic text-dark mt-0 lh-3">
              {membersCount?.toLocaleString("en-US") || 1}{" "}
              {membersCount > 1 ? `${tBase("members")}` : tBase("member")}
            </div>
          </div>
          <div className="d-flex align-items-center d-flex flex-column">
            <button
              disabled={
                joiningStatus === CommunityJoiningStatus.joined ||
                joiningStatus === CommunityJoiningStatus.pending
                  ? true
                  : false
              }
              className={`${joiningStatus === CommunityJoiningStatus.joined ? "btn-secondary" : joiningStatus === CommunityJoiningStatus.pending ? "btn-dark" : "btn-primary"} group-status btn text-white px-3 rounded-3 py-1 mb-2`}
              onClick={(e) => onJoinCommunityHandler(e, groupId)}
            >
              {joiningStatus === CommunityJoiningStatus.joined
                ? t("joined")
                : joiningStatus === CommunityJoiningStatus.pending
                  ? t("pending")
                  : t("join")}
            </button>
            {/* eslint-disable react/no-unescaped-entities */}
            {fee === 0 ? (
              <div className="text-success fw-bolder">{tBase("free")}</div>
            ) : (
              <div className="d-flex align-items-center">
                <Image
                  width={25}
                  height={25}
                  src={"/assets/images/logo/logo-only-transparent.png"}
                  alt="logo"
                />
                <span className="ms-2 fw-bolder text-dark">
                  {fee?.toLocaleString("en-US")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="card-body h-100 mt-2 ps-4 pb-4 cursor-pointer">
        <div className="d-flex align-items-center">
          <Link href={`/communities/detail/${groupId}`}>
            <h3 className="fw-bold fs-3 m-0 mb-2">{name}</h3>
          </Link>
          {isBroker && communityType === "owned" && (
            <i
              className={`${styles["edit-group__btn"]} bi bi-pencil ms-2 cursor-pointer`}
              onClick={() => onEditGroupHandler(groupId)}
            ></i>
          )}
        </div>
        <p>{description}</p>
      </div>
    </div>
  );
}
