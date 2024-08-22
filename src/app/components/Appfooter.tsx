"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useAuthStore from "@/store/auth";
import { userInfo } from "os";

export default function Appfooter() {
  const session = useAuthStore((state) => state.session);
  const [photo, setPhoto] = useState<string>();
  const userId = session?.user?.id; //fix
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "{}");
    const photo = userInfo?.session?.user?.photo?.path;
    setPhoto(photo);
  }, []);
  return (
    <div className="app-footer border-0 shadow-lg bg-primary-gradiant">
      <Link href={`/profile/${userId}`} className="nav-content-bttn nav-center">
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
        <Image
          src={photo ? photo : "/assets/images/user.png"}
          alt="user"
          width={30}
          height={40}
          className="w30 shadow-xss"
        />
      </Link>
    </div>
  );
}
