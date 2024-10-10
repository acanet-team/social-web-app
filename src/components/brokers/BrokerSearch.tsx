import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/modules/brokerProfile.module.scss";
import { useTranslations } from "next-intl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import { createGetAllTopicsRequest } from "@/api/onboard";
import { combineUniqueById } from "@/utils/combine-arrs";

interface Option {
  id: string;
  topicName: string;
}

export default function BrokerSearch(props: {
  searchTerm: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setInterestTopicIds: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { searchTerm, setSearch, setInterestTopicIds } = props;
  const tBroker = useTranslations("BrokerList");
  const tSearch = useTranslations("Search");
  const searchRef = useRef<HTMLInputElement>(null);
  const [interestTopics, setInterestTopics] = useState<Option[]>([]);
  const [filterValues, setFilterValues] = useState<string[]>([]);
  const [curPage, setCurPage] = useState(1);
  const [firstRender, setFistRender] = useState<boolean>(false);
  const TAKE = 20;

  const fetchTopics = async (page: number) => {
    try {
      const res: any = await createGetAllTopicsRequest(page, TAKE);
      setInterestTopics((prevState: Option[]) => {
        const newOptions: Option[] = combineUniqueById(
          prevState,
          res.data.docs,
        ) as Option[];
        return newOptions;
      });
      return null;
    } catch (err) {
      return console.log(err);
    }
  };

  const onSearchHandler = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputElement = searchRef.current;
      if (inputElement) {
        console.log("sssss", inputElement.value);
        setSearch(inputElement.value);
      }
    }
  };

  useEffect(() => {
    if (curPage > 1) {
      fetchTopics(curPage);
    }
  }, [curPage]);

  useEffect(() => {
    if (firstRender) {
      fetchTopics(1);
    }
  }, [firstRender]);

  useEffect(() => {
    if (!firstRender) {
      setFistRender(true);
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const bottom =
      target.scrollHeight === target.scrollTop + target.clientHeight;
    if (bottom) {
      setCurPage((prevState) => prevState + 1);
    }
  };

  const onFilterHandler = (e: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = e;

    // Convert the selected value to an array and handle multiple selections
    const selectedIds: string[] =
      typeof value === "string" ? value.split(",") : value;
    console.log("selectedIds", selectedIds);

    // Update the state with selected topic IDs
    setFilterValues((prevValues: string[]) => {
      return selectedIds.filter((id) => {
        return prevValues.includes(id)
          ? prevValues.filter((prev) => prev !== id)
          : [...prevValues, id];
      });
    });
    setInterestTopicIds((prevValues: string[]) => {
      return selectedIds.filter((id) => {
        return prevValues.includes(id)
          ? prevValues.filter((prev) => prev !== id)
          : [...prevValues, id];
      });
    });
  };

  return (
    <div
      id={styles["header-title"]}
      className="card shadow-xss w-100 border-0 mb-3"
    >
      <div className="fw-700 mb-2 mt-0 font-md fs-1 text-grey-900 d-flex align-items-center">
        <span className={`page-title fs-1 fw-700 ${styles["page-title"]}`}>
          {tBroker("broker_title")}
        </span>
      </div>
      <div className="d-flex">
        <form
          action="#"
          className={` ${styles["search-bar"]} t-0 pb-0 ms-auto`}
        >
          <div className="search-form-2 ms-2">
            <i className="ti-search font-xss"></i>
            <input
              type="text"
              className={`${styles["page-title__search"]} form-control mb-0 bg-greylight theme-dark-bg border-0`}
              placeholder={tSearch("search_placeholer")}
              ref={searchRef}
              onKeyDown={(e) => onSearchHandler(e)}
            />
          </div>
        </form>
        <div
          className={`btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3`}
        >
          {/* <i className="feather-filter font-xss text-grey-500"></i> */}
          <FormControl sx={{ padding: "0" }}>
            <InputLabel
              id="filter"
              sx={{
                top: "-8px",
              }}
              size="small"
              shrink={false}
            >
              <i
                className={`${filterValues?.length > 0 ? styles["has-filter"] : ""} feather-filter text-grey-500 cursor-pointer`}
                style={{ height: "48px" }}
              ></i>
            </InputLabel>
            <Select
              labelId="filter"
              id="filter"
              multiple
              value={filterValues}
              onChange={onFilterHandler}
              input={<OutlinedInput label="Filter&nbsp" />}
              renderValue={() => null}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ddd",
                },
                fieldset: {
                  display: "none",
                },
              }}
              IconComponent={() => null} // remove  label icon when checked
              MenuProps={{
                PaperProps: {
                  onScroll: handleScroll,
                  style: { width: 350 },
                },
                style: { maxHeight: 300 },
                id: "id-menu",
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
              }}
            >
              {interestTopics.map((topic) => (
                <MenuItem key={topic.id} value={topic.id}>
                  <Checkbox checked={filterValues.includes(topic.id)} />
                  <ListItemText primary={topic.topicName} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  );
}
