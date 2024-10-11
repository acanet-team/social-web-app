import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Darkbutton from "./Darkbutton";
import useAuthStore from "@/store/auth";
import { useSession } from "next-auth/react";
import HeaderSetting from "./auth/HeaderSetting";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import styles from "@/styles/modules/header.module.scss";
import { useWebSocket } from "@/context/websocketProvider";
import Notifications from "./Notification";
import { useRouter } from "next/router";
import QuickSearchCard from "./search/QuickSearchCard";
import type { IQuickSearchResponse } from "@/api/search/model";
import { quickSearch } from "@/api/search";
import { useMediaQuery } from "react-responsive";
import DotWaveLoader from "./DotWaveLoader";

export default function Header(props: { isOnboarding: boolean }) {
  const t = useTranslations("NavBar");
  const tSearch = useTranslations("Search");
  const [isOpen, toggleOpen] = useState(false);
  const [isActive, toggleActive] = useState(false);
  const [isNoti, toggleisNoti] = useState(false);
  const [curTheme, setCurTheme] = useState("theme-light");
  const [openSettings, setOpenSettings] = useState(false);
  const [reatAllNotis, setReadAllNotis] = useState<boolean>(true);
  const [photo, setPhoto] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);
  const iconNotiRef = useRef<HTMLDivElement>(null);
  const iconNotiMiniRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLImageElement>(null);
  const [nickName, setNickName] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const { data: session } = useSession() as any;
  const { notifications } = useWebSocket();
  const userId = session?.user?.id;
  const router = useRouter();
  const { locale } = router;
  const [countNotis, setCountNotis] = useState<number>(0);
  const logout = useAuthStore((state) => state.logout);
  const [quickSearchTerm, setQuickSearchTerm] = useState<string>("");
  const [searchResults, setQuickSearchResults] = useState<IQuickSearchResponse>(
    { communities: [], users: [] },
  );
  const showMobileSearchInput = useMediaQuery({ query: "(max-width: 992px)" });
  const searchInputDesktopRef = useRef<HTMLInputElement>(null);
  const searchInputMobileRef = useRef<HTMLInputElement>(null);
  const searchResultRef = useRef<HTMLDivElement>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [styleCountNoti, setStyleCountNoti] = useState("");
  const [isShowAddNoti, setIsShowAddNoti] = useState(false);
  // const [notiSocket, setNotiSocket] = useState<Notification[]>([]);

  useEffect(() => {
    // console.log("notifications-yy", notifications);
    // console.log("ahdfh", countNotis);
  }, [notifications]);

  useEffect(() => {
    const formatCountNoti = () => {
      if (countNotis > 99) {
        setCountNotis(99);
        setIsShowAddNoti(true);
        setStyleCountNoti("dot-count-three-numbers");
      } else if (countNotis > 9) {
        setStyleCountNoti("dot-count-two-numbers");
        setIsShowAddNoti(false);
      } else if (countNotis > 0 && countNotis <= 9) {
        setStyleCountNoti("dot-count-text");
        setIsShowAddNoti(false);
      }
    };

    formatCountNoti();
  }, [countNotis]);

  useEffect(() => {
    if (session) {
      setPhoto(session?.user?.photo?.path || "/assets/images/user.png");
      setNickName(session?.user?.userProfile?.nickName);
      setRole(session?.user?.role?.name);
    }
  }, [session]);

  const navClass = `${isOpen ? " nav-active" : ""}`;
  const buttonClass = `${isOpen ? " active" : ""}`;
  const searchClass = `${isActive && showMobileSearchInput ? " show" : ""}`;
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

  const onLogOutHandler = () => {
    logout();
    // Calling next/auth sign out
    signOut({ callbackUrl: "/login" });
  };

  const onOpenSettingHandler = () => {
    setOpenSettings((open) => !open);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      !avatarRef?.current?.contains(event.target as Node) &&
      !modalRef?.current?.contains(event.target as Node)
    ) {
      setOpenSettings(false);
    }
    if (
      !iconNotiRef?.current?.contains(event.target as Node) &&
      !notiRef?.current?.contains(event.target as Node) &&
      !iconNotiMiniRef?.current?.contains(event.target as Node)
    ) {
      toggleisNoti(false);
    }
    if (
      !searchInputMobileRef?.current?.contains(event.target as Node) &&
      !searchInputDesktopRef?.current?.contains(event.target as Node) &&
      !searchResultRef?.current?.contains(event.target as Node)
    ) {
      resetSearchInput();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const resetSearchInput = () => {
    setQuickSearchTerm("");
    setQuickSearchResults({ communities: [], users: [] });
    toggleActive(false);
  };

  const onSearchHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerms = e.target.value;
    setQuickSearchTerm(e.target.value);
    if (!searchTerms) {
      return setQuickSearchTerm("");
    }
    toggleActive(true);
    try {
      setIsSearching(true);
      const res = await quickSearch(searchTerms, 4);
      // console.log("quick search", res.data);
      setQuickSearchResults(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSearching(false);
    }
  };

  const onEnterSearchHandler = (e: any) => {
    if (e.key === "Enter" && e.shiftKey == false) {
      e.preventDefault();
      const keyword = e.target.value;
      if (!keyword) return;
      router.push(`/search/${keyword}?tab=all`);
      resetSearchInput();
    }
  };

  const onFullSearchHandler = () => {
    router.push(`/search/${quickSearchTerm}`);
    resetSearchInput();
  };

  return (
    <div className="nav-header shadow-xs border-0 font-system">
      <div className="nav-top">
        <Link
          href="/"
          className="d-flex justify-content-left align-items-center"
        >
          <span
            id="site-logo"
            className="d-inline-block fredoka-font ls-3 fw-600 text-current font-xxl logo-text mb-0
            "
          >
            <Image
              src={
                curTheme === "theme-dark"
                  ? "/assets/images/logo/logo-horizontal-white.png"
                  : "/assets/images/logo/logo-horizontal-dark.png"
              }
              width={220}
              height={55}
              alt="logo"
              className={`${styles["logo-header"]}`}
            />
          </span>
        </Link>
        <Link
          href="/defaultmessage"
          className="mob-menu ms-auto me-2 chat-active-btn"
        >
          <i className="feather-message-circle text-grey-900 font-md btn-round-sm bg-greylight"></i>
        </Link>
        <span
          className={`me-2 menu-search-icon mob-menu ${notiClass} ${styles["icon-noti"]}`}
          onClick={() => toggleisNoti((prevState) => !prevState)}
          ref={iconNotiMiniRef}
        >
          {reatAllNotis === false && (
            <span className={` ${styles["dot-count"]} bg-pinterest`}>
              <p className={`${styles[styleCountNoti]} font-xsssss text-white`}>
                {countNotis}
                {isShowAddNoti && (
                  <span className={`${styles["style-dot-add-noti"]}`}>+</span>
                )}
              </p>
            </span>
          )}
          <i className="feather-bell text-grey-900 font-md btn-round-sm bg-greylight"></i>
        </span>
        <span
          onClick={() => toggleActive((prevState) => !prevState)}
          className="me-2 menu-search-icon mob-menu cursor-pointer"
        >
          <i className="feather-search text-grey-900 font-md btn-round-sm bg-greylight"></i>
        </span>
        {props.isOnboarding && photo ? (
          <Image
            src={photo}
            alt="user"
            width={40}
            height={40}
            className="w40 rounded-xl p-0 me-0 nav-menu rounded-circle cursor-pointer"
            onClick={onOpenSettingHandler}
            style={{ height: "40px", objectFit: "cover" }}
          />
        ) : (
          <button
            onClick={() => toggleOpen((prevState) => !prevState)}
            className={`nav-menu me-0 ms-2 ${buttonClass}`}
          ></button>
        )}
      </div>

      <div className="position-relative">
        {/* Mobile quick search */}
        <div className={`app-header-search ${searchClass}`}>
          <form className="search-form h-100">
            <div className="form-group searchbox h-100 mb-0 border-0 p-1">
              <input
                type="text"
                className={`form-control h-100 border-0 ${styles["text-input-search"]}`}
                placeholder={tSearch("search_placeholer")}
                value={quickSearchTerm}
                onChange={onSearchHandler}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  onEnterSearchHandler(e)
                }
                ref={searchInputMobileRef}
              />
              <span className="ms-1 mt-1 d-inline-block close searchbox-close">
                <i
                  className="bi bi-x-lg font-xs text-dark"
                  onClick={() => toggleActive(false)}
                ></i>
              </span>
            </div>
          </form>
        </div>

        {/* Desktop quick search */}
        <form action="#" className={`float-left header-search ms-3`}>
          <div className="form-group mb-0 icon-input">
            <i className="feather-search font-sm text-grey-400"></i>
            <input
              type="text"
              placeholder={tSearch("search_placeholer")}
              className={`${styles["quick-search"]} ${styles["text-input-search"]} bg-grey border-0 lh-32 pt-2 pb-2 ps-5 pe-3 font-xsss fw-500 rounded-xl`}
              value={quickSearchTerm}
              onChange={onSearchHandler}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                onEnterSearchHandler(e)
              }
              ref={searchInputDesktopRef}
            />
          </div>
        </form>

        {/* Quick search result */}
        {isActive &&
          (searchInputMobileRef?.current?.value ||
            searchInputDesktopRef?.current?.value) &&
          searchResults &&
          searchResults.users.length === 0 &&
          searchResults.communities.length === 0 && (
            <div
              className={styles["quick-search__results"]}
              ref={searchResultRef}
            >
              {isSearching && <DotWaveLoader />}
              {!isSearching && (
                <div className={styles["quick-search__results-content"]}>
                  <div
                    className={`mb-4 text-center font-xsss ${styles["text-dark-mode"]}`}
                  >
                    {tSearch("search_no_result")}
                  </div>
                </div>
              )}
            </div>
          )}
        {isActive &&
          (searchInputMobileRef?.current?.value ||
            searchInputDesktopRef?.current?.value) &&
          searchResults &&
          (searchResults.users.length > 0 ||
            searchResults.communities.length > 0) && (
            <div
              className={styles["quick-search__results"]}
              ref={searchResultRef}
            >
              {isSearching && <DotWaveLoader />}
              {!isSearching && (
                <div className={styles["quick-search__results-content"]}>
                  {searchResults.users.map((user) => (
                    <div key={user.userId}>
                      <QuickSearchCard
                        type="user"
                        isFullSearch={false}
                        data={user}
                        clearSearch={resetSearchInput}
                      />
                    </div>
                  ))}
                  {searchResults.communities.map((community) => (
                    <div key={community.id}>
                      <QuickSearchCard
                        type="community"
                        isFullSearch={false}
                        data={community}
                        clearSearch={resetSearchInput}
                      />
                    </div>
                  ))}
                  <div className={styles["quick-search__results-line"]}></div>
                </div>
              )}
              {!isSearching &&
                (searchResults.users.length > 0 ||
                  searchResults.communities.length > 0) && (
                  <div className={styles["quick-search__results-footer"]}>
                    {/* <div>1.535 results</div> */}
                    <div className="text-dark fw-600 ms-auto cursor-pointer">
                      <span
                        className={`text-decoration-underline ${styles["text-dark-mode"]}`}
                        onClick={onFullSearchHandler}
                      >
                        {tSearch("see_more_results")}
                      </span>
                      <i className="bi bi-arrow-right ms-1 h5"></i>
                    </div>
                  </div>
                )}
            </div>
          )}
      </div>

      <span
        className={`p-2 pointer text-center ms-auto menu-icon cursor-pointer ${notiClass}`}
        onClick={() => toggleisNoti((prevState) => !prevState)}
        ref={iconNotiRef}
      >
        {reatAllNotis === false && (
          <span className={`${styles["dot-count-max-width"]} bg-pinterest`}>
            <p className={`${styles[styleCountNoti]} font-xsssss text-white`}>
              {countNotis}
              {isShowAddNoti && (
                <span className={`${styles["style-dot-add-noti"]} font-xsssss`}>
                  +
                </span>
              )}
            </p>
          </span>
        )}

        <i className="feather-bell font-xl text-current"></i>
      </span>
      <div
        ref={notiRef}
        className={`dropdown-menu right-0 ${styles["bg-dropdown-border-noti"]} rounded-3 border-0 shadow-lg ${notiClass}`}
      >
        <Notifications
          notificationsSocket={notifications}
          toggleisNoti={toggleisNoti}
          setReadAllNotis={setReadAllNotis}
          isNoti={isNoti}
          setCountNotis={setCountNotis}
          countNotis={countNotis}
        />
      </div>

      <Darkbutton />
      {photo && (
        <Image
          src={photo}
          alt="user"
          width={40}
          ref={avatarRef}
          height={40}
          className="w40 rounded-xl p-0 ms-3 menu-icon cursor-pointer"
          onClick={onOpenSettingHandler}
          style={{ objectFit: "cover" }}
        />
      )}
      {openSettings && (
        <div ref={modalRef}>
          <HeaderSetting />
        </div>
      )}

      {/* Left navbar */}
      {!props.isOnboarding && (
        <nav
          className={`navigation scroll-bar ${navClass} header-navbar__margin`}
        >
          <div className={`${styles["left-navBar"]} container ps-0 pe-0`}>
            <div className="nav-content">
              <div className="nav-wrap bg-white bg-transparent-card rounded-3 shadow-xss pt-3 pb-1 mb-2 mt-2">
                <div className="nav-caption fw-600 font-xsss text-grey-500">
                  <span>{t("newsfeed")}</span>
                </div>
                <ul className="mb-1 top-content">
                  <li className="logo d-none d-xl-block d-lg-block"></li>
                  <li>
                    <Link href="/" className="nav-content-bttn">
                      <i className="feather-home btn-round-md bg-blue-gradiant me-3"></i>

                      <span>{t("newsfeed")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={nickName ? `/${locale}/profile/${nickName}` : "#"}
                      as={nickName ? `/profile/${nickName}` : "#"}
                      className="nav-content-bttn"
                    >
                      <i className="bi bi-person-bounding-box btn-round-md bg-youtube me-3"></i>

                      <span>{t("my profile")}</span>
                    </Link>
                  </li>

                  {!(role === "broker") && (
                    <li>
                      <Link href="/listrequest" className="nav-content-bttn">
                        <div className=" btn-round-md bg-instagram me-3">
                          <Image
                            src="/assets/images/iconListRequest.svg"
                            alt=""
                            width={20}
                            height={20}
                            className="w20 rounded-circle shadow-xss"
                            style={{ objectFit: "cover" }}
                          />
                        </div>

                        <span>{t("request_connect")}</span>
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link href="/signal" className="nav-content-bttn">
                      <i className="feather-trending-up btn-round-md bg-pink-gradiant me-3"></i>
                      <span>{t("signal")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/brokers" className="nav-content-bttn">
                      <i className="bi bi-person-check btn-round-md bg-red-gradiant me-3"></i>
                      <span>{t("brokers")}</span>
                    </Link>
                  </li>

                  <li>
                    <Link href="/communities" className="nav-content-bttn">
                      <i className="feather-globe btn-round-md bg-mini-gradiant me-3"></i>
                      <span>{t("community")}</span>
                    </Link>
                  </li>
                  {/* <li>
                    <Link href="/defaultstorie" className="nav-content-bttn">
                      <i className="feather-shopping-bag btn-round-md bg-gold-gradiant me-3"></i>
                      <span>{t("courses")}</span>
                    </Link>
                  </li> */}
                  {/* <li>
                    <Link
                      href="/defaultgroup"
                      className="nav-content-bttn open-font"
                    >
                      <i className="feather-zap btn-round-md bg-mini-gradiant me-3"></i>
                      <span>{t("messages")}</span>
                    </Link>
                  </li> */}
                </ul>
              </div>

              <div className="nav-wrap bg-white bg-transparent-card rounded-3 shadow-xss pt-3 pb-1">
                <div className="nav-caption fw-600 font-xsss text-grey-500">
                  <span>{t("account")}</span>
                </div>
                <ul className="mb-1">
                  <li className="logo d-none d-xl-block d-lg-block"></li>
                  {/* <li>
                    <Link
                      href="/defaultsettings"
                      className="nav-content-bttn h-auto"
                    >
                      <i className="font-xl text-current feather-settings me-3"></i>
                      <span>{t("settings")}</span>
                    </Link>
                  </li> */}
                  {/* <li>
                    <Link
                      href="/defaultmessage"
                      className="nav-content-bttn h-auto"
                    >
                      <i className="font-xl text-current feather-message-square me-3"></i>
                      <span>{t("chat")}</span>
                      <span className="circle-count bg-warning mt-0">23</span>
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      href="#"
                      className="nav-content-bttn h-auto ms-1"
                      onClick={onLogOutHandler}
                    >
                      <i className="font-xl text-current bi bi-box-arrow-right me-3"></i>
                      <span>{t("logout")}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
