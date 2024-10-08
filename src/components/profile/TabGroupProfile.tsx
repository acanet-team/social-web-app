import React, { useCallback, useEffect, useState } from "react";
import CommunityCard from "../communities/CommunityCard";
import type { ICommunity } from "@/api/community/model";
import DotWaveLoader from "../DotWaveLoader";
import { combineUniqueById } from "@/utils/combine-arrs";
import CommunityForm from "../communities/CommunityForm";
import { getGroups } from "@/api/profile";
import { useTranslations } from "next-intl";

const TabGroupProfile = (props: {
  isBroker: boolean;
  // communities: ICommunity[];
  communityType: string;
  // curPage: number;
  // allPage: number;
  take: number;
  id: number;
}) => {
  const t = useTranslations("MyProfile");
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [communityArr, setCommunityArr] = useState<ICommunity[]>([]);
  const [take, setTake] = useState<number>(props.take);
  const [isBroker, setIsBroker] = useState<boolean>(props.isBroker);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  // const [type, setType] = useState<string>(props.communityType);
  const [idUser, setIdUser] = useState<number>(props.id);
  const [show, setShow] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<string>("");

  const fetchCommunities = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await getGroups({
        page,
        take,
        type: isBroker ? "" : "joined",
        brokerId: isBroker ? idUser : "",
        search: "",
        feeType: "",
        investorId: isBroker ? "" : idUser,
      });
      // console.log("Communities fetched:", response);
      setCommunityArr((prev) => {
        const newCommunities = combineUniqueById(
          prev,
          response.data.docs as ICommunity[],
        );
        return newCommunities as ICommunity[];
      });
      setTotalPage(response.data?.meta?.totalPage);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  const onScrollHandler = () => {
    if (document.documentElement) {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (
        scrollTop + clientHeight >= scrollHeight &&
        !isLoading &&
        page < totalPage
      ) {
        setPage((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    if (document.documentElement && page < totalPage) {
      window.addEventListener("scroll", onScrollHandler);
    }
    return () => {
      if (document.documentElement) {
        window.removeEventListener("scroll", onScrollHandler);
      }
    };
  }, [page, totalPage, isLoading]);

  useEffect(() => {
    if (page > 1) {
      fetchCommunities(page);
    }
  }, [page]);

  useEffect(() => {
    setCommunityArr([]);
    fetchCommunities(1);
  }, [props.id]);

  const handleShow = useCallback(() => {
    setShow(true);
  }, []);
  const onEditGroupHandler = (groupId: string) => {
    handleShow();
    setIsEditing(groupId);
  };

  return (
    <div style={{ marginTop: "40px", paddingBottom: "100px" }}>
      {!isLoading && communityArr?.length === 0 && (
        <div className="text-center mt-5">{t("titleGroupProfile")}</div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {communityArr?.length > 0 &&
          communityArr.map((group, index) => (
            <div key={index} className="col-md-6 col-sm-6 pe-2 ps-2 mb-3">
              <CommunityCard
                ownerId={group.owner?.userId}
                groupId={props.isBroker ? group.id : ""}
                name={group.name}
                coverImg={group.coverImage?.path}
                avatar={group.avatar?.path}
                firstName={group.owner?.firstName}
                lastName={group.owner?.lastName}
                nickName={group.owner?.nickName}
                membersCount={group.membersCount}
                communityStatus={group.communityStatus}
                fee={group.fee}
                description={group.description}
                isBroker={props.isBroker}
                communityType={props.communityType}
                onEditGroupHandler={onEditGroupHandler}
              />
            </div>
          ))}
      </div>
      {isLoading && <DotWaveLoader />}
      {show && (
        <CommunityForm
          isEditing={isEditing}
          handleClose={handleClose}
          handleShow={handleShow}
          show={show}
          setCommunities={setCommunityArr}
        />
      )}
    </div>
  );
};

export default TabGroupProfile;
