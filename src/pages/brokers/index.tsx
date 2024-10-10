import styles from "@/styles/modules/brokerProfile.module.scss";
import type { InferGetServerSidePropsType, NextPageContext } from "next";
import BrokerList from "@/components/brokers/BrokerList";
import BrokerSearch from "@/components/brokers/BrokerSearch";
import { useState } from "react";

export default function Brokers({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [interestTopicIds, setInterestTopicIds] = useState<string[]>([]);
  return (
    <>
      <BrokerSearch
        searchTerm={searchTerm}
        setSearch={setSearchTerm}
        setInterestTopicIds={setInterestTopicIds}
      />
      <BrokerList searchTerm={searchTerm} interestTopicIds={interestTopicIds} />
    </>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      messages: (await import(`@/locales/${context.locale}.json`)).default,
    },
  };
}
