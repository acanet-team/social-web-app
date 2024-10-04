import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Notification, NotificationType } from "@/api/notification/model";
import type { UUID } from "crypto";
import type {
  BaseArrayResponseNotis,
  BaseArrayResponsVersionDocs,
} from "@/api/model";
import { getNotifications, patchReadAll, readNoti } from "@/api/notification";
import styles from "@/styles/modules/header.module.scss";
import { combineUniqueById } from "@/utils/combine-arrs";
import { useRouter } from "next/navigation";
import PostNotiDetail from "./PostNotiDetal";
import WaveLoader from "./WaveLoader";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "react-responsive";
import { postConnectResponse } from "@/api/connect";
import { throwToast } from "@/utils/throw-toast";
import { TimeSinceDate } from "@/utils/time-since-date";
interface NotificationProps {
  notificationsSocket: Notification[];
  toggleisNoti: React.Dispatch<React.SetStateAction<boolean>>;
  setReadAllNotis: React.Dispatch<React.SetStateAction<boolean>>;
  setCountNotis: React.Dispatch<React.SetStateAction<number>>;
  isNoti: boolean;
  countNotis: number;
}

const Notifications: React.FC<NotificationProps> = ({
  notificationsSocket,
  toggleisNoti,
  setReadAllNotis,
  isNoti,
  setCountNotis,
  countNotis,
}) => {
  const t = useTranslations("Notification");
  const router = useRouter();
  const [notis, setNotis] = useState<Notification[]>([]);
  const [page, setPage] = useState<number>(1);
  const isQuery = useMediaQuery({ query: "(max-width: 650px" });
  const [take] = useState<number>(isQuery ? 7 : 4);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openPostModal, setOpenPostModal] = useState<string>("");
  const notisListRef = useRef<HTMLDivElement>(null);
  // const [newNotificationsCount, setNewNotificationsCount] = useState(0);

  const getTimeDifference = (createdAt: number) => {
    const now = Date.now();
    const diffInMs = now - createdAt + 1;

    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
      return `${seconds} second${seconds > 1 ? "s" : ""}`;
    }
  };

  const fetchConnectResponse = async (
    requestId: string,
    action: string,
    idNoti: string,
  ) => {
    setIsLoading(true);
    try {
      await postConnectResponse(requestId, action);
      setNotis((prev) =>
        prev.filter((connectNoti) => connectNoti.id !== idNoti),
      );
    } catch (err) {
      console.error(err);
      throwToast("Connection was cancelled", "error");
      setNotis((prev) =>
        prev.filter((connectNoti) => connectNoti.id !== idNoti),
      );
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
                `/assets/images/default-ava-not-bg.jpg`
              }
              width={40}
              height={40}
              alt="user"
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/default-ava-not-bg.jpg`}
            />
            <div>
              <h5
                className={`font-xssss ${!read_at ? "text-gray-900" : "text-grey-600"}  mb-0 mt-0 fw-700 d-block`}
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
              <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p>
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
                `/assets/images/default-ava-not-bg.jpg`
              }
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/default-ava-not-bg.jpg`}
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
              <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p>
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
                `/assets/images/default-ava-not-bg.jpg`
              }
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className="w40 rounded-xl object-cover"
              onError={() => `/assets/images/default-ava-not-bg.jpg`}
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
                  {t("has_requested_to_join_your")}{" "}
                  <span
                    className={`font-xssss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700 d-block`}
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
                `/assets/images/default-ava-not-bg.jpg`
              }
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/default-ava-not-bg.jpg`}
            />
            <div>
              <h5
                className={`font-xssss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700 d-block`}
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
              <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p>
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
                `/assets/images/default-ava-not-bg.jpg`
              }
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/default-ava-not-bg.jpg`}
            />
            <div>
              <h5
                className={`font-xssss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700 d-block`}
              >
                {t("your_request_to_join")}{" "}
                <span
                  className={`fw-700 ${!read_at ? "text-grey-900" : "text-grey-600"}`}
                >
                  {community?.name} {t("Group")}
                </span>{" "}
                {t("has_been_unsuccessful")}
              </h5>
              <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p>
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
                `/assets/images/default-ava-not-bg.jpg`
              }
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/default-ava-not-bg.jpg`}
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
                  {t("has followed you")}
                </span>
              </h5>
              <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p>
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
                `/assets/images/default-ava-not-bg.jpg`
              }
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/default-ava-not-bg.jpg`}
            />
            <div>
              <h5
                className={`font-xssss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700 d-block`}
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
              <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p>
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
                `/assets/images/default-ava-not-bg.jpg`
              }
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/default-ava-not-bg.jpg`}
            />
            <div>
              <span
                className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss  m-0`}
              >
                {t("create_paid_group_failed")}
              </span>
              <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p>
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
                `/assets/images/default-ava-not-bg.jpg`
              }
              width={40}
              height={40}
              alt="user"
              style={{ objectFit: "cover" }}
              className={`w40 rounded-xl ${styles["img-noti"]}`}
              onError={() => `/assets/images/default-ava-not-bg.jpg`}
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
                  {t("sent_you_the_connection")}
                </span>
              </h5>
              <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p>
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
      default:
        return null;
    }
  };

  const fetchNotifications = async (page: number) => {
    setIsLoading(true);
    try {
      const response: BaseArrayResponseNotis<Notification> =
        await getNotifications(page, take);
      // if (countNotis > 0 ){
      //   setReadAllNotis(false);
      // } else {
      //   setReadAllNotis(true);
      // }
      setNotis((prevNotis: Notification[]) => {
        const newNotis: Notification[] = combineUniqueById(
          prevNotis,
          response?.data?.docs,
        ) as Notification[];
        return newNotis;
      });
      setCountNotis(response?.data?.newNotificationsCount);
      // console.log("llllll", response?.data?.newNotificationsCount);
      setTotalPages(response?.data?.meta?.totalPage);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (isNoti === true) {
      // fetchNotifications(1);
      patchReadAll();
      setReadAllNotis(true);
    }
  }, [isNoti]);

  useEffect(() => {
    if (page > 1) {
      fetchNotifications(page);
    }
  }, [page]);

  useEffect(() => {
    fetchNotifications(1);
    if (countNotis > 0) {
      setReadAllNotis(false);
    } else {
      setReadAllNotis(true);
    }
  }, [countNotis]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (notificationsSocket.length > 0) {
        try {
          const response: BaseArrayResponseNotis<Notification> =
            await getNotifications(1, take);
          // console.log("socccccc", response);
          setNotis(response.data.docs);
          setCountNotis(response?.data?.newNotificationsCount);
          if (countNotis > 0) {
            setReadAllNotis(false);
          } else {
            setReadAllNotis(true);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };
    fetchNotifications();
    // console.log("socc", notificationsSocket);
  }, [notificationsSocket]);

  const onScrollHandlerNoti = () => {
    if (notisListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = notisListRef.current;
      if (scrollTop + clientHeight + 2 >= scrollHeight && page < totalPages) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    const currentList = notisListRef.current;
    if (currentList && page < totalPages) {
      currentList.addEventListener("scroll", onScrollHandlerNoti);
    }

    return () => {
      if (currentList) {
        currentList.removeEventListener("scroll", onScrollHandlerNoti);
      }
    };
  }, [page, totalPages]);

  // useEffect(() => {
  //   if (notificationsSocket.length > 0) {
  //     fetchNotifications(1);
  //     setNotis((prevState: Notification[]) => {
  //       const connectionRequestId = notificationsSocket
  //         .filter((notiSocket) => notiSocket.type === "connection_request")
  //         .map((notiSocket) => notiSocket.id);

  //       const updatedNotis: Notification[] = prevState.filter(
  //         (notiApi) =>
  //           !notificationsSocket.some(
  //             (notiSocket) => notiSocket.id === notiApi.id,
  //           ),
  //       );
  //       const notification: Notification[] = [
  //         ...notificationsSocket,
  //         ...updatedNotis,
  //       ] as Notification[];

  //       const afterFilterConnetionNotiRequest = notification.filter(
  //         (noti) => !connectionRequestId.includes(noti.id),
  //       );
  //       return afterFilterConnetionNotiRequest;
  //     });
  //     console.log("Updated notification", notis);
  //   }
  // }, [notificationsSocket]);

  const resetPostId = useCallback(() => {
    setOpenPostModal("");
  }, [openPostModal]);

  const readNotis = async (
    id: string,
    idDetail: string,
    notificationType: string,
    read_at: number | null,
  ) => {
    if (read_at === null) {
      await readNoti(id);
      setNotis((prevNotis) =>
        prevNotis.map((notification) =>
          notification.id === id
            ? { ...notification, read_at: Date.now() }
            : notification,
        ),
      );
    }
    if (
      notificationType === "like_post" ||
      notificationType === "comment_post"
    ) {
      setOpenPostModal(idDetail);
      toggleisNoti(false);
    } else if (notificationType === "community_join_accept") {
      router.push(`/communities/detail/${idDetail}`);
      toggleisNoti(false);
    } else if (notificationType === "community_join_request") {
      router.push(`/communities/detail/${idDetail}?tab=requests`);
      toggleisNoti(false);
    } else if (notificationType === "follow") {
      router.push(`/profile/${idDetail}`);
      toggleisNoti(false);
    } else if (
      notificationType === "connection_accept"
      // || notificationType === "connection_request"
    ) {
      router.push(`/profile/${idDetail}`);
      toggleisNoti(false);
    } else if (notificationType === "community_join_reject") {
      router.push(`/communities`);
    } else if (notificationType === "community_creation_failed") {
      router.push(`/communities`);
    } else {
      console.log("");
    }
  };

  return (
    <div ref={notisListRef} className={`${styles["height-dropdown-menu"]}`}>
      <div
        className="d-flex justify-content-between"
        // style={{ justifyContent: "space-between" }}
      >
        <h4 className={`fw-700 mb-4 ${styles["title-dropdown-menu"]}`}>
          Notification
        </h4>
      </div>
      <div>
        {notis?.length === 0 ? (
          <p className="font-xsss text-grey-500 mb-1 mt-0 fw-400 d-block">
            No Notifications Found
          </p>
        ) : (
          <div>
            {notis?.map((notification) => (
              <div
                key={notification?.id}
                style={{
                  height:
                    notification.type === "connection_request"
                      ? // && !notification.read_at
                        "105px"
                      : notification.type === "community_creation_failed"
                        ? "95px"
                        : "70px",
                  padding: "4px",
                }}
                className={`card w-100 border-0 mb-1 cursor-pointer  
                `}
                //   newNotifications.has(notification.id) ||
                //  ${!notification?.read_at ? "bg-lightblue" : ""}
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
                      } else {
                        console.log("Notification type not found");
                      }
                    }}
                    className="p-2"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "8px",
                      alignItems: "center",
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
                  </div>
                  <>
                    {!notification?.read_at && (
                      <span
                        style={{
                          width: "10px",
                          height: "10px",
                          minWidth: "10px",
                          minHeight: "10px",
                        }}
                        className={`dot-count rounded-circle bg-primary`}
                      ></span>
                    )}
                  </>
                </div>
              </div>
            ))}
          </div>
        )}
        {isLoading && page > 1 && <WaveLoader />}

        {openPostModal && (
          <PostNotiDetail id={openPostModal} resetPostId={resetPostId} />
        )}
      </div>
    </div>
  );
};

export default Notifications;
