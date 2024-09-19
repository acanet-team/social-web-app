import React, { useCallback, useEffect, useRef, useState } from "react";
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
interface NotificationProps {
  notifications: Notification[];
  toggleisNoti: React.Dispatch<React.SetStateAction<boolean>>;
  setReadAllNotis: React.Dispatch<React.SetStateAction<boolean>>;
  isNoti: boolean;
  // setNotiSocket: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const Notifications: React.FC<NotificationProps> = ({
  notifications,
  toggleisNoti,
  setReadAllNotis,
  isNoti,
  // setNotiSocket,
}) => {
  const router = useRouter();
  const [notis, setNotis] = useState<Notification[]>([]);
  const [page, setPage] = useState<number>(1);
  const [take] = useState<number>(3);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openPostModal, setOpenPostModal] = useState<string>("");
  const notisListRef = useRef<HTMLDivElement>(null);
  const photo = `/assets/images/default-ava-not-bg.jpg`;
  useEffect(() => {
    console.log("notiApi", notis);
  }, [notis]);
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
    } | null,
    createdAt: number,
    notiAt: number | null,
    read_at: number | null,
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
                className={`font-xsss ${!read_at ? "text-gray-700" : "text-grey-900"}  mb-0 mt-0 fw-700 d-block`}
              >
                {sourceUser?.nickName
                  ? sourceUser?.nickName
                  : sourceUser?.firstName + sourceUser?.lastName}{" "}
                <span
                  className={`${!read_at ? "text-grey-600" : "text-grey-500"} fw-500 font-xssss lh-4 m-0`}
                >
                  {additionalData
                    ? Number(additionalData?.notificationCount) === 1
                      ? `liked your post`
                      : `and ${Number(additionalData?.notificationCount) - 1} people liked your post`
                    : ""}
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
                  {additionalData
                    ? Number(additionalData?.notificationCount) === 1
                      ? `commented on your post`
                      : `and ${Number(additionalData?.notificationCount) - 1} people commented on your post`
                    : ""}
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
                  has requested to join your{" "}
                  <span className="fw-700 text-grey-900">
                    {community?.name} Group
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
                  You are new a member of{" "}
                </span>
                {community?.name} Group
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
                Your request to join{" "}
                <span
                  className={`fw-700 ${!read_at ? "text-grey-900" : "text-grey-600"}`}
                >
                  {community?.name} Group
                </span>{" "}
                has been unsuccessful
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
                <span className="text-grey-600 fw-500 font-xssss lh-4 m-0">
                  has followed you
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
      default:
        return null;
    }
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response: BaseArrayResponsVersionDocs<Notification> =
        await getNotifications(page, take);
      // setNotis((prevNotis: Notification[]) => {
      //   const newNotis: Notification[] = combineUniqueById(
      //     response?.data?.docs,
      //     prevNotis,
      //   ) as Notification[];
      //   return newNotis;
      // });
      setNotis(response?.data?.docs);

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
    if (notifications.length > 0) {
      setNotis((prevState: Notification[]) => {
        const updatedNotis: Notification[] = prevState.filter(
          (notiApi) =>
            !notifications.some((notiSocket) => notiSocket.id === notiApi.id),
        );
        const notification: Notification[] = [
          ...notifications,
          ...updatedNotis,
        ] as Notification[];
        return notification;
      });
      console.log("Updated notification", notis);
    }
  }, [notifications]);

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
      notificationType === "community_join_accept" ||
      notificationType === "community_join_reject"
    ) {
      router.push(`/communities/detail/${idDetail}`);
      toggleisNoti(false);
    } else if (notificationType === "follow") {
      router.push(`/profile/${idDetail}`);
      toggleisNoti(false);
    } else {
      console.log("");
    }
  };
  useEffect(() => {
    const allRead = notis.every(
      (notification) => notification.read_at !== null,
    );
    if (allRead) {
      console.log("All notifications are read, updating state.");
      setReadAllNotis(true);
    } else {
      setReadAllNotis(false);
    }
  }, [notis]);

  const onScrollHandler = () => {
    if (notisListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = notisListRef.current;
      if (scrollTop + clientHeight === scrollHeight && page < totalPages) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    const currentList = notisListRef.current;
    if (currentList) {
      currentList.addEventListener("scroll", onScrollHandler);
    }
    return () => {
      if (currentList) {
        currentList.removeEventListener("scroll", onScrollHandler);
      }
    };
  }, [page, totalPages, isLoading]);
  // console.log("notissoc", notifications);

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
          notis?.map((notification) => (
            <div
              key={notification?.id}
              style={{ height: "72px", padding: "4px" }}
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
                        String(notification?.user.userId),
                        notification?.type,
                        notification?.read_at,
                      );
                    } else {
                      console.log("Notification type not found");
                    }
                  }}
                  className="p-2"
                  style={{ display: "flex", flexDirection: "row", gap: "8px" }}
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
          ))
        )}
        {isLoading && <WaveLoader />}
        {openPostModal && (
          <PostNotiDetail id={openPostModal} resetPostId={resetPostId} />
        )}
      </div>
    </div>
  );
};

export default Notifications;
