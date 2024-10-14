import { createGetBrokersRequest } from "@/api/onboard";
import styles from "@/styles/modules/brokerProfile.module.scss";
import { useEffect, useState } from "react";
import CircleLoader from "@/components/CircleLoader";
import Pagination from "@/components/Pagination";
import BrokerProfile from "@/components/onboard/BrokerProfile";
import { useTranslations } from "next-intl";

export default function BrokerList(props: {
  searchTerm: string;
  interestTopicIds: string[];
}) {
  const t = useTranslations("BrokerList");
  const { searchTerm, interestTopicIds } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const TAKE = 18;

  async function getBrokers() {
    try {
      setIsLoading(true);
      const res = await createGetBrokersRequest(
        page,
        TAKE,
        searchTerm,
        JSON.stringify(interestTopicIds),
      );
      setBrokers(res.data.docs ? res.data.docs : res.data.data || []);
      setPage(res.data.meta.page);
      setTotalPage(res.data.meta.totalPage);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getBrokers();
  }, [page, searchTerm, interestTopicIds]);

  return (
    <>
      {isLoading && (
        <div className="mx-auto">
          <CircleLoader />
        </div>
      )}
      <div id={styles["all-brokers"]}>
        {!isLoading && brokers?.length === 0 && (
          <div className="mx-auto mt-4 text-grey-600">
            {t("no_broker_found")}
          </div>
        )}
        {!isLoading &&
          brokers?.length > 0 &&
          brokers.map((b) => (
            <div key={b.userId}>
              <BrokerProfile
                key={b.userId}
                brokerId={b.userId}
                firstName={b.firstName}
                lastName={b.lastName}
                nickName={b.nickName}
                photo={b.photo}
                followed={b.followed}
                followersCount={b.followersCount}
                coursesEnrolledCount={b.coursesEnrolledCount}
                email={b.email}
                signalAccuracy={b.signalAccuracy}
                summary={b.summary}
                rank={b.rank}
              />
            </div>
          ))}
      </div>
      {!isLoading && brokers?.length > 0 && (
        <div className={styles["brokers-pagination"]}>
          <Pagination
            pageUpdateFn={setPage}
            page={page}
            totalPage={totalPage}
            isTable={false}
          />
        </div>
      )}
    </>
  );
}
