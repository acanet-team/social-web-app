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

const GetSignalNewFeed = () => {
  const [curTheme, setCurTheme] = useState("theme-light");
  const [isLoading, setIsLoading] = useState(false);
  const [signalNewFeed, setSignalNewFeed] = useState<ISignalDaily[]>([]);

  // useEffect(() => {
  //   setTypeSignal("LONG");
  // }, []);

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
      console.log("signalNewFeed", response.data);
      setSignalNewFeed(response.data);
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
                <span className="m-0 fw-700 font-xsssss">
                  {signal?.owner?.nickName}
                </span>
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
                  <p className="m-0 fw-100 font-xsssss text-white">
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
            See more
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
