export const friendList = [
  {
    imageUrl: "user.png",
    name: "Anthony Daugloi",
    friend: "12",
  },
  {
    imageUrl: "user.png",
    name: "Mohannad Zitoun",
    friend: "18",
  },
  {
    imageUrl: "user.png",
    name: "Hurin Seary",
    friend: "28",
  },
  {
    imageUrl: "user.png",
    name: "Nguyen Thi Thanh Phuong",
    friend: "28",
  },
  {
    imageUrl: "user.png",
    name: "Nguyen Thi Thanh Phuong",
    friend: "28",
  },
  {
    imageUrl: "user.png",
    name: "Nguyen Thi Thanh Phuong",
    friend: "28",
  },
  {
    imageUrl: "user.png",
    name: "Nguyen Thi Thanh Phuong",
    friend: "28",
  },
];
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import { useMediaQuery } from "react-responsive";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

const Friends = () => {
  const t = useTranslations("Connect_investor");
  const isMobile = useMediaQuery({ query: "(max-width: 990px)" });
  const isQuery = useMediaQuery({ query: "(max-width: 1286px)" });
  const settingSlider = {
    arrows: false,
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: false,
    variableWidth: true,
    draggable: true,
    swipeToSlide: true,
  };

  return (
    <div className="card px-2 w-100 shadow-xss rounded-3 border-0 mb-sm-3 mb-5">
      <div col-xl-12>
        <div className="card-body d-flex align-items-center">
          <h4 className="fw-700 mb-0 font-xsss text-grey-900">
            {t("friend_request")}
          </h4>
          <Link
            href="/listrequest"
            className="fw-600 ms-auto font-xssss text-primary"
          >
            See all
          </Link>
        </div>
        <div className="row">
          {friendList.map((value, index) => (
            <div className="col-12 ps-0 pe-0" key={index}>
              <div className="card-body d-flex pt-0 bor-0 pb-3">
                <figure
                  className={`avatar ${!isQuery ? "col-3" : "col-4"} d-flex align-items-center pe-2`}
                >
                  <Image
                    src={`/assets/images/${value.imageUrl}`}
                    alt="avatar"
                    width={!isQuery ? 75 : 65}
                    height={!isQuery ? 75 : 65}
                    className=" p-1 bg-white rounded-circle object-fit-cover"
                    style={{ objectFit: "cover" }}
                  />
                </figure>

                <div className="col-8">
                  <h4 className="fw-700 text-grey-900 font-xssss mt-1">
                    {value.name} {/* {!isQuery && ( */}
                    <span className="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
                      {value.friend} mutual friends
                    </span>
                    {/* )} */}
                  </h4>

                  <div className="d-flex align-items-center pt-0 pb-2">
                    <div className="p-1 lh-20 w90 bg-primary me-2 text-white text-center font-xssss fw-600 ls-1 rounded-xl">
                      Confirm
                    </div>

                    <div className="p-1 lh-20 w90 bg-grey text-grey-800 text-center font-xssss fw-600 ls-1 rounded-xl">
                      Delete
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

export default Friends;
