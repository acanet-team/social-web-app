import { createGetBrokersRequest } from "@/api/onboard";
import styles from "@/styles/modules/brokerProfile.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import CircleLoader from "../CircleLoader";
import Pagination from "../Pagination";
import BrokerProfile from "./BrokerProfile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Brokers(props: { onNextHandler: () => void }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const TAKE = 18;
  const { update } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function getBrokers() {
      try {
        setIsLoading(true);
        const res = await createGetBrokersRequest(page, TAKE);
        setBrokers(res.data.docs ? res.data.docs : res.data.data || []);
        setPage(res.data.meta.page);
        setTotalPage(res.data.meta.totalPage);
        console.log(res.data.docs);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    getBrokers();
  }, [page]);

  const onFinish = async () => {
    await update();
    router.push("/");
  };

  return (
    <div className="row ps-2 pe-2" id={styles["all-brokers"]}>
      {isLoading && <CircleLoader />}
      {!isLoading &&
        brokers?.length > 0 &&
        brokers.map((b) => (
          <BrokerProfile
            key={b.userId}
            brokerId={b.userId}
            firstName={b.firstName}
            lastName={b.lastName}
            photo={b.photo}
            followed={b.followed}
            topicName={b.skills[0]?.topicName}
            followersCount={b.followersCount}
            coursesEnrolledCount={b.coursesEnrolledCount}
            rating={b.rating}
            rank={b.rank}
          />
        ))}
      <Pagination pageUpdateFn={setPage} page={page} totalPage={totalPage} />

      <div className="btn mt-3 mb-5 mx-auto">
        <button
          onClick={onFinish}
          className="main-btn bg-current text-center text-white fw-600 px-2 py-3 w175 rounded-4 border-0 d-inline-block my-5 mx-auto"
        >
          Finish
        </button>
      </div>
    </div>
  );
}
