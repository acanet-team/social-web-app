import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { IUser } from "@/api/auth/auth.model";

export default function Appfooter() {
  const { data: session } = useSession() as any;
  const [userInfo, setUserInfo] = useState<IUser>({} as IUser);
  const [id, setId] = useState();
  useEffect(() => {
    if (session) {
      setId(session?.user?.id);
      setUserInfo({
        ...session.user,
        avatar: session.user.photo.path || "/assets/images/user.png",
      });
    }
  }, [session]);

  return (
    <div className="app-footer border-0 shadow-lg bg-primary-gradiant">
      <Link href={`/profile/${id}`} className="nav-content-bttn nav-center">
        <i className="feather-user"></i>
      </Link>
      <Link href="/home" className="nav-content-bttn nav-center">
        <i className="feather-home"></i>
      </Link>
      <Link href="/defaultvideo" className="nav-content-bttn">
        <i className="feather-package"></i>
      </Link>
      <Link href="/defaultlive" className="nav-content-bttn" data-tab="chats">
        <i className="feather-layout"></i>
      </Link>
      <Link href="/shop2" className="nav-content-bttn">
        <i className="feather-layers"></i>
      </Link>
      <Link href="/defaultsettings" className="nav-content-bttn">
        {userInfo.avatar && (
          <Image
            src={userInfo.avatar}
            alt="user"
            width={40}
            height={40}
            className="w40 rounded-circle shadow-xss"
          />
        )}
      </Link>
    </div>
  );
}
