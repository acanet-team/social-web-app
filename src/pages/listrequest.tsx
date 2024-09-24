import { friendList } from "@/components/Friends";
import type { NextPageContext } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/modules/listConnect.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const ListRequest = () => {
  const t = useTranslations("Connect_investor");
  return (
    <div className="card border-0 rounder-3 h_100 pb-5">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div className="card-body d-flex align-items-center p-4">
          <h4 className="fw-700 mb-0 font-xs text-grey-900">
            {t("friend_request")}
          </h4>
        </div>
        <div className={`ps-2 pe-2 ${styles["list-connect"]}`}>
          {friendList.map((value, index) => (
            <div
              key={index}
              className={`${styles["layout-page-list-connect"]}`}
            >
              <div
                className={`${styles["layout-card-connect"]} card d-block border-0 shadow-md bg-light rounded-3 overflow-hidden my-1 mx-1`}
              >
                <div className="card-body d-block w-100 ps-4 pe-4 pb-4 text-center">
                  <Link href={""}>
                    <figure className="avatar overflow-hidden ms-auto me-auto mb-0 position-relative w75 z-index-1">
                      <Image
                        src={`/assets/images/${value.imageUrl}`}
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
                        {value.name}
                        <span className="px-1">
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            size="sm"
                            style={{ color: "#56e137" }}
                          />
                        </span>
                      </h4>
                    </div>
                  </Link>
                  <div className="d-flex align-items-center justify-content-center pb-0">
                    <div className="cursor-pointer p-2 lh-20 w90 bg-primary me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl">
                      {t("confirm")}
                    </div>
                    <div className="cursor-pointer p-2 lh-20 w90 bg-grey text-grey-800 text-center font-xssss fw-600 ls-1 rounded-xl">
                      {t("delete")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListRequest;
export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
    },
  };
}
