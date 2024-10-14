import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Link from "next/link";
import CircleLoader from "../CircleLoader";
import dayjs from "dayjs";
import type { ISignalDaily } from "@/api/signal/model";
import { getSignalsNewFeed } from "@/api/signal";
import { useTranslations } from "next-intl";
import styles from "@/styles/modules/home.module.scss";

const GetSignalNewFeed = () => {
  const t = useTranslations("Signal");
  const [curTheme, setCurTheme] = useState("theme-light");
  const [isLoading, setIsLoading] = useState(false);
  const [signalNewFeed, setSignalNewFeed] = useState<ISignalDaily[]>([]);

  const signalsettingsilder = {
    arrows: false,
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    centerMode: false,
    variableWidth: true,
    draggable: true,
    swipeToSlide: true,
  };

  useEffect(() => {
    const handleThemeCha = () => {
      const theme = localStorage.getItem("theme");
      if (theme) setCurTheme(theme);
    };
    window.addEventListener("themeChange", handleThemeCha as EventListener);
    return () => {
      window.removeEventListener(
        "themeChange",
        handleThemeCha as EventListener,
      );
    };
  }, []);

  const fetchSignals = async () => {
    setIsLoading(true);
    try {
      const response = await getSignalsNewFeed();
      setSignalNewFeed(response.data);
      console.log("aaaaa", response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  return (
    <>
      {signalNewFeed?.length > 0 && (
        <Slider {...signalsettingsilder}>
          {/* {signalNewFeed?.length > 0 ? ( */}
          {signalNewFeed.map((signal, index) => (
            <div className="d-flex pe-5" key={index}>
              <div className="">
                <div className="d-flex justify-content-center">
                  <Image
                    src={
                      signal?.owner?.photo?.path
                        ? signal?.owner?.photo?.path
                        : `/assets/images/default-ava-not-bg.jpg`
                    }
                    alt=""
                    width={45}
                    height={45}
                    style={{ objectFit: "cover" }}
                    className="rounded-circle"
                  />
                </div>
                <span className="m-0 fw-700 font-xsss text-align">
                  {signal?.owner?.nickName}
                </span>
                <div
                  className={`${signal?.signalAccuracy === null ? styles["signal-none"] : Number(signal?.signalAccuracy) >= 75 ? styles["signal-green"] : Number(signal?.signalAccuracy) >= 50 ? styles["signal-yellow"] : styles["signal-red"]} fw-700 text-align font-xssss`}
                >
                  {!Number.isNaN(signal?.signalAccuracy) &&
                  signal?.signalAccuracy
                    ? +signal?.signalAccuracy % 1 !== 0
                      ? (+signal?.signalAccuracy).toFixed(2) +
                        "% " +
                        t("accuracy")
                      : +signal?.signalAccuracy + "% " + t("accuracy")
                    : ""}
                </div>
              </div>
              <Image
                src={
                  curTheme === "theme-light"
                    ? `/assets/images/black-icon-signal.png`
                    : `/assets/images/white_icon_with_transparent_background.png`
                }
                alt=""
                width={12}
                height={12}
              />
              <div
                className={`d-flex ms-2 border-0 ${
                  signal?.type === "long"
                    ? "bg-green-gradient"
                    : "bg-red-gradiant"
                } p-3 rounded-xxl`}
              >
                <div>
                  <p className="m-0 fw-700 font-xsss text-white">
                    {signal?.signalPair}
                  </p>
                  <p className="m-0 fw-100 font-xssss text-white">
                    Expiring on{" "}
                    <span>{dayjs(signal?.expiryAt).format("DD/MM/YY")}</span>
                  </p>
                </div>
                <p
                  className={`m-0 ms-3 fw-700 ${
                    signal?.type === "long" ? "text-green" : "text-red"
                  }`}
                >
                  {signal?.type?.toUpperCase()}
                </p>
              </div>
            </div>
          ))}
          {/* ) : (
          <p className="m-0">No signal</p>
        )} */}
          <Link
            href="/signal"
            className="mt-4 cursor-pointer bg-primary text-white py-1 px-2 rounded-12 font-xsss"
          >
            {t("see_more")}
            <span>
              <i className="bi bi-arrow-up-right ps-1"></i>
            </span>
          </Link>
        </Slider>
      )}
      {isLoading && <CircleLoader />}
    </>
  );
};

export default GetSignalNewFeed;
