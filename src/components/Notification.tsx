import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import type { Notification, NotificationType } from "@/api/notification/model";
import type { UUID } from "crypto";
import type { BaseArrayResponsVersionDocs } from "@/api/model";
import { getNotifications, readNoti } from "@/api/notification";
import styles from "@/styles/modules/header.module.scss";
import { combineUniqueById } from "@/utils/combine-arrs";
import { useRouter } from "next/navigation";
import PostNotiDetail from "./PostNotiDetal";
import WaveLoader from "./WaveLoader";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "react-responsive";
import { postConnectResponse } from "@/api/connect";
import { throwToast } from "@/utils/throw-toast";
interface NotificationProps {
  notificationsSocket: Notification[];
  toggleisNoti: React.Dispatch<React.SetStateAction<boolean>>;
  setReadAllNotis: React.Dispatch<React.SetStateAction<boolean>>;
  isNoti: boolean;
}

const Notifications: React.FC<NotificationProps> = ({
  notificationsSocket,
  toggleisNoti,
  setReadAllNotis,
  isNoti,
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
  const photo = `/assets/images/default-ava-not-bg.jpg`;
  // const [showAcceptResConnection, setShowAcceptResConnection] =
  //   useState<boolean>(false);
  // const [showRejectResConnection, setShowRejectResConnection] =
  //   useState<boolean>(false);
  // const [showConnection, setShowConnection] = useState<boolean>(true);
  const getTimeDifference = (createdAt: number) => {
    const now = Date.now();
    const diffInMs = now - createdAt;

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
      setNotis((prevNotis) =>
        prevNotis.map((notification) =>
          notification.id === idNoti
            ? { ...notification, read_at: Date.now() }
            : notification,
        ),
      );
      // setNotis((prev) =>
      //   prev.filter((connectNoti) => connectNoti.id !== idNoti),
      // );
      // if (action === "accept") {
      //   setShowConnection(false);
      //   setShowAcceptResConnection(true);
      // } else if (action === "reject") {
      //   setShowConnection(false);
      //   setShowRejectResConnection(true);
      // }
    } catch (err) {
      console.error(err);
      throwToast("Connection was cancelled", "error");
      setNotis((prevNotis) =>
        prevNotis.map((notification) =>
          notification.id === idNoti
            ? { ...notification, read_at: Date.now() }
            : notification,
        ),
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
              src={sourceUser?.photo?.path || photo}
              width={40}
              height={40}
              alt="user"
              className="w40 rounded-xl"
            />
            <div>
              <h5
                className={`font-xsss ${!read_at ? "text-gray-900" : "text-grey-600"}  mb-0 mt-0 fw-700 d-block`}
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
            </div>
          </>
        );
      case "comment_post":
        return (
          <>
            <Image
              src={sourceUser?.photo?.path || photo}
              width={40}
              height={40}
              alt="user"
              className="w40 rounded-xl object-cover"
            />
            <div>
              <h5
                className={`font-xsss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700 d-block`}
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
                {/* {getTimeDifference(createdAt)} */}
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p>
            </div>
          </>
        );
      case "community_join_request":
        return (
          <>
            <Image
              src={community?.avatar?.path || photo}
              width={40}
              height={40}
              alt="user"
              className="w40 rounded-xl object-cover"
            />
            <div>
              <h5
                className={`font-xsss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700 d-block`}
              >
                {sourceUser?.nickName
                  ? sourceUser?.nickName
                  : sourceUser?.firstName + sourceUser?.lastName}{" "}
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {t("has_requested_to_join_your")}{" "}
                  <span className="fw-700 text-grey-900">
                    {community?.name} {t("Group")}
                  </span>
                </span>
              </h5>
              <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {/* {getTimeDifference(createdAt)} */}
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p>
            </div>
          </>
        );
      case "community_join_accept":
        return (
          <>
            <Image
              src={community?.avatar?.path || photo}
              width={40}
              height={40}
              alt="user"
              className="w40 rounded-xl object-cover"
            />
            <div>
              <h5
                className={`font-xsss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700 d-block`}
              >
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {t("you_are_now_a_member_of")}{" "}
                </span>
                {community?.name} {t("Group")}
              </h5>
              <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {/* {getTimeDifference(createdAt)} */}
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p>
            </div>
          </>
        );
      case "community_join_reject":
        return (
          <>
            <Image
              src={community?.avatar?.path || photo}
              width={40}
              height={40}
              alt="user"
              className="w40 rounded-xl object-cover"
            />
            <div>
              <h5
                className={`font-xsss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700 d-block`}
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
                {/* {getTimeDifference(createdAt)} */}
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p>
            </div>
          </>
        );
      case "follow":
        return (
          <>
            <Image
              src={sourceUser?.photo?.path || photo}
              width={40}
              height={40}
              alt="user"
              className="w40 rounded-xl object-cover"
            />
            <div>
              <h5
                className={`font-xsss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700 d-block`}
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
            </div>
          </>
        );
      case "connection_accept":
        return (
          <>
            <Image
              src={sourceUser?.photo?.path || photo}
              width={40}
              height={40}
              alt="user"
              className="w40 rounded-xl object-cover"
            />
            <div>
              <h5
                className={`font-xsss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700 d-block`}
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
            </div>
          </>
        );
      case "community_creation_failed":
        return (
          <>
            <Image
              src={sourceUser?.photo?.path || photo}
              width={40}
              height={40}
              alt="user"
              className="w40 rounded-xl object-cover"
            />
            <div>
              <span
                className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
              >
                {t("create_paid_group_failed")}
              </span>

              <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p>
            </div>
          </>
        );
      case "connection_request":
        return (
          <>
            <Image
              src={sourceUser?.photo?.path || photo}
              width={40}
              height={40}
              alt="user"
              className="w40 rounded-xl object-cover"
            />
            <div>
              <h5
                className={`font-xsss ${!read_at ? "text-grey-900" : "text-grey-600"}  mb-0 mt-0 fw-700 d-block`}
              >
                {sourceUser?.nickName
                  ? sourceUser?.nickName
                  : sourceUser?.firstName + sourceUser?.lastName}{" "}
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {t("sent_you_the_connection")}
                  {/* {showConnection
                    ? t("sent_you_the_connection")
                    : showAcceptResConnection
                      ? "and you are now connected"
                      : showRejectResConnection
                        ? "and you aren't connected"
                        : ""} */}
                </span>
              </h5>
              <p
                className={`font-xssss fw-600 m-0  ${!read_at ? "text-primary" : "text-grey-500"}`}
              >
                {/* {getTimeDifference(createdAt)} */}
                {notiAt ? getTimeDifference(notiAt) : ""}
              </p>
              {!read_at && (
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
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response: BaseArrayResponsVersionDocs<Notification> =
        await getNotifications(page, take);
      setNotis((prevNotis: Notification[]) => {
        const newNotis: Notification[] = combineUniqueById(
          prevNotis,
          response?.data?.docs,
        ) as Notification[];
        return newNotis;
      });
      // console.log("notiApiiiiiii", response.data.docs);
      // console.log("notiApiiiiiiiNotis", notis);
      setTotalPages(response?.data?.meta?.totalPage);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (isNoti === true) {
      fetchNotifications();
    }
  }, [isNoti]);

  useEffect(() => {
    if (page > 1) {
      fetchNotifications();
    }
  }, [page]);

  useEffect(() => {
    fetchNotifications();
  }, []);

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

  useEffect(() => {
    if (notificationsSocket.length > 0) {
      // setShowConnection(true)
      setNotis((prevState: Notification[]) => {
        const updatedNotis: Notification[] = prevState.filter(
          (notiApi) =>
            !notificationsSocket.some(
              (notiSocket) => notiSocket.id === notiApi.id,
            ),
        );
        const notification: Notification[] = [
          ...notificationsSocket,
          ...updatedNotis,
        ] as Notification[];
        return notification;
      });
      console.log("Updated notification", notis);
    }
  }, [notificationsSocket]);

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
    } else if (
      notificationType === "community_join_request" ||
      notificationType === "community_join_accept"
    ) {
      router.push(`/communities/detail/${idDetail}`);
      toggleisNoti(false);
    } else if (notificationType === "follow") {
      router.push(`/profile/${idDetail}`);
      toggleisNoti(false);
    } else if (notificationType === "connection_accept") {
      router.push(`/profile/${idDetail}`);
      toggleisNoti(false);
    } else if (notificationType === "community_join_reject") {
      router.push(`/communities`);
      // } else if (notificationType === "connection_request") {
      //   router.push(`/profile/${idDetail}`);
    } else {
      console.log("");
    }
  };
  const checkReadAllNotis = () => {
    const allRead = notis.every(
      (notification) => notification.read_at !== null,
    );
    if (allRead) {
      console.log("All notifications are read, updating state.");
      setReadAllNotis(true);
    } else {
      setReadAllNotis(false);
    }
  };
  useEffect(() => {
    checkReadAllNotis();
  }, [notis]);

  useEffect(() => {
    console.log("notissoc", notificationsSocket);
  }, [notificationsSocket]);

  return (
    <div ref={notisListRef} className={`${styles["height-dropdown-menu"]}`}>
      <h4 className={`fw-700 mb-4 ${styles["title-dropdown-menu"]}`}>
        Notification
      </h4>
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
                    notification.type === "connection_request" &&
                    !notification.read_at
                      ? // showConnection
                        "108px"
                      : "72px",
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
                      } else if (notification?.type === "connection_accept") {
                        readNotis(
                          notification?.id,
                          String(notification?.user?.nickName),
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
                        style={{ width: "10px", height: "10px" }}
                        className={`dot-count rounded-circle bg-primary`}
                      >
                        .
                      </span>
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
