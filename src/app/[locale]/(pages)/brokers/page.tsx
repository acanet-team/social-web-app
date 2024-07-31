import React, { Fragment } from "react";
import Pagetitle from "@/app/components/Pagetitle";
// import type { AxiosError } from "axios";
import { createGetBrokersRequest } from "@/api/user";
import { getTranslations } from "next-intl/server";
import Brokers from "@/app/components/brokers/Brokers";

const getBrokers = async () => {
  try {
    const response = await createGetBrokersRequest(1, 20);
    return response.data;
  } catch (err) {
    // const errors = err as AxiosError;
    console.log(err);
    return { data: [], meta: { page: 1, totalPage: 1 } };
  }
};

export default async function BrokerList(props: {
  params: { locale: string };
}) {
  const t = await getTranslations("BrokerList");
  const response = await getBrokers();
  // const brokers = response.docs;
  const brokers = response.data ?? response.docs ?? [];
  const page = response.meta.page;
  const totalPage = response.meta.totalPage;
  const TAKE = 20;

  return (
    <Fragment>
      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div className="col-xl-12">
                <Pagetitle
                  title={t("broker_title")}
                  intro={t("broker_description")}
                />

                <Brokers
                  brokers={brokers}
                  page={page}
                  totalPage={totalPage}
                  take={TAKE}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
