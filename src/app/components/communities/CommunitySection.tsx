import { combineUniqueById } from "@/utils/combine-arrs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DotWaveLoader from "../DotWaveLoader";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import styles from "@/styles/modules/communities.module.scss";
import CommunityForm from "@/app/components/communities/CommunityForm";
import type { ICommunity } from "@/api/community/model";
import { getCommunities } from "@/api/community";
import { useSession } from "next-auth/react";
import CommunityCard from "./CommunityCard";
import { useTranslations } from "next-intl";

export default function CommunitySection(props: {
  isBroker: boolean;
  communities: ICommunity[];
  communityType: string;
  curPage: number;
  allPage: number;
  take: number;
}) {
  const tForm = useTranslations("Form");
  const [communityArr, setCommunityArr] = useState<ICommunity[]>(
    props.communities,
  );
  const [take, setTake] = useState<number>(props.take);
  const [page, setPage] = useState<number>(props.curPage);
  const [totalPage, setTotalPage] = useState<number>(props.allPage);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [filterValue, setFilterValue] = React.useState<string>("");
  // const [filterValue, setFilterValue] = React.useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [show, setShow] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<string>("");
  const [brokerId, setBrokerId] = useState<number | "">("");
  const searchRef = useRef<HTMLInputElement>(null);
  const filters = ["None", "Free", "Paid"];
  const [hasFetchedInitialData, setHasFetchedInitialData] =
    useState<boolean>(false);
  const [readyToFetch, setReadyToFetch] = useState<boolean>(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session && session.user?.isBroker) {
      setBrokerId(session.user.id);
    }
  }, [session]);

  const fetchCommunities = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await getCommunities({
        page,
        take,
        type: props.communityType === "popular" ? "not_joined" : "joined",
        brokerId: props.communityType === "owned" ? brokerId : "",
        search: searchValue,
        feeType: filterValue === "None" ? "" : filterValue.toLowerCase(),
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

  // Infinite scroll
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

  // Reset states and fetch data on tab (communityType) change
  useEffect(() => {
    if (hasFetchedInitialData) {
      setFilterValue("");
      setSearchValue("");
      setPage(1);
      setTotalPage(2);
      setCommunityArr([]);
      setReadyToFetch(true);
    }
  }, [props.communityType]);

  useEffect(() => {
    if (readyToFetch) {
      fetchCommunities(1);
      setReadyToFetch(false);
    }
  }, [readyToFetch]);

  useEffect(() => {
    if (searchValue || filterValue) {
      setPage(1);
      setCommunityArr([]);
      fetchCommunities(1);
    }
  }, [searchValue, filterValue]);

  useEffect(() => {
    if (page > 1) {
      fetchCommunities(page);
    }
  }, [page]);

  // Avoid fetching data on initial render
  useEffect(() => {
    if (!hasFetchedInitialData) {
      setHasFetchedInitialData(true);
    }
  }, []);

  const onFilterHandler = (e: SelectChangeEvent) => {
    setFilterValue(e.target.value);
  };
  // const onFilterHandler = (e: SelectChangeEvent) => {
  //   setFilterValue((prev: string[]) => {
  //     const filterValue = e.target.value;
  //     if (prev.includes(filterValue)) {
  //       // If the value is already selected, remove it
  //       // return prev.filter(value => value !== filterValue);
  //       return [];
  //     } else {
  //       // If the value is not selected, add it
  //       return [filterValue];
  //     }
  //   });
  // };

  const onSearchHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchRef.current) {
        setSearchValue(searchRef.current.value);
      }
    }
  };

  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  const handleShow = useCallback(() => {
    setShow(true);
  }, []);

  const onCreateGroupHandler = () => {
    handleShow();
    setIsEditing("");
  };

  const onEditGroupHandler = (groupId: string) => {
    handleShow();
    setIsEditing(groupId);
  };

  return (
    <>
      {/* Search */}
      <div className={`${styles["search-section"]} my-3 d-flex gap-2`}>
        <Box
          component="form"
          sx={{ width: "65%" }}
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
                },
              },
              ".MuiFormLabel-root": { fontSize: "15px" },
            }}
          />
        </Box>
        {/* Filter */}
        <FormControl
          sx={
            props.communityType === "owned"
              ? { width: "15%" }
              : { width: "35%" }
          }
          className={styles["filter-box"]}
        >
          <InputLabel id="filter">
            <i className="bi bi-filter me-1"></i>Filter
          </InputLabel>
          <Select
            labelId="filter"
            id="filter"
            value={filterValue}
            // value={filterValue[0] || ""}
            onChange={onFilterHandler}
            input={<OutlinedInput label="Filter&nbsp" />}
            // renderValue={(selected) => selected}
            renderValue={(selected) => {
              if (!selected) {
                return "";
              }
              return selected;
            }}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ddd",
              },
            }}
          >
            {filters.map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={filterValue.indexOf(name) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {props.isBroker && props.communityType === "owned" && (
          <button
            className={`${styles["new-community__btn"]} btn btn-primary text-white`}
            onClick={onCreateGroupHandler}
          >
            + {tForm("add_new")}
          </button>
        )}
      </div>
      {/* Communities */}
      <div className="middle-sidebar-left pe-0">
        <div className="row">
          <div className="col-xl-12">
            <div className="row ps-2 pe-1">
              {!isLoading && communityArr.length === 0 && (
                <div className="text-center mt-5">No community found.</div>
              )}
              {communityArr.length > 0 &&
                communityArr.map((group, index) => (
                  <div key={index} className="col-md-6 col-sm-6 pe-2 ps-2 mb-3">
                    <CommunityCard
                      groupId={group.id}
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
      </div>
    </>
  );
}
