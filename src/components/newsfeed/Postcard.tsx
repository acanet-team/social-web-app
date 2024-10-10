import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "@/styles/modules/postCard.module.scss";
import { deletePost, getComments, likeRequest } from "@/api/newsfeed";
import { TimeSinceDate } from "@/utils/time-since-date";
import Image from "next/image";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import DotWaveLoader from "../DotWaveLoader";
import { useSession } from "next-auth/react";
import { throwToast } from "@/utils/throw-toast";
import RoundedNumber from "../RoundedNumber";
import { useTranslations } from "next-intl";
import Link from "next/link";
import PostModal from "./PostModal";
import { useMediaQuery } from "react-responsive";
import Comments from "./Comments";
import { cleanPath } from "@/utils/Helpers";
import type { IPostCommunityInfo, IUserInfo } from "@/api/community/model";
import DonateModal from "../profile/DonateModal";
import type { User } from "@/api/profile/model";
import { useWeb3 } from "@/context/wallet.context";
import type { IPost } from "@/api/newsfeed/model";
import { ethers } from "ethers";

export default function PostCard(props: {
  groupOwnerId: number | "";
  community: IPostCommunityInfo;
  postAuthor: IUserInfo;
  postId: string;
  content: string;
  assets: Array<{ id: string; path: string }>;
  createdAt: string;
  like: number;
  comment: number;
  columnsCount: number;
  liked: boolean;
  postType: string;
  additionalData?: any | null;
  setPostHandler: React.Dispatch<React.SetStateAction<{ id: string }[]>>;
}) {
  const {
    groupOwnerId,
    community,
    postAuthor,
    postId,
    content,
    assets,
    createdAt,
    like,
    comment,
    columnsCount,
    liked,
    postType,
    additionalData,
    setPostHandler,
  } = props;
  const [expandPost, setExpandPost] = useState<boolean>(false);
  const [openComments, setOpenComments] = useState<boolean>(false);
  const [openMobileComments, setOpenMobileComments] = useState<boolean>(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [commentNum, setCommentNum] = useState<number>(comment || 0);
  const [openDonate, setOpenDonate] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(liked);
  const [likeNum, setLikeNum] = useState<number>(like);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession() as any;
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const tBase = useTranslations("Base");
  const tPost = useTranslations("Post");
  const tAction = useTranslations("Action");
  const tNFT = useTranslations("NFT");
  const { account, connectWallet, nftMarketContract } = useWeb3();
  const [isBuyingNFT, setIsBuyingNFT] = useState<boolean>(false);

  // Comment states
  const [comments, setComments] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [take, setTake] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Props
  const groupAvatar = community?.avatar?.path || "";
  const groupId = community?.communityId || "";
  const groupName = community?.name || "";
  const authorId = postAuthor?.userId;
  const authorNickname =
    postAuthor?.nickName || postAuthor?.firstName + " " + postAuthor?.lastName;
  const avatar = postAuthor?.photo?.id
    ? cleanPath(postAuthor?.photo?.path)
    : "/assets/images/user.png";

  // Function to fetch comments
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response: any = await getComments(page, take, postId);
      // Update the comments state with the fetched data
      // setComments((prevState) => [...prevState, ...response.data.docs]);
      setComments(response.data.docs.reverse());
      console.log("comment array", response.data.docs);
      setTotalPage(response.data.meta.totalPage);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      setUserId(session.user?.id);
    }
  }, [session]);

  useEffect(() => {
    // Fetch comments again every time user opens the comment section on PC
    if (openComments) {
      fetchComments();
    }
  }, [postId, openComments]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setOpenSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingsRef]);

  const onShowCommentHandler = (id: string) => {
    if (isMobile) {
      setOpenMobileComments(true);
    } else {
      setOpenComments((open) => !open);
    }
  };

  const handleClose = useCallback(() => {
    if (isMobile) {
      setOpenMobileComments(false);
    } else {
      setOpenComments((open) => !open);
    }
  }, []);

  const onClickLikeHandler = (e: any, id: string, like: number) => {
    const likeBtn = e.target;
    if (likeBtn) {
      try {
        if (isLiked) {
          setLikeNum((prev) => prev - 1);
          setIsLiked(false);
          likeRequest({ postId: id, action: "unfavorite" });
        } else {
          setLikeNum((prev) => prev + 1);
          setIsLiked(true);
          likeRequest({ postId: id, action: "favorite" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onDeletePost = async (e: any, postId: string) => {
    try {
      // Calling api;
      await deletePost(postId);
      setPostHandler((prev) => prev.filter((post) => post.id !== postId));
      throwToast("Post was successfully deleted", "success");
    } catch (err) {
      console.log(err);
    }
  };

  const setCommentNumHandler = useCallback((action: string) => {
    if (action === "add") {
      setCommentNum((prevState: number) => prevState + 1);
    } else {
      setCommentNum((prevState: number) => prevState - 1);
    }
  }, []);

  const updateLikeHandler = useCallback((action: string) => {
    if (action === "add") {
      setLikeNum((prevState: number) => prevState + 1);
    } else {
      setLikeNum((prevState: number) => prevState - 1);
    }
  }, []);

  const updateCommentHandler = useCallback((action: string) => {
    if (action === "add") {
      setCommentNum((prevState: number) => prevState + 1);
    } else {
      setCommentNum((prevState: number) => prevState - 1);
    }
  }, []);

  const onDonateHandler = () => {
    if (!account) {
      return connectWallet();
    }
    setOpenDonate(true);
  };

  const onBuyNFTHandler = async () => {
    try {
      if (!account) {
        return connectWallet();
      }
      setIsBuyingNFT(true);
      const res = await nftMarketContract.buyNFT(additionalData.nftTokenId, {
        gasLimit: 2000000,
        value: ethers.utils.parseEther(additionalData.price.toString()),
      });
      return throwToast(tNFT("buy_nft_success"), "success");
    } catch (error) {
      console.log(error);
      if (error?.data?.code === -32000) {
        return throwToast(tNFT("buy_not_enough_token"), "error");
      }
      return null;
    } finally {
      setIsBuyingNFT(false);
    }
  };

  return (
    <div
      className={`${styles.post} post-card card w-100 shadow-xss rounded-3 border-0 p-sm-4 p-3 mb-3`}
    >
      <div className="card-body p-0 d-flex">
        <figure className="avatar me-3 d-flex align-items-center justify-content-center">
          {groupAvatar ? (
            <div className="position-relative">
              <Link href={`/communities/detail/${groupId}`}>
                <Image
                  src={groupAvatar}
                  width={50}
                  height={50}
                  alt="group"
                  className={`${styles["group-avatar"]} shadow-sm rounded-3`}
                />
              </Link>
              <Link href={`/profile/${authorNickname}`}>
                <Image
                  src={avatar}
                  width={40}
                  height={40}
                  alt="avatar"
                  className={`${postAuthor.role.name === "broker" ? styles["broker-ava__effect"] : ""} ${styles["author-avatar"]} shadow-sm rounded-circle position-absolute border-1`}
                  style={{
                    bottom: "-5px",
                    right: "-5px",
                  }}
                />
              </Link>
            </div>
          ) : (
            <Link
              href={`/profile/${authorNickname}`}
              className="position-relative"
            >
              <Image
                src={avatar}
                width={40}
                height={40}
                alt="avater"
                className={`${postAuthor.role.name === "broker" ? styles["broker-ava__effect"] : ""} ${styles["author-avatar"]} shadow-sm rounded-circle`}
              />
              {postAuthor.role.name === "broker" && (
                <Image
                  src="/assets/images/profile/check-mark.svg"
                  width={24}
                  height={24}
                  alt="logo"
                  className={styles["verified-broker"]}
                />
              )}
            </Link>
          )}
        </figure>
        {groupName ? (
          <div>
            <Link href={`/communities/detail/${groupId}`}>
              <h4 className="fw-700 text-grey-900 text-break font-xss m-0">
                {isMobile
                  ? groupName.length > 23
                    ? `${groupName.substring(0, 20)}...`
                    : groupName
                  : groupName}
              </h4>
            </Link>
            <div className="d-flex align-items-end">
              <Link
                href={`/profile/${authorNickname}`}
                className="lh-3 d-flex align-items-end"
              >
                <span className="font-xsss fw-500 text-break text-grey-600">
                  @
                  {isMobile
                    ? authorNickname.length > 20
                      ? `${authorNickname.substring(0, 20)}...`
                      : authorNickname
                    : authorNickname}
                </span>
              </Link>
              <div className="d-flex align-items-end">
                <i className="bi bi-dot h4 m-0 text-grey-500"></i>
                <span className="font-xsss fw-500 mt-1 lh-3 text-grey-500">
                  {createdAt ? TimeSinceDate(createdAt) : ""}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <Link href={`/profile/${authorNickname}`}>
              <h4 className="fw-700 text-grey-900 font-xss mt-1">
                @
                {isMobile
                  ? authorNickname.length > 20
                    ? `${authorNickname.substring(0, 20)}...`
                    : authorNickname
                  : authorNickname}
              </h4>
            </Link>
            <span className="d-block font-xsss fw-500 mt-1 lh-3 text-grey-500">
              {createdAt ? TimeSinceDate(createdAt) : ""}
            </span>
          </div>
        )}
        {userId && (userId === authorId || userId === groupOwnerId) && (
          <div
            className="ms-auto pointer position-relative"
            onClick={() => setOpenSettings((open) => !open)}
            ref={settingsRef}
          >
            <i className="bi bi-three-dots h1 me-2 position-absolute right-0"></i>
            {openSettings && (
              <div
                className={`${styles["delete-post__btn"]} font-xsss border-0 py-2 px-3 py-1 rounded-3 cursor-pointer`}
                onClick={(e) => onDeletePost(e, postId)}
              >
                {tAction("delete")}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="card-body p-0 ms-1 mt-2 me-lg-6">
        <Box
          sx={{
            width: "100%",
            maxHeight: 500,
            overflow: "hidden",
          }}
        >
          <p className="fw-500 lh-26 font-xss w-100 mb-2">
            {expandPost
              ? content
              : content?.length > 150
                ? content?.substring(0, 150) + "..."
                : content}
            {content?.length > 150 && !expandPost ? (
              <span
                className={styles["expand-btn"]}
                onClick={() => setExpandPost((open) => !open)}
              >
                {tAction("see_more")}
              </span>
            ) : (
              ""
            )}
          </p>
          <Masonry columns={columnsCount}>
            {assets?.slice(0, 5).map(({ path, id }) =>
              path ? (
                <div key={id}>
                  <img
                    srcSet={`${path}?w=162&auto=format&dpr=2 2x`}
                    src={`${path}?w=162&auto=format`}
                    alt={id}
                    loading="lazy"
                    style={{
                      borderBottomLeftRadius: 4,
                      borderBottomRightRadius: 4,
                      display: "block",
                      width: "100%",
                    }}
                  />
                </div>
              ) : null,
            )}
          </Masonry>
        </Box>
      </div>

      <div className="card-body d-flex p-0 mt-4">
        {/* Like & comment */}
        {userId !== authorId && postType === "nft" ? (
          <button
            className={`${isBuyingNFT ? "btn-loading" : "bg-current"} main-btn py-1 w125 px-3 border-0 rounded-xxl`}
            onClick={onBuyNFTHandler}
            disabled={isBuyingNFT ? true : false}
          >
            {isBuyingNFT ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              tNFT("buy_nft")
            )}
          </button>
        ) : (
          <div className="d-flex">
            <div className="emoji-bttn pointer d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xsss me-3">
              <i
                className={`${isLiked ? "bi-heart-fill" : "bi-heart"} bi h2 m-0 me-2 d-flex align-items-center cursor-pointer`}
                onClick={(e) => onClickLikeHandler(e, postId, like)}
              ></i>
              <span className="like-number">
                {likeNum >= 1000
                  ? Math.round(likeNum / 1000).toFixed(1)
                  : likeNum}
              </span>
              <span className="like-thousand">
                {likeNum >= 1000 ? "k" : ""}
              </span>
            </div>
            <div
              className={`${styles["post-comment"]} d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xsss`}
              onClick={() => onShowCommentHandler(postId.toString())}
            >
              <i className="bi bi-chat h2 m-0 me-2 d-flex align-items-center"></i>
              <span className="d-none-xss">
                <RoundedNumber
                  num={commentNum}
                  unitSingular={tBase("comment")}
                  unitPlural={tBase("comments")}
                />
              </span>
            </div>
          </div>
        )}
        {/* Donate & Share */}
        <div
          className="pointer ms-auto d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xsss gap-3"
          // id={`dropdownMenu${props.id}`}
          data-bs-toggle="dropdown"
          aria-expanded="false"
          // onClick={() => toggleOpen((prevState) => !prevState)}
        >
          {userId !== postAuthor.userId &&
            postAuthor.role.name === "broker" && (
              <div
                className="d-flex align-items-center cursor-pointer"
                onClick={onDonateHandler}
              >
                <i className="bi bi-cash-coin me-1 text-grey-700 font-md text-dark"></i>
                <span className="d-none-xs">{tPost("donate")}</span>
              </div>
            )}
          <div className="d-flex align-items-center cursor-pointer">
            <i className="bi bi-share me-1 text-grey-700 text-dark font-sm"></i>
            <span className="d-none-xs">{tPost("share")}</span>
          </div>
        </div>

        {/* <div
          className="dropdown-menu dropdown-menu-end p-4 rounded-3 border-0 shadow-lg right-0"
          aria-labelledby={`dropdownMenu${props.id}`}
        >
          <h4 className="fw-700 font-xss text-grey-900 d-flex align-items-center">
            Share{" "}
            <i className="feather-x ms-auto font-xssss btn-round-xs bg-greylight text-grey-900 me-2"></i>
          </h4>
          <div className="card-body p-0 d-flex">
            <ul className="d-flex align-items-center justify-content-between mt-2">
              <li className="me-1">
                <span className="btn-round-lg pointer bg-facebook">
                  <i className="font-xs ti-facebook text-white"></i>
                </span>
              </li>
              <li className="me-1">
                <span className="btn-round-lg pointer bg-twiiter">
                  <i className="font-xs ti-twitter-alt text-white"></i>
                </span>
              </li>
              <li className="me-1">
                <span className="btn-round-lg pointer bg-linkedin">
                  <i className="font-xs ti-linkedin text-white"></i>
                </span>
              </li>
              <li className="me-1">
                <span className="btn-round-lg pointer bg-instagram">
                  <i className="font-xs ti-instagram text-white"></i>
                </span>
              </li>
              <li>
                <span className="btn-round-lg pointer bg-pinterest">
                  <i className="font-xs ti-pinterest text-white"></i>
                </span>
              </li>
            </ul>
          </div>
          <div className="card-body p-0 d-flex">
            <ul className="d-flex align-items-center justify-content-between mt-2">
              <li className="me-1">
                <span className="btn-round-lg pointer bg-tumblr">
                  <i className="font-xs ti-tumblr text-white"></i>
                </span>
              </li>
              <li className="me-1">
                <span className="btn-round-lg pointer bg-youtube">
                  <i className="font-xs ti-youtube text-white"></i>
                </span>
              </li>
              <li className="me-1">
                <span className="btn-round-lg pointer bg-flicker">
                  <i className="font-xs ti-flickr text-white"></i>
                </span>
              </li>
              <li className="me-1">
                <span className="btn-round-lg pointer bg-black">
                  <i className="font-xs ti-vimeo-alt text-white"></i>
                </span>
              </li>
              <li>
                <span className="btn-round-lg pointer bg-whatsup">
                  <i className="font-xs feather-phone text-white"></i>
                </span>
              </li>
            </ul>
          </div>
          <h4 className="fw-700 font-xssss mt-4 text-grey-500 d-flex align-items-center mb-3">
            Copy Link
          </h4>
          <i className="feather-copy position-absolute right-35 mt-3 font-xs text-grey-500"></i>
          <input
            type="text"
            placeholder="https://socia.be/1rGxjoJKVF0"
            className="bg-grey text-grey-500 font-xssss border-0 lh-32 p-2 font-xssss fw-600 rounded-3 w-100 theme-dark-bg"
          />
        </div> */}
      </div>
      {/* All comments */}
      {isLoading && <DotWaveLoader />}
      {openComments && !isLoading && (
        <Comments
          comments={comments}
          page={page}
          totalPage={totalPage}
          take={take}
          postId={postId}
          setCommentNum={setCommentNumHandler}
          postAuthor={authorId}
        />
      )}
      {isMobile && openMobileComments && (
        <PostModal
          groupOwnerId={groupOwnerId}
          show={openMobileComments}
          curUser={userId as number | undefined}
          postAuthor={postAuthor}
          community={community}
          postId={postId}
          content={content}
          assets={assets}
          createdAt={createdAt}
          columnsCount={columnsCount}
          like={likeNum}
          comment={commentNum}
          liked={isLiked}
          handleClose={handleClose}
          updateLike={updateLikeHandler}
          updateComments={updateCommentHandler}
          updateIsLiked={setIsLiked}
          setPostHandler={setPostHandler}
        />
      )}
      {openDonate && (
        <DonateModal
          handleClose={() => setOpenDonate(false)}
          show={openDonate}
          brokerData={postAuthor as IUserInfo | User}
        />
      )}
    </div>
  );
}
