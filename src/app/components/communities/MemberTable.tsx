import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "@/styles/modules/memberTable.module.scss";
import { useLoading } from "@/context/Loading/context";
import Pagination from "../Pagination";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  getCommunityMembers,
  removeCommunityMember,
  requestJoinCommunity,
} from "@/api/community";
import { useTranslations } from "next-intl";
import AlertModal from "../AlertModal";
import { throwToast } from "@/utils/throw-toast";
import { useSession } from "next-auth/react";
import Image from "next/image";

const TAKE = 5;
export default function MemberTable(props: {
  groupId: string;
  tab: string;
  pendingRequests: number;
  setPendingRequests: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { tab, groupId, pendingRequests, setPendingRequests } = props;
  const t = useTranslations("Community");
  const tModal = useTranslations("Modal");
  const tForm = useTranslations("Form");
  const { data: session } = useSession();
  const [members, setMembers] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [deletedUser, setDeletedUser] = useState<number | undefined>(undefined);
  const [rejectedRequest, setRejectedRequest] = useState<string>();
  const [curUser, setCurUser] = useState<number>();
  const { showLoading, hideLoading } = useLoading();

  // Calculate current row index
  const startRow = (page - 1) * TAKE + 1;
  const endRow = Math.min(page * TAKE, totalMembers);

  useEffect(() => {
    if (session) {
      setCurUser(session.user.id);
    }
  }, [curUser]);

  async function getMembers(page: number) {
    showLoading();
    try {
      const res = await getCommunityMembers({
        page: page,
        take: TAKE,
        communityStatus: tab === "members" ? "joined" : "pending_request",
        search: searchValue,
        communityId: groupId,
      });
      setMembers(res.data?.docs || []);
      console.log("members", res);
      setPendingRequests(res.data.totalPendingRequest);
      setPage(res.data?.meta?.page);
      setTotalPage(res.data.meta.totalPage);
      setTotalMembers(res.data.meta.total);
    } catch (err) {
      console.log(err);
    } finally {
      hideLoading();
    }
  }

  useEffect(() => {
    if (page > 1) {
      getMembers(page);
    }
  }, [page]);

  useEffect(() => {
    if (searchValue) {
      setPage(1);
      setMembers([]);
      getMembers(page);
    }
  }, [searchValue]);

  useEffect(() => {
    setPage(1);
    setSearchValue("");
    if (searchRef.current) {
      searchRef.current.value = "";
    }
    setMembers([]);
    getMembers(1);
  }, [tab]);

  const onSearchHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchRef.current) {
        setSearchValue(searchRef.current.value);
      }
    }
  };

  const handleCancel = useCallback(() => {
    setShowModal(false);
  }, []);

  const onDelete = useCallback((id: number) => {
    setDeletedUser(id);
    setShowModal(true);
  }, []);

  const onReject = useCallback((requestId: string) => {
    setRejectedRequest(requestId);
    setShowModal(true);
  }, []);

  const onProceedAction = useCallback(
    async (approveRequest: string) => {
      setShowModal(false);
      try {
        if (approveRequest) {
          await requestJoinCommunity({
            requestId: approveRequest,
            action: "accept",
          });
          throwToast(t("approve_member_notification"), "success");
          setPendingRequests((prev) => prev - 1);
          return setMembers((prev) =>
            prev.filter((user) => user.id !== approveRequest),
          );
        }

        if (deletedUser && !rejectedRequest) {
          await removeCommunityMember({
            userId: deletedUser,
            communityId: groupId,
          });
          setMembers((prev) =>
            prev.filter((user) => user.user.userId !== deletedUser),
          );
          setTotalMembers((prev) => prev - 1);
          throwToast(t("delete_member_notification"), "success");
          return setDeletedUser(undefined);
        }

        if (rejectedRequest && !deletedUser) {
          await requestJoinCommunity({
            requestId: rejectedRequest,
            action: "reject",
          });
          setMembers((prev) =>
            prev.filter((user) => user.id !== rejectedRequest),
          );
          setPendingRequests((prev) => prev - 1);
          return setRejectedRequest("");
        }
      } catch (err) {
        console.log(err);
      }
    },
    [rejectedRequest, deletedUser],
  );

  return (
    <div>
      <div
        className={`${styles["member-tab"]} mt-sm-4 w-100 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center`}
      >
        <div className="d-flex align-items-center">
          <h3
            className={`${styles["member-tab__title"]} m-0 me-3 text-grey-800 fw-bold d-inline`}
          >
            {tab === "members" ? "All Users" : "Pending Requests"}
          </h3>
          <span
            className={`${styles["member-tab__subtitle"]} fw-bold text-grey-600`}
          >
            {tab === "members" ? totalMembers : pendingRequests}
          </span>
        </div>

        <div className="mb-3 gap-2 d-flex justify-content-sm-end mt-3 mt-sm-0">
          <Box
            component="form"
            sx={{ width: "300px" }}
            noValidate
            autoComplete="off"
            className={styles["search-box"]}
          >
            <TextField
              id="outlined-basic"
              label={tForm("search")}
              variant="outlined"
              className="w-100"
              inputRef={searchRef}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                onSearchHandler(e)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.MuiInputBase-root fieldset": {
                    borderColor: "#ddd",
                    borderRadius: "5px",
                  },
                },
                ".MuiFormLabel-root": { fontSize: "15px" },
              }}
            />
          </Box>
          <button className="main-btn bg-current font-xsss text-center text-white fw-600 px-2 w175 rounded-3 border-0 d-inline-block">
            + {t("invite new user")}
          </button>
        </div>
      </div>

      <div
        className={`${styles["community-table"]} table-responsive rounded-3 shadow-md font-xsss`}
      >
        <table className="table align-middle pb-4 mt-2">
          <thead>
            <tr className="d-flex">
              <th className={`${styles["name-col"]} col-2`}>
                {t("table_name")}
              </th>
              <th className="col-2">{t("table_joined")}</th>
              <th className="col-3">{t("table_phone")}</th>
              <th className={`${styles["email-col"]} col-4`}>
                {t("table_email")}
              </th>
              <th className={`${styles["action-col"]} col-1 px-0`}>
                {t("table_action")}
              </th>
            </tr>
          </thead>
          {members?.length === 0 && (
            <p className="text-center fs-4 mt-4 text-grey-600">
              No members found.
            </p>
          )}
          {members?.length > 0 && (
            <tbody>
              {members.map((m, index) => {
                return (
                  <tr key={m.id} className="d-flex">
                    <td
                      className={`${styles["name-col"]} col-2 d-flex align-items-center`}
                    >
                      <Image
                        src={m.user?.photo?.path || `/assets/images/user.png`}
                        width={40}
                        height={40}
                        style={{ objectFit: "cover", borderRadius: "10px" }}
                        alt="avatar"
                      />
                      <span className="ms-2">
                        {m.user.firstName + " " + m.user.lastName}
                      </span>
                    </td>
                    <td className="col-2">
                      {new Date(m.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </td>
                    <td className="col-3">{m.user.phone}</td>
                    <td className={`${styles["email-col"]} col-4`}>
                      {m.user.gmail}
                    </td>
                    <td className={`${styles["action-col"]} col-1 px-0`}>
                      {curUser !== m.user.userId ? (
                        tab === "members" ? (
                          <i
                            className="bi bi-trash3-fill text-grey-700 h3 m-0 ms-3 cursor-pointer"
                            onClick={() => onDelete(m.user.userId)}
                          ></i>
                        ) : (
                          <div className="w-100">
                            <i
                              className="bi bi-check-circle-fill text-success h3 m-0 cursor-pointer"
                              onClick={() => onProceedAction(m.id)}
                            ></i>
                            <i
                              className="bi bi-x-circle-fill h3 text-danger m-0 ms-3 cursor-pointer"
                              onClick={() => onReject(m.id)}
                            ></i>
                          </div>
                        )
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          )}
          {members.length !== 0 && (
            <div
              className={`${styles["table-pagination"]} d-flex justify-content-between align-items-end`}
            >
              <Pagination
                pageUpdateFn={setPage}
                page={page}
                totalPage={totalPage}
                isTable={true}
              />
              <caption
                className={`${styles["mobile-page__bookmark"]} text-end text-grey-600 font-xsss`}
              >
                {`Showing ${(page - 1) * TAKE + endRow - startRow + 1} of ${totalMembers}`}
              </caption>
            </div>
          )}
        </table>
      </div>
      {showModal && (
        <AlertModal
          message={
            tab === "members"
              ? tModal("modal_member_delete")
              : tModal("modal_member_reject")
          }
          onCancel={handleCancel}
          onOk={() => onProceedAction("")}
        />
      )}
    </div>
  );
}
