"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import useAuthStore from "@/store/auth";

export default function Appfooter() {
  const session = useAuthStore((state) => state.session);
  const userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "{}");
  const photo = userInfo?.session?.user?.photo?.path;
  return (
    <div className="app-footer border-0 shadow-lg bg-primary-gradiant">
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
