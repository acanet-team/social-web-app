export const friendList = [
  {
    imageUrl: "user.png",
    name: "Anthony Daugloi",
    friend: "12",
  },
  {
    imageUrl: "user.png",
    name: "Mohannad Zitoun",
    friend: "18",
  },
  {
    imageUrl: "user.png",
    name: "Hurin Seary",
    friend: "28",
  },
  {
    imageUrl: "user.png",
    name: "Nguyen Thi Thanh Phuong",
    friend: "28",
  },
  {
    imageUrl: "user.png",
    name: "Anthony Daugloi",
    friend: "12",
  },
  {
    imageUrl: "user.png",
    name: "Mohannad Zitoun",
    friend: "18",
  },
  {
    imageUrl: "user.png",
    name: "Hurin Seary",
    friend: "28",
  },
  {
    imageUrl: "user.png",
    name: "Nguyen Thi Thanh Phuong",
    friend: "28",
  },
];
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import styles from "@/styles/modules/listConnect.module.scss";
import { getAllConnect, postConnectResponse } from "@/api/connect";
import type { IConnect } from "@/api/connect/model";
import { combineUniqueById } from "@/utils/combine-arrs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import CircleLoader from "./CircleLoader";

const TAKE = 9;
const Friends = () => {
  const t = useTranslations("Connect_investor");
  const isQuery = useMediaQuery({ query: "(max-width: 1275px)" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listConnects, setListConnects] = useState<IConnect[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const displayName = (firstName: string, lastName: string): string => {
    const firstNameArr = firstName.split(" ");
    const lastNameArr = lastName.split(" ");
    const displayName = `${firstNameArr[firstNameArr.length - 1]} ${lastNameArr[0]}`;
    return displayName;
  };

  const fetchAllConnects = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await getAllConnect(
        page,
        TAKE,
        "addressee",
        "pending_request",
      );
      setListConnects((prev: IConnect[]) => {
        const newListConnects: IConnect[] = combineUniqueById(
          response?.data?.docs,
          prev,
        ) as IConnect[];
        return newListConnects;
      });
      setTotalPages(response?.data?.meta?.totalPage);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConnectResponse = async (requestId: string, action: string) => {
    setIsLoading(true);
    try {
      const response = await postConnectResponse(requestId, action);
      setListConnects((prev) =>
        prev.filter((connect) => connect.id !== requestId),
      );
      // console.log("connect response", response);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllConnects(1);
  }, []);

  return (
    <div className="card px-2 w-100 shadow-xss rounded-3 border-0 mb-sm-3 mb-5 nunito-font">
      <div className="card-body d-flex align-items-center">
        <h4 className="fw-700 mb-0 font-xsss text-grey-900">
          {t("friend_request")}
        </h4>
        <Link
          href="/listrequest"
          className="fw-600 ms-auto font-xssss text-primary"
        >
          {t("see_all")}
        </Link>
      </div>
      <div className="row">
        {listConnects?.length > 0 ? (
          listConnects.map((value, index) => (
            <div className={`pt-0 pb-0 ps-0 pe-0`} key={index}>
              <div
                className={`card-body d-flex bor-0 ${styles["list-connect-newfeed"]}`}
              >
                <figure className={`avatar d-flex align-items-center`}>
                  <Image
                    src={
                      value?.requester?.photo?.path || `/assets/images/user.png`
                    }
                    alt="avatar"
                    width={70}
                    height={70}
                    className={` p-2 rounded-circle object-fit-cover`}
                    style={{ objectFit: "cover" }}
                  />
                </figure>

                <div className={` ${styles["list-info-friend-newfeed"]} `}>
                  <Link href="">
                    <h4
                      className="cursor-pointer fw-700 text-grey-900 font-xssss mt-1"
                      style={{ height: "35px" }}
                    >
                      {displayName(
                        value?.requester?.firstName,
                        value?.requester?.lastName,
                      )}
                      {value?.requester?.role === "broker" && (
                        <span className="px-1">
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            size="sm"
                            style={{ color: "#56e137" }}
                          />
                        </span>
                      )}
                      <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
                        @ {value?.requester?.nickName}
                      </span>
                      {/* <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
                    {value.friend} mutual friends
                  </span> */}
                    </h4>
                  </Link>

                  <div
                    className={`${styles["list-btn-friend-newfeed"]} pt-0 pb-2`}
                  >
                    <div
                      onClick={() => {
                        fetchConnectResponse(value?.id, "accept");
                      }}
                      // style={{ width: !isQuery ? "40%" : "80%" }}
                      className={` ${styles["btn-friend-newfeed"]} cursor-pointer p-1 lh-20 bg-primary me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl`}
                    >
                      {t("confirm")}
                    </div>

                    <div
                      onClick={() => {
                        fetchConnectResponse(value?.id, "reject");
                      }}
                      // style={{ width: !isQuery ? "40%" : "80%" }}
                      className={` ${styles["btn-friend-newfeed"]} cursor-pointer p-1 lh-20 bg-grey text-grey-800 text-center font-xssss fw-600 ls-1 rounded-xl`}
                    >
                      {t("delete")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5">{t("no_friend_request")}</div>
        )}
        {isLoading && <CircleLoader />}
      </div>
    </div>
  );
};

export default Friends;
