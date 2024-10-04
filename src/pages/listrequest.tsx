import type { InferGetServerSidePropsType, NextPageContext } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/modules/listConnect.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { getAllConnect, postConnectResponse } from "@/api/connect";
import { IConnect } from "@/api/connect/model";
import { combineUniqueById } from "@/utils/combine-arrs";
import CircleLoader from "@/components/CircleLoader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/context/websocketProvider";
import { throwToast } from "@/utils/throw-toast";

const TAKE = 9;
const ListRequest = ({
  listAllConnects,
  page,
  totalPage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // console.log("listAllConnect", listAllConnects);
  const t = useTranslations("Connect_investor");
  const listConnectRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pages, setPages] = useState<number>(page);
  const [totalPages, setTotalPages] = useState<number>(totalPage);
  const [listConnects, setListConnects] = useState<IConnect[]>(listAllConnects);
  const { data: session } = useSession() as any;
  const router = useRouter();
  const { notifications } = useWebSocket();

  useEffect(() => {
    if (session?.user?.role?.name === "broker") {
      router.push("/404");
    } else {
      fetchAllConnects(1);
    }
  }, []);

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
        8,
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
      console.log("connect response", response);
    } catch (err) {
      console.error(err);
      throwToast("Connection was cancelled", "error");
      setListConnects((prev) =>
        prev.filter((connect) => connect.id !== requestId),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onScrollHandler = () => {
    if (document.documentElement) {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (
        scrollTop + clientHeight >= scrollHeight - 100 &&
        !isLoading &&
        page < totalPage
      ) {
        setPages((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    const currentList = listConnectRef.current;
    if (currentList && page < totalPages) {
      currentList.addEventListener("scroll", onScrollHandler);
    }

    return () => {
      if (currentList) {
        currentList.removeEventListener("scroll", onScrollHandler);
      }
    };
  }, [page, totalPages]);

  const fetchConnects = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await getAllConnect(
        page,
        TAKE,
        "addressee",
        "pending_request",
      );
      setListConnects(response?.data?.docs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (notifications.length > 0) {
      const hasNewConnectionRequest = notifications.some(
        (notiSocket) => notiSocket.type === "connection_request",
      );
      if (hasNewConnectionRequest) {
        fetchConnects(1);
      }
    }
  }, [notifications]);

  return (
    <div
      ref={listConnectRef}
      className="card border-0 rounder-3 h_100 pb-5 font-system"
      style={{ minHeight: "100vh" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div className="card-body d-flex align-items-center p-4">
          <h4 className="fw-700 mb-0 font-sm text-grey-900 pb-4">
            {t("friend_request")}
          </h4>
        </div>
        <div className={`px-3 ${styles["list-connect"]}`}>
          {listConnects?.length > 0 &&
            !isLoading &&
            listConnects.map((value, index) => (
              <div
                key={index}
                className={`${styles["layout-page-list-connect"]}`}
              >
                <div
                  className={`${styles["layout-card-connect"]} card d-block border-0 shadow-md bg-light rounded-3 overflow-hidden my-1 mx-1`}
                >
                  <div className="card-body d-block w-100 ps-4 pe-4 pb-4 text-center">
                    <Link href={`/profile/${value?.requester?.nickName}`}>
                      <figure className="avatar overflow-hidden ms-auto me-auto mb-0 position-relative w75 z-index-1">
                        <Image
                          src={
                            value?.requester?.photo?.path ||
                            `/assets/images/user.png`
                          }
                          alt="avatar"
                          width={75}
                          height={75}
                          className="float-right p-1 bg-white rounded-circle object-fit-cover"
                          style={{ objectFit: "cover" }}
                        />
                      </figure>
                      <div className="clearfix"></div>
                      <div style={{ minHeight: "70px" }}>
                        <h4 className="fw-700 font-xsss mt-2 mb-1">
                          {displayName(
                            value?.requester?.firstName,
                            value?.requester?.lastName,
                          )}
                          {/* {value?.requester?.firstName}{" "}
                          {value?.requester?.lastName} */}
                          {value?.requester?.role === "broker" && (
                            <span className="px-1">
                              <FontAwesomeIcon
                                icon={faCircleCheck}
                                size="sm"
                                style={{ color: "#56e137" }}
                              />
                            </span>
                          )}
                        </h4>
                        <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
                          @{value?.requester?.nickName}
                        </span>
                      </div>
                    </Link>
                    <div className="d-flex align-items-center justify-content-center pb-0">
                      <div
                        onClick={() => {
                          fetchConnectResponse(value?.id, "accept");
                        }}
                        className="cursor-pointer p-2 lh-20 w90 bg-primary me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl"
                      >
                        {t("confirm")}
                      </div>
                      <div
                        onClick={() => {
                          fetchConnectResponse(value?.id, "reject");
                        }}
                        className="cursor-pointer p-2 lh-20 w90 bg-grey text-grey-800 text-center font-xssss fw-600 ls-1 rounded-xl"
                      >
                        {t("delete")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {listConnects && listConnects.length === 0 && (
          <div className="text-center">{t("no_friend_request")}</div>
        )}
        {isLoading && <CircleLoader />}
      </div>
    </div>
  );
};

export default ListRequest;
export async function getServerSideProps(context: NextPageContext) {
  const listConnects = await getAllConnect(
    1,
    TAKE,
    "addressee",
    "pending_request",
  );
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
      listAllConnects: listConnects?.data?.docs || null,
      totalPage: listConnects?.data?.meta?.totalPage,
      page: listConnects?.data?.meta.page,
    },
  };
}
