import { combineUniqueById } from "@/utils/combine-arrs";
import Image from "next/image";
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

interface Icommunity {
  imageUrl: string;
  name: string;
  nickName: string;
  memberCount: number;
  fee: string;
  communityName: string;
  shortDesc: string;
  bgImage: string;
}

export default function CommunitySection(props: {
  isBroker: boolean;
  communities: Icommunity[];
  communityType: string;
  curPage: number;
  allPage: number;
  take: number;
}) {
  const [communityArr, setCommunityArr] = useState<any[]>(props.communities);
  const [take, setTake] = useState<number>(props.take);
  const [page, setPage] = useState<number>(props.curPage);
  const [totalPage, setTotalPage] = useState<number>(props.allPage);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [filterValue, setFilterValue] = React.useState<string>("None");
  const [searchValue, setSearchValue] = useState("");
  const [isOpenModal, toggleModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const filters = ["None", "Free", "Paid"];

  const fetchCommunities = async (page = 1) => {
    setIsLoading(true);
    // try {
    //   const response: any = await getCommunities(page, take, props.communityType);
    //   console.log("posts", response);
    //   // setCommunityArr((prev) => [...prev, ...response.data.docs]);
    //   setCommunityArr((prev) => {
    //     const newPosts = combineUniqueById(prev, response.data.docs);
    //     return newPosts;
    //   });
    //   setTotalPage(response.data.meta.totalPage);
    // } catch (err) {
    //   console.log(err);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const onScrollHandler = () => {
    if (document.documentElement) {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight) {
        setPage((page) => page + 1);
      }
    }
  };

  // useEffect(() => {
  //   fetchCommunities(page);
  // }, [page, props.communityType, searchValue, filterValue]);

  // useEffect(() => {
  //   setPage(1);
  //   setTotalPage(2);
  //   setCommunityArr([]);
  // }, [props.communityType]);

  // useEffect(() => {
  //   if (document.documentElement && page < totalPage) {
  //     window.addEventListener("scroll", onScrollHandler);
  //   }
  //   return () => {
  //     if (document.documentElement) {
  //       window.removeEventListener("scroll", onScrollHandler);
  //     }
  //   };
  // }, [page, totalPage, props.communityType]);

  const onJoinCommunityHandler = () => {
    // Calling api
  };

  const onSearchHandler = (e: SelectChangeEvent) => {
    setFilterValue(e.target.value);
  };

  const onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchRef.current) {
        console.log(searchRef.current.value);
        setSearchValue(searchRef.current.value);
        // Calling api to update
      }
    }
  };

  const handleCancel = useCallback(() => {
    toggleModal(false);
  }, []);

  const handleSubmit = useCallback(() => {
    toggleModal(false);
  }, []);

  return (
    <>
      {/* Search */}
      <div className={`${styles["search-section"]} mb-2 mt-3 d-flex gap-2`}>
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
              onEnterPress(e)
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.MuiInputBase-root fieldset": {
                  borderColor: "#ddd",
                },
              },
            }}
          />
        </Box>
        {/* Filter */}
        <FormControl
          sx={props.isBroker ? { width: "15%" } : { width: "35%" }}
          className={styles["filter-box"]}
        >
          <InputLabel id="demo-multiple-checkbox-label">
            <i className="bi bi-filter me-1"></i>Filter
          </InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            value={filterValue}
            onChange={onSearchHandler}
            input={<OutlinedInput label="Filter&nbsp" />}
            renderValue={(selected) => selected}
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
        {props.isBroker && (
          <button
            className={`${styles["new-community__btn"]} btn btn-primary text-white`}
            onClick={() => toggleModal(true)}
          >
            + Add new
          </button>
        )}
      </div>
      {/* Communities */}
      <div className="middle-sidebar-left pe-0">
        <div className="row">
          <div className="col-xl-12">
            <div className="row ps-2 pe-1">
              {communityArr.map((group, index) => (
                <div key={index} className="col-md-6 col-sm-6 pe-2 ps-2">
                  <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-0 mt-2">
                    <div
                      className="card-body position-relative h100 bg-image-cover bg-image-center"
                      style={{
                        backgroundImage: `url("assets/images/${group.bgImage}")`,
                      }}
                    ></div>
                    <div className="card-body d-block w-100 pl-10 pe-4 py-0 text-left position-relative">
                      <figure
                        className="avatar position-absolute w75 z-index-1 left-15"
                        style={{ marginTop: `-40px` }}
                      >
                        <Image
                          src={`/assets/images/${group.imageUrl}`}
                          alt="avater"
                          width={75}
                          height={75}
                          className="float-right p-1 bg-white rounded-circle"
                          style={{ objectFit: "cover" }}
                        />
                      </figure>
                      <div className="clearfix"></div>
                      <div>
                        <h4 className="fw-700 font-xss mt-2 mb-1">
                          {group.name}
                        </h4>
                        <div className="fw-500 font-xsss text-grey-500 mt-0 mb-1 lh-3">
                          @{group.nickName}
                        </div>
                        <div className="fw-500 font-xsss fst-italic text-dark mt-0 mb-3 lh-3">
                          {group.memberCount.toLocaleString()}{" "}
                          {group.memberCount > 0 ? "members" : "member"}
                        </div>
                        <div className="position-absolute right-35 top-0 d-flex align-items-center d-flex flex-column">
                          {!props.isBroker && (
                            <button
                              className="btn btn-primary text-white px-3 py-1 mb-1"
                              onClick={onJoinCommunityHandler}
                            >
                              Join
                            </button>
                          )}
                          {group.fee === "Free" ? (
                            <div className="text-success fw-bolder">
                              {group.fee.toLocaleString()}
                            </div>
                          ) : (
                            <div className="d-flex align-items-center">
                              <Image
                                width={25}
                                height={25}
                                src={
                                  "/assets/images/logo/logo-only-transparent.png"
                                }
                                alt="logo"
                              />
                              <span className="ms-2 fw-bolder">
                                {group.fee.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="card-body ps-4 pb-5">
                      <h3 className="fw-bold fs-3">{group.communityName}</h3>
                      <p>{group.shortDesc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {isLoading && <DotWaveLoader />}
          {isOpenModal && (
            <CommunityForm
              title={isEditing ? "Edit Community" : "New Community"}
              onCancel={handleCancel}
              onOk={handleSubmit}
            />
          )}
        </div>
      </div>
    </>
  );
}
