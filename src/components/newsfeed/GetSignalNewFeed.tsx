import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Link from "next/link";
import { getSignalsNewFeed } from "@/api/newsfeed";
import CircleLoader from "../CircleLoader";
import type { ISignal } from "@/api/newsfeed/model";

const GetSignalNewFeed = () => {
  const [typeSignal, setTypeSignal] = useState<string>("");
  const [curTheme, setCurTheme] = useState("theme-light");
  const [isLoading, setIsLoading] = useState(false);
  const [signalNewFeed, setSignalNewFeed] = useState<ISignal[]>([]);

  useEffect(() => {
    setTypeSignal("LONG");
  }, []);

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
      {!isLoading && (
        <Slider {...signalsettingsilder}>
          <div className="d-flex pe-5">
            <div className="">
              <div className="d-flex justify-content-center">
                <Image
                  src={`/assets/images/default-ava-not-bg.jpg`}
                  alt=""
                  width={45}
                  height={45}
                  className="rounded-circle"
                />
              </div>
              <span className="m-0 fw-700 font-xssssss">NamNguyen22</span>
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
              className={`d-flex ms-2 border-0 ${typeSignal === "LONG" ? "bg-green-gradient" : "bg-red-gradiant"} p-3 rounded-xxl`}
            >
              <div>
                <p className="m-0 fw-700 font-xsss text-white">BTCUSDT</p>
                <p className="m-0 fw-100 font-xsssss text-white">
                  Expiring on <span>20/09/24</span>
                </p>
              </div>
              <p
                className={`m-0 ms-3 fw-700 ${typeSignal === "LONG" ? "text-green" : "text-red"}`}
              >
                {typeSignal}
              </p>
            </div>
          </div>
          <Link
            href="/signal"
            className="mt-4 cursor-pointer bg-primary text-white py-1 px-2 rounded-12"
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
