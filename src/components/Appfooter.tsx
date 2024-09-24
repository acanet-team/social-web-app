import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { IUser } from "@/api/auth/auth.model";

export default function Appfooter() {
  const { data: session } = useSession() as any;
  const [userInfo, setUserInfo] = useState<IUser>({} as IUser);
  const [nickName, setNickName] = useState();
  const userId = session?.user?.id;
  useEffect(() => {
    if (session) {
      setNickName(session?.user?.userProfile?.nickName);
      setUserInfo({
        ...session.user,
        avatar: session.user?.photo?.path || "/assets/images/user.png",
      });
    }
  }, [session]);

  return (
    <div className="app-footer border-0 shadow-lg bg-primary-gradiant">
      {/* <Link href={`/profile/${nickName}`} className="nav-content-bttn nav-center">
        <i className="feather-user"></i>
      </Link> */}
      <Link href="/" className="nav-content-bttn nav-center">
        <i className="feather-home"></i>
      </Link>
      <Link href="/communities" className="nav-content-bttn">
        <i className="feather-grid"></i>
      </Link>
      <Link href="/defaultlive" className="nav-content-bttn" data-tab="chats">
        <i className="feather-inbox"></i>
      </Link>
      <Link href="/signal" className="nav-content-bttn">
        <i className="feather-trending-up"></i>
      </Link>
      <Link href="/listrequest" className="nav-content-bttn">
        <Image
          src="/assets/images/iconListRequest.svg"
          alt=""
          width={25}
          height={25}
          className="w25 rounded-circle shadow-xss"
          style={{ objectFit: "cover" }}
        />
      </Link>
      <Link
        href={nickName ? `/profile/${nickName}` : "#"}
        className="nav-content-bttn"
      >
        {userInfo.avatar && (
          <Image
            src={userInfo.avatar}
            alt="user"
            width={40}
            height={40}
            className="w40 rounded-circle shadow-xss"
            style={{ objectFit: "cover" }}
          />
        )}
      </Link>
    </div>
  );
}
