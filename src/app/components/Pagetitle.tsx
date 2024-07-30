import React from "react";
import styles from "@/styles/modules/pageTitle.module.scss";

export default async function Pagetitle(props: any) {
  // const t = useTranslations('BrokerList');
  //
  return (
    <div
      id={styles["header-title"]}
      className="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3"
    >
      <h2 className="fw-700 mb-0 mt-0 font-md fs-1 text-grey-900 d-flex align-items-center">
        <div className={`page-title ${styles["page-title"]}`}>
          {props.title}
        </div>
        <form action="#" className="pt-0 pb-0 ms-auto">
          <div className="search-form-2 ms-2">
            <i className="ti-search font-xss"></i>
            <input
              type="text"
              className={`${styles["page-title__search"]} form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0`}
              placeholder="Search here."
            />
          </div>
        </form>
        <a
          href="/"
          className="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"
        >
          <i className="feather-filter font-xss text-grey-500"></i>
        </a>
      </h2>
      <div className={`page-intro ${styles["page-intro"]}`}>{props.intro}</div>
    </div>
  );
}
