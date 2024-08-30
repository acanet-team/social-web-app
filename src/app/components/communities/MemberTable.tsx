import React, { useEffect, useRef, useState } from "react";
import type { ICommunityMember } from "@/api/community/model";
import styles from "@/styles/modules/memberTable.module.scss";
import { useLoading } from "@/context/Loading/context";
import Pagination from "../Pagination";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { getCommunityMembers } from "@/api/community";

const memberList = [
  {
    id: "b3e1ebh",
    user: {
      userId: 1,
      firstName: "huy",
      lastName: "tran",
      nickName: "huytx32",
      gmail: "tranxuanhuy3201@gmail.com",
      phone: "0974825187",
    },
    communityId: "communityId string",
    communityRole: "member",
    communityStatus: "pending_request",
    createdAt: "timestamp in milisecond",
  },
  {
    id: "b3e1ebh",
    user: {
      userId: 1,
      firstName: "huy",
      lastName: "tran",
      nickName: "huytx32",
      gmail: "tranxuanhuy3201@gmail.com",
      phone: "0974825187",
    },
    communityId: "communityId string",
    communityRole: "member",
    communityStatus: "pending_request",
    createdAt: "timestamp in milisecond",
  },
  {
    id: "b3e1ebh",
    user: {
      userId: 1,
      firstName: "huy",
      lastName: "tran",
      nickName: "huytx32",
      gmail: "tranxuanhuy3201@gmail.com",
      phone: "0974825187",
    },
    communityId: "communityId string",
    communityRole: "member",
    communityStatus: "pending_request",
    createdAt: "timestamp in milisecond",
  },
  {
    id: "b3e1ebh",
    user: {
      userId: 1,
      firstName: "huy",
      lastName: "tran",
      nickName: "huytx32",
      gmail: "tranxuanhuy3201@gmail.com",
      phone: "0974825187",
    },
    communityId: "communityId string",
    communityRole: "member",
    communityStatus: "pending_request",
    createdAt: "timestamp in milisecond",
  },
  {
    id: "b3e1ebh",
    user: {
      userId: 1,
      firstName: "huy",
      lastName: "tran",
      nickName: "huytx32",
      gmail: "tranxuanhuy3201@gmail.com",
      phone: "0974825187",
    },
    communityId: "communityId string",
    communityRole: "member",
    communityStatus: "pending_request",
    createdAt: "timestamp in milisecond",
  },
];

const TAKE = 5;
export default function MemberTable(props: { groupId: string; tab: string }) {
  const { tab, groupId } = props;
  const [allUserNum, setAllUserNum] = useState<number>(285);
  const [pendingRequests, setPendingRequests] = useState<number>(50);
  const [members, setMembers] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const { showLoading, hideLoading } = useLoading();
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    async function getMembers() {
      showLoading();
      try {
        const res = await getCommunityMembers({
          page: page,
          take: TAKE,
          communityStatus: "joined",
          search: searchValue,
          communityId: groupId,
        });
        setMembers(res.data?.docs || []);
        setPendingRequests(res.data.totalPendingRequest);
        setPage(res.data?.meta?.page);
        setTotalPage(res.data.meta.totalPage);
      } catch (err) {
        console.log(err);
      } finally {
        hideLoading();
      }
    }
    getMembers();
  }, [page, tab]);

  const onSearchHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchRef.current) {
        // console.log(searchRef.current.value);
        setSearchValue(searchRef.current.value);
      }
    }
  };
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
            {tab === "members" ? allUserNum : pendingRequests}
          </span>
        </div>

        <div className="mb-3 gap-2 d-flex justify-content-sm-end mt-3 mt-sm-0">
          <Box
            component="form"
            sx={{ width: "65%" }}
            noValidate
            autoComplete="off"
            className={styles["search-box"]}
          >
            <TextField
              id="outlined-basic"
              label="Search"
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
              }}
            />
          </Box>
          <button className="main-btn bg-current font-xsss text-center text-white fw-600 px-2 w175 rounded-3 border-0 d-inline-block">
            + Invite new user
          </button>
        </div>
      </div>

      <div
        className={`${styles["community-table"]} table-responsive rounded-3 shadow-md font-xsss`}
      >
        {memberList?.length === 0 && (
          <p className="text-center fs-6">No members found.</p>
        )}
        {memberList?.length > 0 && (
          <table className="table align-middle pb-4 mt-2">
            {/* <caption
                className="text-end w-100 text-grey-600 font-xsss position-relative"
                style={{ bottom: "40px", right: "15px" }}
              >
                {`Showing ${page * TAKE} of ${totalPage * TAKE}`}
              </caption> */}
            <thead>
              <tr className="d-flex">
                <th className="col-2">Name</th>
                <th className="col-2">Joined</th>
                <th className="col-3">Phone</th>
                <th className={`${styles["email-col"]} col-4`}>Email</th>
                <th className={`${styles["action-col"]} col-1 px-0`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((m) => {
                return (
                  <tr key={m.id} className="d-flex">
                    <td className="col-2">
                      {m.user.firstName + " " + m.user.lastName}
                    </td>
                    <td className="col-2">since</td>
                    <td className="col-3">{m.user.phone}</td>
                    <td className={`${styles["email-col"]} col-4`}>
                      {m.user.gmail}
                    </td>
                    <td className={`${styles["action-col"]} col-1 px-0`}>
                      {tab === "members" ? (
                        <i className="bi bi-trash3-fill text-grey-700 h3 m-0 ms-3 cursor-pointer"></i>
                      ) : (
                        <div className="w-100">
                          <i className="bi bi-check-circle-fill text-success h3 m-0 cursor-pointer"></i>
                          <i className="bi bi-x-circle-fill h3 text-danger m-0 ms-3 cursor-pointer"></i>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
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
                {`Showing ${page * TAKE} of ${totalPage * TAKE}`}
              </caption>
            </div>
          </table>
        )}
      </div>
    </div>
  );
}
