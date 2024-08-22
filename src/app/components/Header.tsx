import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Darkbutton from "./Darkbutton";
import useAuthStore from "@/store/auth";
import { useSession } from "next-auth/react";
import HeaderSetting from "./auth/HeaderSetting";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Header(props: { isOnboarding: boolean }) {
  const [isOpen, toggleOpen] = useState(false);
  const [isActive, toggleActive] = useState(false);
  const [isNoti, toggleisNoti] = useState(false);
  const [curTheme, setCurTheme] = useState("theme-light");
  const [openSettings, setOpenSettings] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const [photo, setPhoto] = useState<string>("");
  const { data: session } = useSession() as any;

  useEffect(() => {
    if (session) {
      setPhoto(session?.user?.photo?.path || "/assets/images/user.png");
    }
  }, [session]);

  const navClass = `${isOpen ? " nav-active" : ""}`;
  const buttonClass = `${isOpen ? " active" : ""}`;
  const searchClass = `${isActive ? " show" : ""}`;
  const notiClass = `${isNoti ? " show" : ""}`;

  useEffect(() => {
    const handleThemeChange = () => {
      const theme = localStorage.getItem("theme");
      if (theme) setCurTheme(theme);
    };
    window.addEventListener("themeChange", handleThemeChange as EventListener);
    return () => {
      window.removeEventListener(
        "themeChange",
        handleThemeChange as EventListener,
      );
    };
  }, []);

  const onOpenSettingHandler = () => {
    setOpenSettings((open) => !open);
  };

  const onLogOutHandler = () => {
    logout();
    // Calling next/auth sign out
    signOut({ callbackUrl: "/login" });
  };

  const userId = session?.user?.id;
  return (
    <div className="nav-header shadow-xs border-0">
      <div className="nav-top">
        <Link
          href="/"
          className="d-flex justify-content-left align-items-center"
        >
          <span
            id="site-logo"
            className="d-inline-block fredoka-font ls-3 fw-600 text-current font-xxl logo-text mb-0"
          >
            <Image
              src={
                curTheme === "theme-dark"
                  ? "/assets/images/logo/logo-horizontal-white.png"
                  : "/assets/images/logo/logo-horizontal-dark.png"
              }
              width={220}
              height={55}
              style={{ width: "auto", height: "55px" }}
              alt="logo"
            />
          </span>
        </Link>
        <Link
          href="/defaultmessage"
          className="mob-menu ms-auto me-2 chat-active-btn"
        >
          <i className="feather-message-circle text-grey-900 font-sm btn-round-md bg-greylight"></i>
        </Link>
        <span
          onClick={() => toggleActive((prevState) => !prevState)}
          className="me-2 menu-search-icon mob-menu"
        >
          <i className="feather-search text-grey-900 font-sm btn-round-md bg-greylight"></i>
        </span>
        {props.isOnboarding ? (
          <Image
            src={photo}
            alt="user"
            width={40}
            height={40}
            className="w40 rounded-xl p-0 me-0 nav-menu h-auto rounded-circle cursor-pointer"
            onClick={onOpenSettingHandler}
          />
        ) : (
          <button
            onClick={() => toggleOpen((prevState) => !prevState)}
            className={`nav-menu me-0 ms-2 ${buttonClass}`}
          ></button>
        )}
      </div>

      <form action="#" className="float-left header-search ms-3">
        <div className="form-group mb-0 icon-input">
          <i className="feather-search font-sm text-grey-400"></i>
          <input
            type="text"
            placeholder="Start typing to search.."
            className="bg-grey border-0 lh-32 pt-2 pb-2 ps-5 pe-3 font-xssss fw-500 rounded-xl w400"
          />
        </div>
      </form>
      {/* <Link
        href="/home"
        className="p-2 text-center ms-3 menu-icon center-menu-icon"
      >
        <i className="feather-home font-lg text-grey-500 "></i>
        <div className={curTheme === "theme-dark" ? "text-white" : "text-dark"}>
          Newsfeed
        </div>
      </Link>
      <Link
        href="/defaultgroup"
        className="p-2 text-center ms-0 menu-icon center-menu-icon"
      >
        <i className="feather-user font-lg text-grey-500"></i>
        <div
          className={curTheme === "theme-dark" ? "text-white" : "text-grey-500"}
        >
          Brokers
        </div>
      </Link>
      <Link
        href="/defaultstorie"
        className="p-2 text-center ms-0 menu-icon center-menu-icon"
      >
        <i className="feather-zap font-lg text-grey-500 "></i>
        <div
          className={curTheme === "theme-dark" ? "text-white" : "text-grey-500"}
        >
          Courses
        </div>
      </Link>
      <Link
        href="/shop2"
        className="p-2 text-center ms-0 menu-icon center-menu-icon"
      >
        <i className="feather-shopping-bag font-lg text-grey-500 "></i>
        <div
          className={curTheme === "theme-dark" ? "text-white" : "text-grey-500"}
        >
          Messages
        </div>
      </Link>
      <Link
        href="/shop2"
        className="p-2 text-center ms-0 menu-icon center-menu-icon"
      >
        <i className="feather-shopping-bag font-lg text-grey-500 "></i>
        <div
          className={curTheme === "theme-dark" ? "text-white" : "text-grey-500"}
        >
          Settings
        </div>
      </Link> */}

      <span
        className={`p-2 pointer text-center ms-auto menu-icon ${notiClass}`}
        id="dropdownMenu3"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={() => toggleisNoti((prevState) => !prevState)}
      >
        <span className="dot-count bg-warning"></span>
        <i className="feather-bell font-xl text-current"></i>
      </span>
      <div
        className={`dropdown-menu p-4 right-0 rounded-xxl border-0 shadow-lg ${notiClass}`}
        aria-labelledby="dropdownMenu3"
      >
        <h4 className="fw-700 font-xss mb-4 pe-auto">Notification</h4>
        <div className="card bg-transparent-card w-100 border-0 ps-5 mb-3">
          {/* Notification content */}
        </div>
        <div className="card bg-transparent-card w-100 border-0 ps-5 mb-3">
          <Image
            src={photo}
            width={40}
            height={40}
            alt="user"
            className="w40 position-absolute left-0 rounded-xl"
          />
          <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">
            Goria Coast{" "}
            <span className="text-grey-400 font-xsssss fw-600 float-right mt-1">
              {" "}
              2 min
            </span>
          </h5>
          <h6 className="text-grey-500 fw-500 font-xssss lh-4">
            Mobile Apps UI Designer is require..
          </h6>
        </div>

        <div className="card bg-transparent-card w-100 border-0 ps-5 mb-3">
          <Image
            src={photo}
            alt="user"
            width={40}
            height={40}
            className="w40 position-absolute left-0 rounded-xl"
          />
          <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">
            Surfiya Zakir{" "}
            <span className="text-grey-400 font-xsssss fw-600 float-right mt-1">
              {" "}
              1 min
            </span>
          </h5>
          <h6 className="text-grey-500 fw-500 font-xssss lh-4">
            Mobile Apps UI Designer is require..
          </h6>
        </div>
        <div className="card bg-transparent-card w-100 border-0 ps-5">
          <Image
            src={photo}
            alt="user"
            width={40}
            height={40}
            className="w40 position-absolute left-0 rounded-xl"
          />
          <h5 className="font-xsss text-grey-900 mb-1 mt-0 fw-700 d-block">
            Victor Exrixon{" "}
            <span className="text-grey-400 font-xsssss fw-600 float-right mt-1">
              {" "}
              30 sec
            </span>
          </h5>
          <h6 className="text-grey-500 fw-500 font-xssss lh-4">
            Mobile Apps UI Designer is require..
          </h6>
        </div>
      </div>
      <Darkbutton />
      <Image
        src={photo}
        alt="user"
        width={40}
        height={40}
        className="w40 rounded-xl p-0 ms-3 menu-icon cursor-pointer"
        onClick={onOpenSettingHandler}
      />

      {/* Left navbar */}
      {!props.isOnboarding && (
        <nav className={`navigation scroll-bar ${navClass}`}>
          <div className="container ps-0 pe-0">
            <div className="nav-content">
              <div className="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1 mb-2 mt-2">
                <div className="nav-caption fw-600 font-xssss text-grey-500">
                  <span>New </span>Feeds
                </div>
                <ul className="mb-1 top-content">
                  <li className="logo d-none d-xl-block d-lg-block"></li>
                  <li>
                    <Link
                      href={`/profile/${userId}`}
                      className="nav-content-bttn open-font"
                    >
                      <i className="feather-user btn-round-md bg-blue-gradiant me-3"></i>

                      <span>My Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="nav-content-bttn open-font">
                      <i className="feather-home btn-round-md bg-blue-gradiant me-3"></i>

                      <span>Newsfeed</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/brokers"
                      className="nav-content-bttn open-font"
                    >
                      <i className="feather-user btn-round-md bg-red-gradiant me-3"></i>
                      <span>Brokers</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/defaultstorie"
                      className="nav-content-bttn open-font"
                    >
                      <i className="feather-shopping-bag btn-round-md bg-gold-gradiant me-3"></i>
                      <span>Courses</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/defaultgroup"
                      className="nav-content-bttn open-font"
                    >
                      <i className="feather-zap btn-round-md bg-mini-gradiant me-3"></i>
                      <span>Messages</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/userpage"
                      className="nav-content-bttn open-font"
                    >
                      <i className="feather-settings btn-round-md bg-primary-gradiant me-3"></i>
                      <span>Settings</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1">
                <div className="nav-caption fw-600 font-xssss text-grey-500">
                  <span></span> Account
                </div>
                <ul className="mb-1">
                  <li className="logo d-none d-xl-block d-lg-block"></li>
                  <li>
                    <Link
                      href="/defaultsettings"
                      className="nav-content-bttn open-font h-auto pt-2 pb-2"
                    >
                      <i className="font-sm feather-settings me-3 text-grey-500"></i>
                      <span>Settings</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/defaultanalytics"
                      className="nav-content-bttn open-font h-auto pt-2 pb-2"
                    >
                      <i className="font-sm feather-pie-chart me-3 text-grey-500"></i>
                      <span>Analytics</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/defaultmessage"
                      className="nav-content-bttn open-font h-auto pt-2 pb-2"
                    >
                      <i className="font-sm feather-message-square me-3 text-grey-500"></i>
                      <span>Chat</span>
                      <span className="circle-count bg-warning mt-0">23</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="nav-content-bttn open-font h-auto pt-2 pb-2"
                      onClick={onLogOutHandler}
                    >
                      <i className="font-sm bi bi-box-arrow-right me-3 text-grey-500"></i>
                      <span>Logout</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      )}
      {/* 
      <div className={`app-header-search ${searchClass}`}>
        <form className="search-form">
          <div className="form-group searchbox mb-0 border-0 p-1">
            <input
              type="text"
              className="form-control border-0"
              placeholder="Search..."
            />
            <span className="ms-1 mt-1 d-inline-block close searchbox-close">
              <i
                className="ti-close font-xs"
                onClick={() => toggleActive((prevState) => !prevState)}
              ></i>
            </span>
          </div>
        </form>
      </div> */}

      {openSettings && <HeaderSetting />}
    </div>
  );
}
