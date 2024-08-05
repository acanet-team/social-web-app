import Link from "next/link";
import React from "react";
import styles from "@/styles/modules/interest.module.scss";
import { createGetAllTopicsRequest } from "@/api/user";
import {} from "next-intl";
import { getTranslations } from "next-intl/server";
import Interests from "@/app/components/interest/Interests";
import { cookies } from "next/headers";

async function fetchTopics() {
  try {
    const header = new Headers();
    const accessToken = cookies().get("accessToken")?.value;
    header.set("Authorization", "Bearer " + accessToken);
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
  const { page, totalPage, take } = response.meta;

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
                  take={take}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
