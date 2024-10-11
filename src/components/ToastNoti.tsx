import React, { useState, useEffect } from "react";
import type { Notification, NotificationType } from "@/api/notification/model";
import { useWebSocket } from "@/context/websocketProvider";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { UUID } from "crypto";
import { postConnectResponse } from "@/api/connect";
import styles from "@/styles/modules/header.module.scss";
import { readNoti } from "@/api/notification";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";

const NotificationToast = () => {
  const [show, setShow] = useState(false);
  const [latestNoti, setLatestNoti] = useState<Notification[]>([]);
  const { notifications } = useWebSocket();
  const t = useTranslations("Notification");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const isQuery = useMediaQuery({ query: "(max-width: 992px" });
  useEffect(() => {
    if (notifications.length > 0) {
      const newNoti = notifications[0];
      setLatestNoti((prev) => [...prev, newNoti]);
      // console.log("latestNoti", latestNoti);
      setShow(true);
    }
    // console.log("socc", notifications);
  }, [notifications]);

  useEffect(() => {
    if (latestNoti.length > 0) {
      const interval = setInterval(() => {
        setLatestNoti((prev) => {
          const updatedNoti = prev.slice(1);

          if (updatedNoti.length === 0) {
            setShow(false);
          }
          return updatedNoti;
        });
      }, 2100);

      return () => clearInterval(interval);
    }
    return () => {};
  }, [latestNoti]);
  if (latestNoti.length === 0) return null;

  const fetchConnectResponse = async (
    requestId: string,
    action: string,
    idNoti: string,
  ) => {
    setIsLoading(true);
    try {
      await postConnectResponse(requestId, action);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderNotificationMessage = (
    type: NotificationType,
    user: {
      userId: number;
      firstName: string;
      lastName: string;
      nickName: string;
    },
    sourceUser: {
      userId: number;
      firstName: string;
      lastName: string;
      nickName: string;
      photo: {
        id: UUID;
        path: string;
      };
    },
    community: {
      communityId: string;
      name: string;
      avatar: {
        id: UUID;
        path: string;
      };
    } | null,
    additionalData: {
      post_id: string;
      comment_id?: string;
      community_id: string | UUID;
      notificationCount: number;
      connection_id: string;
      signal_pair: string;
    } | null,
    createdAt: number,
    notiAt: number | null,
    read_at: number | null,
    id: string,
  ) => {
    switch (type) {
      case "like_post":
        return (
          <>
            <Image
              src={
                sourceUser?.photo?.path ||
                `/assets/images/Acanet_Black_White.png`
              }
              width={40}
              height={40}
              alt="user"
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/Acanet_Black_White.png`}
            />
            <div>
              <h5
                className={`font-xssss ${!read_at ? "text-gray-900" : "text-grey-600"}  mb-0 mt-0 fw-700`}
              >
                {sourceUser?.nickName
                  ? sourceUser?.nickName
                  : sourceUser?.firstName + sourceUser?.lastName}{" "}
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {additionalData ? (
                    Number(additionalData?.notificationCount) === 1 ? (
                      t("liked_your_post")
                    ) : (
                      <>
                        {t("and")}{" "}
                        {`${Number(additionalData?.notificationCount) - 1}`}{" "}
                        {t("people_liked_your_post")}
                      </>
                    )
                  ) : (
                    ""
                  )}
                </span>
              </h5>
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p> */}
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? TimeSinceDate(notiAt) : ""}
              </p> */}
            </div>
          </>
        );
      case "comment_post":
        return (
          <>
            <Image
              src={
                sourceUser?.photo?.path ||
                `/assets/images/Acanet_Black_White.png`
              }
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/Acanet_Black_White.png`}
            />
            <div>
              <h5
                className={`font-xssss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700 d-block`}
              >
                {sourceUser?.nickName
                  ? sourceUser?.nickName
                  : sourceUser?.firstName + sourceUser?.lastName}{" "}
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {additionalData ? (
                    Number(additionalData?.notificationCount) === 1 ? (
                      t("commented_on_your_post")
                    ) : (
                      <>
                        {t("and")}{" "}
                        {`${Number(additionalData?.notificationCount) - 1}`}{" "}
                        {t("people_commented_your_post")}{" "}
                      </>
                    )
                  ) : (
                    ""
                  )}
                </span>
              </h5>
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p> */}
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? TimeSinceDate(notiAt) : ""}
              </p> */}
            </div>
          </>
        );
      case "community_join_request":
        return (
          <>
            <Image
              src={
                community?.avatar?.path ||
                `/assets/images/Acanet_Black_White.png`
              }
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl object-cover ${styles["img-noti"]}`}
              onError={() => `/assets/images/Acanet_Black_White.png`}
            />
            <div>
              <h5
                className={`font-xssss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700 `}
              >
                {sourceUser?.nickName
                  ? sourceUser?.nickName
                  : sourceUser?.firstName + sourceUser?.lastName}{" "}
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {t("has_requested_to_join_your")}{" "}
                  <span
                    className={`font-xssss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700 `}
                  >
                    {community?.name}{" "}
                  </span>
                  <span
                    className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                  >
                    {t("Group")}
                  </span>
                </span>
              </h5>
              {/* <p
                  className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
                >
                  {notiAt ? TimeSinceDate(notiAt) : ""}
                </p> */}
            </div>
          </>
        );
      case "community_join_accept":
        return (
          <>
            <Image
              src={
                community?.avatar?.path ||
                `/assets/images/Acanet_Black_White.png`
              }
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/Acanet_Black_White.png`}
            />
            <div>
              <h5
                className={`font-xssss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700 `}
              >
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {t("you_are_now_a_member_of")}{" "}
                </span>
                {community?.name}{" "}
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {t("Group")}
                </span>
              </h5>
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p> */}
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? TimeSinceDate(notiAt) : ""}
              </p> */}
            </div>
          </>
        );
      case "community_join_reject":
        return (
          <>
            <Image
              src={
                community?.avatar?.path ||
                `/assets/images/Acanet_Black_White.png`
              }
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/Acanet_Black_White.png`}
            />
            <div>
              <h5
                className={`font-xssss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700`}
              >
                {t("your_request_to_join")}{" "}
                <span
                  className={`fw-700 ${!read_at ? "text-grey-900" : "text-grey-600"}`}
                >
                  {community?.name} {t("Group")}
                </span>{" "}
                {t("has_been_unsuccessful")}
              </h5>
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p> */}
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? TimeSinceDate(notiAt) : ""}
              </p> */}
            </div>
          </>
        );
      case "follow":
        return (
          <>
            <Image
              src={
                sourceUser?.photo?.path ||
                `/assets/images/Acanet_Black_White.png`
              }
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/Acanet_Black_White.png`}
            />
            <div>
              <h5
                className={`font-xssss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700`}
              >
                {sourceUser?.nickName
                  ? sourceUser?.nickName
                  : sourceUser?.firstName + sourceUser?.lastName}{" "}
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {t("has followed you")}
                </span>
              </h5>
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p> */}
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? TimeSinceDate(notiAt) : ""}
              </p> */}
            </div>
          </>
        );
      case "connection_accept":
        return (
          <>
            <Image
              src={
                sourceUser?.photo?.path ||
                `/assets/images/Acanet_Black_White.png`
              }
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/Acanet_Black_White.png`}
            />
            <div>
              <h5
                className={`font-xssss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700`}
              >
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {t("you")} {t("and")}{" "}
                </span>
                {sourceUser?.nickName
                  ? sourceUser?.nickName
                  : sourceUser?.firstName + sourceUser?.lastName}{" "}
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {t("are_now_connected")}
                </span>
              </h5>
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p> */}
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? TimeSinceDate(notiAt) : ""}
              </p> */}
            </div>
          </>
        );
      case "community_creation_failed":
        return (
          <>
            <Image
              src={
                sourceUser?.photo?.path ||
                `/assets/images/Acanet_Black_White.png`
              }
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/Acanet_Black_White.png`}
            />
            <div>
              <span
                className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss  m-0`}
              >
                {t("create_paid_group_failed")}
              </span>
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p> */}
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? TimeSinceDate(notiAt) : ""}
              </p> */}
            </div>
          </>
        );
      case "connection_request":
        return (
          <>
            <Image
              src={
                sourceUser?.photo?.path ||
                `/assets/images/Acanet_Black_White.png`
              }
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/Acanet_Black_White.png`}
            />
            <div>
              <h5
                className={`font-xssss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700`}
              >
                {sourceUser?.nickName
                  ? sourceUser?.nickName
                  : sourceUser?.firstName + sourceUser?.lastName}{" "}
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {t("sent_you_the_connection")}
                </span>
              </h5>
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p> */}
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? TimeSinceDate(notiAt) : ""}
              </p> */}

              <div className="d-flex align-items-center pt-0 pb-2">
                <div
                  onClick={
                    additionalData
                      ? () =>
                          fetchConnectResponse(
                            additionalData?.connection_id,
                            "accept",
                            id,
                          )
                      : undefined
                  }
                  className="cursor-pointer p-1 lh-20 w90 bg-primary me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl"
                >
                  {t("confirm")}
                </div>

                <div
                  onClick={
                    additionalData
                      ? () =>
                          fetchConnectResponse(
                            additionalData?.connection_id,
                            "reject",
                            id,
                          )
                      : undefined
                  }
                  className="cursor-pointer p-1 lh-20 w90 bg-grey text-grey-800 text-center font-xssss fw-600 ls-1 rounded-xl"
                >
                  {t("delete")}
                </div>
              </div>
            </div>
          </>
        );
      case "tracking_signal_lose":
        return (
          <>
            <Image
              src={`/assets/images/Acanet_Black_White.png`}
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/Acanet_Black_White.png`}
            />
            <div>
              <h5
                className={`font-xssss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700`}
              >
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {t("The_Signal")}
                </span>{" "}
                {additionalData?.signal_pair}{" "}
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {t("you_opened_has_hit_the_stoploss_level")}
                </span>
              </h5>
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p> */}
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? TimeSinceDate(notiAt) : ""}
              </p> */}
            </div>
          </>
        );
      case "tracking_signal_win":
        return (
          <>
            <Image
              src={`/assets/images/Acanet_Black_White.png`}
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/Acanet_Black_White.png`}
            />
            <div>
              <h5
                className={`font-xssss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700`}
              >
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {t("The_Signal")}
                </span>{" "}
                {additionalData?.signal_pair}{" "}
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {t("you_opened_has_successfully_hit_the_takeprofit_target")}
                </span>
              </h5>
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p> */}
              {/* <p
                  className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
                >
                  {notiAt ? TimeSinceDate(notiAt) : ""}
                </p> */}
            </div>
          </>
        );
      case "created_signal_lose":
        return (
          <>
            <Image
              src={`/assets/images/Acanet_Black_White.png`}
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/Acanet_Black_White.png`}
            />
            <div>
              <h5
                className={`font-xssss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700`}
              >
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {t("The_Signal")}
                </span>{" "}
                {additionalData?.signal_pair}{" "}
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {t("create_signal_lose")}
                </span>
              </h5>
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p> */}
              {/* <p
                    className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
                  >
                    {notiAt ? TimeSinceDate(notiAt) : ""}
                  </p> */}
            </div>
          </>
        );
      case "created_signal_win":
        return (
          <>
            <Image
              src={`/assets/images/Acanet_Black_White.png`}
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/Acanet_Black_White.png`}
            />
            <div>
              <h5
                className={`font-xssss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700`}
              >
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {t("Congratulations")} {t("The_Signal")}
                </span>{" "}
                {additionalData?.signal_pair}{" "}
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {t("create_signal_win")}
                </span>
              </h5>
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p> */}
              {/* <p
                    className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
                  >
                    {notiAt ? TimeSinceDate(notiAt) : ""}
                  </p> */}
            </div>
          </>
        );
      case "signal_tracked":
        return (
          <>
            <Image
              src={`/assets/images/Acanet_Black_White.png`}
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/Acanet_Black_White.png`}
            />
            <div>
              <h5
                className={`font-xssss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700`}
              >
                {sourceUser?.nickName
                  ? sourceUser?.nickName
                  : sourceUser?.firstName + sourceUser?.lastName}{" "}
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {additionalData ? (
                    Number(additionalData?.notificationCount) === 1 ? (
                      t("had_tracked")
                    ) : (
                      <>
                        {t("and")}{" "}
                        {`${Number(additionalData?.notificationCount) - 1}`}{" "}
                        {t("people_had_tracked")}
                      </>
                    )
                  ) : (
                    ""
                  )}
                </span>{" "}
                {additionalData?.signal_pair}{" "}
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  signal
                </span>
              </h5>
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p> */}
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? TimeSinceDate(notiAt) : ""}
              </p> */}
            </div>
          </>
        );
      case "verify_broker_accept":
        return (
          <>
            <Image
              src={`/assets/images/Acanet_Black_White.png`}
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/Acanet_Black_White.png`}
            />
            <div>
              <h5
                className={`font-xssss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700`}
              >
                {t("verify_broker_accept")}
              </h5>
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p> */}
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? TimeSinceDate(notiAt) : ""}
              </p> */}
            </div>
          </>
        );
      case "verify_broker_reject":
        return (
          <>
            <Image
              src={`/assets/images/Acanet_Black_White.png`}
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/Acanet_Black_White.png`}
            />
            <div>
              <h5
                className={`font-xssss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700`}
              >
                {t("verify_broker_reject")}
              </h5>
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p> */}
              {/* <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? TimeSinceDate(notiAt) : ""}
              </p> */}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const readNotis = async (
    id: string,
    idDetail: string,
    notificationType: string,
    read_at: number | null,
  ) => {
    if (read_at === null) {
      await readNoti(id);
    }
    if (
      notificationType === "like_post" ||
      notificationType === "comment_post" ||
      notificationType === "verify_broker_accept" ||
      notificationType === "verify_broker_reject"
    ) {
    } else if (notificationType === "community_join_accept") {
      router.push(`/communities/detail/${idDetail}`);
      // toggleisNoti(false);
    } else if (notificationType === "community_join_request") {
      router.push(`/communities/detail/${idDetail}?tab=requests`);
      // toggleisNoti(false);
    } else if (notificationType === "follow") {
      router.push(`/profile/${idDetail}`);
      // toggleisNoti(false);
    } else if (
      notificationType === "connection_accept"
      // || notificationType === "connection_request"
    ) {
      router.push(`/profile/${idDetail}`);
      // toggleisNoti(false);
    } else if (notificationType === "community_join_reject") {
      router.push(`/communities`);
    } else if (notificationType === "community_creation_failed") {
      router.push(`/communities`);
    } else if (
      notificationType === "tracking_signal_lose" ||
      notificationType === "tracking_signal_win"
    ) {
      router.push(`/signal?tab=history`);
      // toggleisNoti(false);
    } else if (
      notificationType === "created_signal_lose" ||
      notificationType === "created_signal_win" ||
      notificationType === "signal_tracked"
    ) {
      router.push(`/profile/${idDetail}?tab=signal`);
      // toggleisNoti(false);
    } else {
      console.log("");
    }
  };

  return (
    <div className={``}>
      {latestNoti?.map((notification, index) => (
        <div
          key={notification?.id}
          className={`position-fixed start-0 p-3`}
          style={{
            zIndex: 99,
            bottom: isQuery ? `${index * 155 + 56}px` : `${index * 155}px`,
          }}
        >
          <div
            // className={`toast show  bg-white`}
            className={`toast ${show ? "show" : "hide"}  bg-white`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              <strong className="me-auto">{t("new_noti")}</strong>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setShow(false)}
              ></button>
            </div>
            <div className="toast-body">
              <div
                style={{
                  height:
                    notification.type === "connection_request" ||
                    notification.type === "created_signal_lose" ||
                    notification?.type === "created_signal_win" ||
                    notification?.type === "community_creation_failed"
                      ? "75px"
                      : notification.type === "verify_broker_accept" ||
                          notification.type === "verify_broker_reject"
                        ? "85px"
                        : "70px",
                  padding: "4px",
                }}
                className={`card w-100 border-0 mb-1 cursor-pointer`}
              >
                <div className={`${styles["group-card-noti"]}`}>
                  <div
                    onClick={() => {
                      if (
                        notification?.type === "like_post" ||
                        notification?.type === "comment_post"
                      ) {
                        readNotis(
                          notification?.id,
                          notification?.additionalData?.post_id,
                          notification?.type,
                          notification?.read_at,
                        );
                      } else if (
                        notification?.type === "community_join_request" ||
                        notification?.type === "community_join_accept" ||
                        notification?.type === "community_join_reject"
                      ) {
                        readNotis(
                          notification?.id,
                          notification?.community?.communityId || "",
                          notification?.type,
                          notification?.read_at,
                        );
                      } else if (notification?.type === "follow") {
                        readNotis(
                          notification?.id,
                          String(notification?.user?.nickName),
                          notification?.type,
                          notification?.read_at,
                        );
                      } else if (
                        notification?.type === "connection_accept"
                        // || notification?.type === "connection_request"
                      ) {
                        readNotis(
                          notification?.id,
                          String(notification?.sourceUser?.nickName),
                          notification?.type,
                          notification?.read_at,
                        );
                      } else if (
                        notification?.type === "community_creation_failed"
                      ) {
                        readNotis(
                          notification?.id,
                          "",
                          notification?.type,
                          notification?.read_at,
                        );
                      } else if (
                        notification?.type === "tracking_signal_lose" ||
                        notification?.type === "tracking_signal_win"
                      ) {
                        readNotis(
                          notification?.id,
                          "",
                          notification?.type,
                          notification?.read_at,
                        );
                      } else if (
                        notification?.type === "created_signal_lose" ||
                        notification?.type === "created_signal_win" ||
                        notification?.type === "signal_tracked"
                      ) {
                        readNotis(
                          notification?.id,
                          String(notification?.user?.nickName),
                          notification?.type,
                          notification?.read_at,
                        );
                      } else if (
                        notification?.type === "verify_broker_accept" ||
                        notification?.type === "verify_broker_reject"
                      ) {
                        readNotis(
                          notification?.id,
                          String(notification?.user?.nickName),
                          notification?.type,
                          notification?.read_at,
                        );
                      } else {
                        console.log("Notification type not found");
                      }
                    }}
                    className="p-2"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "8px",
                    }}
                  >
                    {renderNotificationMessage(
                      notification?.type,
                      notification?.user,
                      notification?.sourceUser,
                      notification?.community,
                      notification?.additionalData,
                      notification?.createdAt,
                      notification?.notiAt,
                      notification?.read_at,
                      notification?.id,
                    )}
                    <p
                      className={`font-xssss fw-600 m-0 ${
                        !notification?.read_at
                          ? "text-primary"
                          : "text-grey-500"
                      }`}
                    >
                      {/* {notification?.notiAt
                          ? TimeSinceDate(notification?.notiAt)
                          : ""} */}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
