import { createGetBrokersRequest } from "@/api/onboard";
import styles from "@/styles/modules/brokerProfile.module.scss";
import { useEffect, useState } from "react";
import CircleLoader from "../CircleLoader";
import Pagination from "../Pagination";
import BrokerProfile from "./BrokerProfile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import BrokerSearch from "../brokers/BrokerSearch";

export default function OnboardBrokers(props: { onNextHandler: () => void }) {
  const tOnboard = useTranslations("Onboard");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [interestTopicIds, setInterestTopicIds] = useState<string[]>([]);
  const TAKE = 18;
  const { update } = useSession();
  const router = useRouter();

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

  const onFinish = async () => {
    await update();
    localStorage.setItem("onboarding_step", "onboarding_complete");
    router.push("/");
    console.log("ahhaj");
  };

  return (
    <>
      <div className="mx-auto d-flex justify-content-center">
        <BrokerSearch
          searchTerm={searchTerm}
          setSearch={setSearchTerm}
          setInterestTopicIds={setInterestTopicIds}
        />
      </div>
      {isLoading && (
        <div className="mx-auto">
          <CircleLoader />
        </div>
      )}
      <div id={styles["all-brokers"]} style={{ margin: "0 auto" }}>
        {!isLoading &&
          brokers?.length > 0 &&
          brokers.map((b) => (
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
              signalAccuracy={b.accuracy}
              summary={b.summary}
              rank={b.rank}
            />
          ))}
      </div>
      <div className={styles["brokers-pagination"]}>
        <Pagination
          pageUpdateFn={setPage}
          page={page}
          totalPage={totalPage}
          isTable={false}
        />
      </div>

      <div
        className={`${styles["onboard-finish__btn"]} btn d-block mt-3 mb-5 w175 mx-auto`}
      >
        <button
          onClick={onFinish}
          className="main-btn bg-current text-center text-white fw-600 px-2 py-3 w175 rounded-4 border-0 d-inline-block my-5 mx-auto"
        >
          {tOnboard("finish")}
        </button>
      </div>
    </>
  );
}
