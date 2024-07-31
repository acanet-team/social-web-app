// "use client";
// import Link from "next/link";
// import React, { useEffect, useRef, useState } from "react";
// import styles from "@/styles/modules/interest.module.scss";
// import { createGetAllTopicsRequest } from "@/api/user";
// import { useRouter } from "next/navigation";
// import { useTranslations } from "next-intl";
// import { subscribeTopicsRequest } from "@/api/user";

// export default function Interest() {
//   const list = useRef<HTMLDivElement>(null);
//   const t = useTranslations("Interest");
//   const router = useRouter();
//   const [error, setError] = useState<string>("");
//   const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
//   const [options, setOptions] = useState<Option[]>([]);
//   const [curPage, setCurPage] = useState<number>(1);
//   const [totalPage, setTotalPage] = useState<number>(1);
//   const [isLoading, setIsLoading] = useState<Boolean>(false);
//   const TOPICS_PER_PAGE = 20;
//   interface Option {
//     id: string;
//     topicName: string;
//   }

//   const manipulateClasses = (e: any, addedClass: any, removedClass: any) => {
//     e.target.classList.remove(removedClass);
//     e.target.classList.add(addedClass);
//   };

//   const toggleSelection = (e: any, optionId: string) => {
//     if (selectedOptions.includes(optionId)) {
//       setSelectedOptions((prevState) =>
//         prevState.filter((id) => id !== optionId),
//       );
//       manipulateClasses(e, styles["btn-unselected"], styles["btn-selected"]);
//     } else {
//       setSelectedOptions((prevState) => [...prevState, optionId]);
//       manipulateClasses(e, styles["btn-selected"], styles["btn-unselected"]);
//     }
//   };

//   const onSelectInterestHandler = () => {
//     if (selectedOptions.length === 0) {
//       return setError("Please choose at least 1 interest topic.");
//     }
//     try {
//       subscribeTopicsRequest(selectedOptions);
//       router.push("/broker-list");
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   async function fetchTopics() {
//     try {
//       setIsLoading(true);
//       const response: any = await createGetAllTopicsRequest(
//         curPage,
//         TOPICS_PER_PAGE,
//       );
//       setOptions((prevState) => [...prevState, ...response.data.docs]);
//       setTotalPage(response.data.meta.totalPage);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   const onScrollHandler = () => {
//     if (list.current) {
//       const { scrollTop, scrollHeight, clientHeight } = list.current;
//       if (scrollTop + clientHeight === scrollHeight && !isLoading) {
//         setCurPage((prevState) => prevState + 1);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchTopics();
//   }, [TOPICS_PER_PAGE, curPage]);

//   useEffect(() => {
//     const currentList = list.current;
//     if (currentList && curPage < totalPage) {
//       currentList.addEventListener("scroll", onScrollHandler);
//     }
//     return () => {
//       if (currentList) {
//         currentList.removeEventListener("scroll", onScrollHandler);
//       }
//     };
//   }, [curPage, totalPage]);

//   return (
//     <>
//       <div
//         id={styles.interest}
//         className="main-content bg-lightblue theme-dark-bg right-chat-active"
//       >
//         <div className="middle-sidebar-bottom">
//           <div className="middle-sidebar-left">
//             <div className="middle-wrap">
//               <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
//                 <div className="card-body p-4 w-100 bg-current border-0 rounded-3">
//                   <Link href="/defaultsettings" className="d-inline-block mt-2">
//                     <i className="ti-arrow-left font-sm text-white" />
//                   </Link>
//                   <h4 className="fs-1 text-white fw-800">
//                     {t("interest_title")}
//                   </h4>
//                   <p>{t("interest_description")}</p>
//                 </div>
//                 <div
//                   ref={list}
//                   id={styles["interest-container"]}
//                   className="interest-options card-body p-lg-5 p-4 w-100 border-0 d-flex flex-wrap justify-content-center gap-3 mb-5"
//                 >
//                   {options.map((option) => (
//                     <button
//                       key={option.id}
//                       onClick={(e) => toggleSelection(e, option.id)}
//                       className="btn"
//                     >
//                       {option.topicName}
//                     </button>
//                   ))}
//                 </div>

//                 {error && (
//                   <div className="mx-auto dark-error-text">{error}</div>
//                 )}
//                 {isLoading && (
//                   <div className="d-flex justify-content-center">
//                     <div className={styles["dots-3"]}></div>
//                     <div className={styles["dots-3"]}></div>
//                   </div>
//                 )}
//                 <button
//                   type="submit"
//                   className="main-btn bg-current text-center text-white fw-600 px-2 py-3 w175 rounded-4 border-0 d-inline-block my-5 mx-auto"
//                   onClick={onSelectInterestHandler}
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/modules/interest.module.scss";
import { createGetAllTopicsRequest } from "@/api/user";
import { useRouter } from "next/navigation";
import {} from "next-intl";
import { subscribeTopicsRequest } from "@/api/user";
import { getTranslations } from "next-intl/server";
import Interests from "@/app/components/interest/Interests";
import page from "../account/page";

async function fetchTopics() {
  try {
    const response: any = await createGetAllTopicsRequest(1, 20);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export default async function InterestList() {
  const t = await getTranslations("Interest");
  const response = await fetchTopics();
  console.log(response);
  const options = response.docs ?? response.data;
  const page = response.meta.page;
  const totalPage = response.meta.totalPage;
  const TAKE = 20;

  return (
    <>
      <div
        id={styles.interest}
        className="main-content bg-lightblue theme-dark-bg right-chat-active"
      >
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left">
            <div className="middle-wrap">
              <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                <div className="card-body p-4 w-100 bg-current border-0 rounded-3">
                  <Link href="/defaultsettings" className="d-inline-block mt-2">
                    <i className="ti-arrow-left font-sm text-white" />
                  </Link>
                  <h4 className="fs-1 text-white fw-800">
                    {t("interest_title")}
                  </h4>
                  <p>{t("interest_description")}</p>
                </div>

                <Interests
                  options={options}
                  page={page}
                  totalPage={totalPage}
                  take={TAKE}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
